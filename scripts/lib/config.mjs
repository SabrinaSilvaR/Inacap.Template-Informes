import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { ROOT, SRC } from './paths.mjs';

/** Load report metadata and brand tokens. */
export async function loadConfig() {
	const meta = parse(
		await readFile(resolve(ROOT, 'report.config.yaml'), 'utf8'),
	);
	const tokens = JSON.parse(
		await readFile(resolve(SRC, 'tokens.json'), 'utf8'),
	);
	return { meta, tokens };
}

/** tokens.json -> CSS custom properties (--primary-600, --white…). */
export function tokensToCss(tokens) {
	const lines = [];
	for (const [name, value] of Object.entries(tokens.colors)) {
		if (typeof value === 'string') {
			lines.push(`\t--${name}: ${value};`);
			continue;
		}
		for (const [step, hex] of Object.entries(value)) {
			lines.push(`\t--${name}-${step}: ${hex};`);
		}
	}
	return `:root {\n${lines.join('\n')}\n}\n`;
}

/** Flatten the colors to { 'primary-600': '#E30513' } (hex without '#'). */
export function flatColors(tokens) {
	const out = {};
	for (const [name, value] of Object.entries(tokens.colors)) {
		if (typeof value === 'string') {
			out[name] = value.replace('#', '');
			continue;
		}
		for (const [step, hex] of Object.entries(value)) {
			out[`${name}-${step}`] = hex.replace('#', '');
		}
	}
	return out;
}

/** Concatenate src/secciones/NN-*.md in numeric order (falls back to src/informe.md). */
export async function loadMarkdown() {
	const dir = resolve(SRC, 'secciones');
	let files = [];
	try {
		files = (await readdir(dir))
			.filter((name) => name.endsWith('.md'))
			.sort();
	} catch {
		// no secciones/ folder: single-file report
	}
	if (files.length === 0) return readFile(resolve(SRC, 'informe.md'), 'utf8');
	const parts = await Promise.all(
		files.map((name) => readFile(resolve(dir, name), 'utf8')),
	);
	return parts.map((part) => part.trim()).join('\n\n');
}
