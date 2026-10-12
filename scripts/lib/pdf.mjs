import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';
import { launchBrowser } from './browser.mjs';
import { BUILD, ROOT } from './paths.mjs';

const MIME = {
	'.css': 'text/css',
	'.html': 'text/html; charset=utf-8',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
};

/** Static server for .reports/build: Paged.js fetches CSS via XHR, which file:// blocks. */
function serveBuild() {
	const server = createServer(async (request, response) => {
		const { pathname } = new URL(request.url, 'http://localhost');
		const file =
			pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
		try {
			const body = await readFile(resolve(BUILD, `.${file}`));
			response.writeHead(200, {
				'content-type':
					MIME[extname(file)] ?? 'application/octet-stream',
			});
			response.end(body);
		} catch {
			response.writeHead(404).end();
		}
	});
	return new Promise((done) =>
		server.listen(0, '127.0.0.1', () => done(server)),
	);
}

/** Paginate with Paged.js inside Chromium and print to PDF. Returns page count. */
export async function buildPdf(outFile, { screenshots = false } = {}) {
	const server = await serveBuild();
	const browser = await launchBrowser();
	try {
		const page = await browser.newPage();
		page.on('pageerror', (error) =>
			console.warn('[pagedjs]', error.message),
		);
		await page.goto(`http://127.0.0.1:${server.address().port}/`);
		await page.addScriptTag({
			content: await readFile(
				resolve(ROOT, 'node_modules/pagedjs/dist/paged.polyfill.js'),
				'utf8',
			),
		});
		await page.waitForSelector('.pagedjs_pages .pagedjs_page', {
			timeout: 60_000,
		});
		await page.evaluate(() => document.fonts.ready);
		// Paged.js has no "done" flag in the polyfill: wait for the page count to settle.
		let previous = -1;
		for (let attempt = 0; attempt < 40; attempt++) {
			const count = await page.locator('.pagedjs_page').count();
			if (count === previous) break;
			previous = count;
			await page.waitForTimeout(700);
		}
		const pages = await page.locator('.pagedjs_page').count();
		if (screenshots) {
			for (let index = 0; index < pages; index++) {
				await page
					.locator('.pagedjs_page')
					.nth(index)
					.screenshot({
						path: resolve(
							BUILD,
							`page-${String(index + 1).padStart(2, '0')}.png`,
						),
					});
			}
		}
		await page.pdf({
			path: outFile,
			preferCSSPageSize: true,
			printBackground: true,
		});
		return pages;
	} finally {
		await browser.close();
		server.close();
	}
}
