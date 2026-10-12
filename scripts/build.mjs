import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { argv } from 'node:process';
import { prepareAssets } from './lib/assets.mjs';
import { loadConfig } from './lib/config.mjs';
import { renderDocument } from './lib/html.mjs';
import { BUILD, OUT, SRC } from './lib/paths.mjs';

const only = argv.includes('--only')
	? argv[argv.indexOf('--only') + 1]
	: undefined;
const screenshots = argv.includes('--screenshots');
const wants = (target) => !only || only === target;

const { meta, tokens } = await loadConfig();
await mkdir(BUILD, { recursive: true });
await prepareAssets(tokens);

const markdown = await readFile(resolve(SRC, 'informe.md'), 'utf8');
await writeFile(resolve(BUILD, 'index.html'), renderDocument(markdown, meta));
console.info(`HTML  → ${resolve(BUILD, 'index.html')}`);

if (wants('pdf')) {
	const { buildPdf } = await import('./lib/pdf.mjs');
	const pages = await buildPdf(resolve(OUT, 'informe.pdf'), { screenshots });
	console.info(`PDF   → .reports/informe.pdf (${pages} páginas)`);
}

if (wants('docx')) {
	const { buildDocx } = await import('./lib/docx.mjs');
	await buildDocx(markdown, meta, tokens, resolve(OUT, 'informe.docx'));
	console.info('DOCX  → .reports/informe.docx');
}
