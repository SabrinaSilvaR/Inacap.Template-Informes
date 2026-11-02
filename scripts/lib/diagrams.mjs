import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { launchBrowser } from './browser.mjs';
import { ROOT, SRC } from './paths.mjs';

const DIAGRAMS = resolve(SRC, 'diagramas');
const OUT = resolve(SRC, 'assets/diagramas');
const FONT_DIR = resolve(ROOT, 'node_modules/@fontsource/roboto/files');

const mtime = async (file) => {
	try {
		return (await stat(file)).mtimeMs;
	} catch {
		return 0;
	}
};

/** Mermaid theme built from the brand tokens (no raw hex outside tokens.json). */
function themeVariables({ colors }) {
	return {
		fontFamily: 'Roboto, Arial, sans-serif',
		lineColor: colors.secondary[700],
		primaryBorderColor: colors.primary[700],
		primaryColor: colors.primary[100],
		primaryTextColor: colors.secondary[900],
		secondaryColor: colors.secondary[100],
		tertiaryColor: colors.white,
		actorBkg: colors.primary[100],
		actorBorder: colors.primary[700],
		noteBkgColor: colors.secondary[50],
		noteBorderColor: colors.secondary[300],
		signalColor: colors.secondary[700],
		activationBkgColor: colors.primary[200],
	};
}

async function robotoCss() {
	const faces = [];
	for (const weight of [400, 700]) {
		const data = await readFile(
			resolve(FONT_DIR, `roboto-latin-${weight}-normal.woff2`),
		);
		faces.push(
			`@font-face{font-family:Roboto;font-weight:${weight};src:url(data:font/woff2;base64,${data.toString('base64')}) format('woff2')}`,
		);
	}
	return faces.join('');
}

/**
 * Render every src/diagramas/*.mmd to src/assets/diagramas/<name>.png (2x).
 * Skips diagrams whose PNG is newer than the source.
 * Returns the names that were rendered.
 */
export async function renderDiagrams(tokens) {
	let names = [];
	try {
		names = (await readdir(DIAGRAMS)).filter((name) =>
			name.endsWith('.mmd'),
		);
	} catch {
		return [];
	}
	await mkdir(OUT, { recursive: true });
	const stale = [];
	for (const name of names) {
		const target = resolve(OUT, `${basename(name, '.mmd')}.png`);
		if ((await mtime(target)) < (await mtime(resolve(DIAGRAMS, name)))) {
			stale.push(name);
		}
	}
	if (stale.length === 0) return [];

	const browser = await launchBrowser();
	try {
		const page = await browser.newPage({
			deviceScaleFactor: 2,
			viewport: { height: 1200, width: 1400 },
		});
		await page.setContent(
			`<style>${await robotoCss()} body{margin:0;background:#fff} #box{display:block;width:max-content;padding:12px;background:#fff} #box svg{max-width:none !important}</style><div id="box"></div>`,
		);
		await page.addScriptTag({
			content: await readFile(
				resolve(ROOT, 'node_modules/mermaid/dist/mermaid.min.js'),
				'utf8',
			),
		});
		await page.evaluate(
			(variables) =>
				globalThis.mermaid.initialize({
					startOnLoad: false,
					theme: 'base',
					flowchart: { nodeSpacing: 25, rankSpacing: 35, padding: 8 },
					class: { padding: 6 },
					themeVariables: variables,
				}),
			themeVariables(tokens),
		);
		for (const name of stale) {
			const code = await readFile(resolve(DIAGRAMS, name), 'utf8');
			await page.evaluate(async (source) => {
				const { svg } = await globalThis.mermaid.render(
					'diagram',
					source,
				);
				const box = document.querySelector('#box');
				box.innerHTML = svg;
				// Mermaid emits width="100%": pin the natural size from the viewBox.
				const element = box.querySelector('svg');
				const { height, width } = element.viewBox.baseVal;
				element.setAttribute('width', String(width));
				element.setAttribute('height', String(height));
				await document.fonts.ready;
			}, code);
			await page.locator('#box').screenshot({
				omitBackground: false,
				path: resolve(OUT, `${basename(name, '.mmd')}.png`),
			});
		}
	} finally {
		await browser.close();
	}
	return stale;
}
