import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { BUILD, ROOT, SRC } from './paths.mjs';
import { tokensToCss } from './config.mjs';

/** Copy fonts, logos and generated token CSS into .reports/build. */
export async function prepareAssets(tokens) {
	await mkdir(resolve(BUILD, 'fonts'), { recursive: true });
	await mkdir(resolve(BUILD, 'assets'), { recursive: true });

	const fontDir = resolve(ROOT, 'node_modules/@fontsource/roboto/files');
	for (const weight of tokens.fonts.weights) {
		await cp(
			resolve(fontDir, `roboto-latin-${weight}-normal.woff2`),
			resolve(BUILD, 'fonts', `roboto-latin-${weight}-normal.woff2`),
		);
	}
	await cp(
		resolve(fontDir, 'roboto-latin-400-italic.woff2'),
		resolve(BUILD, 'fonts', 'roboto-latin-400-italic.woff2'),
	);
	await cp(resolve(SRC, 'assets'), resolve(BUILD, 'assets'), {
		recursive: true,
	});

	const css = [
		tokensToCss(tokens),
		await readFile(resolve(SRC, 'styles/fonts.css'), 'utf8'),
		await readFile(resolve(SRC, 'styles/print.css'), 'utf8'),
		await readFile(resolve(SRC, 'styles/cover.css'), 'utf8'),
	].join('\n');
	await writeFile(resolve(BUILD, 'report.css'), css);
}
