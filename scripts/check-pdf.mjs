import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { OUT } from './lib/paths.mjs';

/** Cheap sanity checks over the generated PDF (no external PDF library). */
const file = resolve(OUT, 'informe.pdf');
const raw = (await readFile(file)).toString('latin1');

const pages = (raw.match(/\/Type\s*\/Page[^s]/gu) ?? []).length;
const fonts = new Set(
	[...raw.matchAll(/\/BaseFont\s*\/(?:[A-Z]{6}\+)?([^\s/]+)/gu)].map(
		(match) => match[1],
	),
);
const letter =
	/\/MediaBox\s*\[\s*0\s+0\s+612(?:\.0+)?\s+792(?:\.0+)?\s*\]/u.test(raw);

const problems = [];
if (pages < 3)
	problems.push(`Pocas páginas (${pages}): falta portada/índice/contenido.`);
if (!letter) problems.push('El tamaño de página no es carta (612x792 pt).');
if (![...fonts].some((name) => /roboto/iu.test(name))) {
	problems.push(
		`Roboto no está embebida (fuentes: ${[...fonts].join(', ') || 'ninguna'}).`,
	);
}

console.info(
	`Páginas: ${pages} · Fuentes: ${[...fonts].join(', ')} · Carta: ${letter}`,
);
if (problems.length > 0) {
	console.error(problems.join('\n'));
	process.exitCode = 1;
}
