import { createMarkdown } from './markdown.mjs';

const esc = (value) =>
	String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');

/** Decorative bottom shapes of the cover (tokens via CSS variables, no raw hex). */
const COVER_SHAPES = `
<svg class="cover-shapes" viewBox="0 0 816 121" preserveAspectRatio="none" aria-hidden="true">
	<circle cx="90" cy="150" r="120" fill="var(--primary-100)" />
	<circle cx="230" cy="170" r="110" fill="var(--primary-200)" opacity="0.7" />
	<circle cx="720" cy="165" r="130" fill="var(--secondary-100)" />
	<circle cx="610" cy="185" r="90" fill="var(--primary-50)" />
</svg>`;

/** Cover page markup. */
export function renderCover(meta, header = '') {
	const integrantes = (meta.integrantes ?? [])
		.map((name) => `<li>${esc(name)}</li>`)
		.join('');
	return `
<section class="cover">
	${header}
	<div class="cover-hero">
		<img class="cover-logo" src="assets/inacap-logo-white.svg" alt="INACAP" />
		<div class="cover-title-block">
			<p class="cover-eyebrow">${esc(meta.tipo)}</p>
			<div class="cover-title" role="heading" aria-level="1">${esc(meta.titulo)}</div>
			<p class="cover-subtitle">${esc(meta.subtitulo)}</p>
		</div>
	</div>
	<div class="cover-stripe"></div>
	<dl class="cover-meta">
		<div class="full"><dt>Asignatura</dt><dd>${esc(meta.asignatura)} · ${esc(meta.codigo)}</dd></div>
		<div><dt>Sección</dt><dd>${esc(meta.seccion)}</dd></div>
		<div><dt>Académico</dt><dd>${esc(meta.academico)}</dd></div>
		<div><dt>Integrantes</dt><dd><ul>${integrantes}</ul></dd></div>
		<div><dt>Fecha de entrega</dt><dd>${esc(meta.fecha)}</dd></div>
	</dl>
	${COVER_SHAPES}
</section>`;
}

/** Table of contents (page numbers resolved by Paged.js target-counter). */
export function renderToc(toc) {
	const items = toc
		.map(
			({ id, label, level, title }) =>
				`<li class="toc-${level}"><a href="#${id}"><span>${esc([label, title].filter(Boolean).join(' '))}</span><span class="dots"></span></a></li>`,
		)
		.join('');
	return `<h1 class="toc-title sin-numero">Contenido</h1><ul class="toc">${items}</ul>`;
}

/** Wrap each h1 section in <section>; "Referencias" gets the APA hanging indent. */
function wrapSections(html) {
	const parts = html.split(/(?=<h1[\s>])/u);
	return parts
		.map((part) => {
			if (!part.startsWith('<h1')) return part;
			const cls = /referencias/iu.test(part.slice(0, 200))
				? ' referencias'
				: '';
			return `<section class="chapter${cls}">${part}</section>`;
		})
		.join('\n');
}

/** Full HTML document of the report. */
export function renderDocument(markdown, meta) {
	const md = createMarkdown(meta);
	const env = {};
	const body = md.render(markdown, env);
	const header = `
<div class="running-header">
	<div>${esc(meta.area)}</div>
	<div>${esc(meta.carrera)}</div>
	<div><strong>${esc(meta.asignatura)}-${esc(meta.codigo)}</strong></div>
</div>`;
	return `<!doctype html>
<html lang="es-CL">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${esc(meta.titulo)} — ${esc(meta.asignatura)}</title>
	<link rel="stylesheet" href="report.css" />
</head>
<body>
${renderCover(meta, header)}
${renderToc(env.toc)}
${wrapSections(body)}
</body>
</html>`;
}
