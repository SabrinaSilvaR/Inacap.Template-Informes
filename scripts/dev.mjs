import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';
import { argv, platform } from 'node:process';
import { prepareAssets } from './lib/assets.mjs';
import { loadConfig, loadMarkdown } from './lib/config.mjs';
import { renderDocument } from './lib/html.mjs';
import { BUILD, ROOT, SRC } from './lib/paths.mjs';

const START_PORT = 3000;
const MIME = {
	'.css': 'text/css',
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
};

/** Screen-only preview styling + scroll restore + live reload (never part of the PDF). */
const PREVIEW_SNIPPET = `
<style>
@media screen {
	html { background: var(--secondary-200); }
	.pagedjs_pages { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 24px 0; }
	.pagedjs_page { box-shadow: 0 2px 16px rgb(0 0 0 / 0.25); background: var(--white); flex: none; }
	#preview-badge { position: fixed; right: 16px; bottom: 16px; z-index: 10; padding: 6px 12px; border-radius: 999px;
		background: var(--secondary-900); color: var(--white); font: 500 12px Roboto, Arial, sans-serif; opacity: 0.9; }
	#preview-badge[data-state='error'] { background: var(--primary-700); }
}
@media print { #preview-badge { display: none; } }
</style>
<script>
window.PagedConfig = {
	after: () => {
		const saved = sessionStorage.getItem('informe-scroll');
		if (saved) window.scrollTo(0, Number(saved));
		const badge = document.getElementById('preview-badge');
		const pages = document.querySelectorAll('.pagedjs_page').length;
		badge.textContent = pages + ' páginas · en vivo';
	},
};
</script>
<script src="/__paged.js"></script>
<div id="preview-badge">Renderizando…</div>
<script>
const events = new EventSource('/__events');
events.addEventListener('reload', () => {
	sessionStorage.setItem('informe-scroll', String(window.scrollY));
	location.reload();
});
events.addEventListener('build-error', (event) => {
	const badge = document.getElementById('preview-badge');
	badge.dataset.state = 'error';
	badge.textContent = 'Error: ' + event.data;
});
</script>`;

const clients = new Set();
const notify = (event, data = '') => {
	for (const response of clients)
		response.write(`event: ${event}\ndata: ${data}\n\n`);
};

/** Rebuild assets + HTML into .reports/build. */
async function rebuild() {
	const { meta, tokens } = await loadConfig();
	await mkdir(BUILD, { recursive: true });
	await prepareAssets(tokens);
	const markdown = await loadMarkdown();
	await writeFile(
		resolve(BUILD, 'index.html'),
		renderDocument(markdown, meta),
	);
}

async function handle(request, response) {
	const { pathname } = new URL(request.url, 'http://localhost');
	if (pathname === '/__events') {
		response.writeHead(200, {
			'cache-control': 'no-cache',
			connection: 'keep-alive',
			'content-type': 'text/event-stream',
		});
		response.write('\n');
		clients.add(response);
		request.on('close', () => clients.delete(response));
		return;
	}
	if (pathname === '/__paged.js') {
		const script = await readFile(
			resolve(ROOT, 'node_modules/pagedjs/dist/paged.polyfill.js'),
		);
		response.writeHead(200, { 'content-type': MIME['.js'] });
		response.end(script);
		return;
	}
	const file =
		pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
	try {
		let body = await readFile(resolve(BUILD, `.${file}`));
		if (file === '/index.html') {
			body = Buffer.from(
				body
					.toString('utf8')
					.replace('</body>', `${PREVIEW_SNIPPET}\n</body>`),
			);
		}
		response.writeHead(200, {
			'cache-control': 'no-store',
			'content-type': MIME[extname(file)] ?? 'application/octet-stream',
		});
		response.end(body);
	} catch {
		response.writeHead(404).end();
	}
}

function listen(server, port) {
	return new Promise((done, fail) => {
		server.once('error', (error) => {
			if (error.code === 'EADDRINUSE') done(listen(server, port + 1));
			else fail(error);
		});
		server.listen(port, '127.0.0.1', () => done(port));
	});
}

function openBrowser(url) {
	if (platform === 'win32')
		spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore' });
	else
		spawn(platform === 'darwin' ? 'open' : 'xdg-open', [url], {
			stdio: 'ignore',
		});
}

await rebuild();
const server = createServer((request, response) => {
	handle(request, response).catch((error) => {
		console.error(error);
		response.writeHead(500).end();
	});
});
const port = await listen(server, START_PORT);
const url = `http://localhost:${port}/`;
console.info(`Vista en vivo → ${url}  (Ctrl+C para salir)`);
if (!argv.includes('--no-open')) openBrowser(url);

let timer;
const onChange = (_event, name) => {
	if (name?.endsWith('~')) return;
	clearTimeout(timer);
	timer = setTimeout(async () => {
		try {
			await rebuild();
			console.info(`Reconstruido (${name ?? 'cambio'})`);
			notify('reload');
		} catch (error) {
			console.error(error.message);
			notify('build-error', error.message.replaceAll('\n', ' '));
		}
	}, 200);
};
watch(SRC, { recursive: true }, onChange);
watch(resolve(ROOT, 'report.config.yaml'), onChange);
