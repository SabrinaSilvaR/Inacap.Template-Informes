import MarkdownIt from 'markdown-it';
import attrs from 'markdown-it-attrs';

const ROMAN = [
	[10, 'X'],
	[9, 'IX'],
	[5, 'V'],
	[4, 'IV'],
	[1, 'I'],
];

/** Integer -> roman numeral (1..39 is plenty for report chapters). */
export function toRoman(value) {
	let rest = value;
	let out = '';
	for (const [size, symbol] of ROMAN) {
		while (rest >= size) {
			out += symbol;
			rest -= size;
		}
	}
	return out;
}

/** Slug usable as an HTML id (es-CL accents stripped). */
export function slugify(text) {
	return text
		.normalize('NFD')
		.replaceAll(/[̀-ͯ]/gu, '')
		.toLowerCase()
		.replaceAll(/[^\da-z]+/gu, '-')
		.replaceAll(/^-+|-+$/gu, '');
}

/** Block image paragraph -> figure with caption from the image title. */
function figureRule(state) {
	const { tokens } = state;
	for (let index = 0; index < tokens.length - 2; index++) {
		const [open, inline, close] = [
			tokens[index],
			tokens[index + 1],
			tokens[index + 2],
		];
		const isSoleImage =
			open.type === 'paragraph_open' &&
			inline.type === 'inline' &&
			close.type === 'paragraph_close' &&
			inline.children?.length === 1 &&
			inline.children[0].type === 'image';
		if (!isSoleImage) continue;
		open.type = 'figure_open';
		open.tag = 'figure';
		close.type = 'figure_close';
		close.tag = 'figure';
	}
}

/**
 * Number h1 and h2, build ids and the TOC list.
 * mode 'romano' (default): I. / 1.   mode 'arabigo': 2. / 2.1 (start = first chapter number).
 */
function numberingRule(state, { mode = 'romano', start = 1 } = {}) {
	const toc = [];
	let chapter = start - 1;
	let section = 0;
	const { tokens } = state;
	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];
		if (token.type !== 'heading_open' || !['h1', 'h2'].includes(token.tag))
			continue;
		const title = tokens[index + 1].children
			.filter(
				(child) =>
					child.type === 'text' || child.type === 'code_inline',
			)
			.map((child) => child.content)
			.join('');
		const level = Number(token.tag[1]);
		const numbered = !(token.attrGet('class') ?? '').includes('sin-numero');
		let label = '';
		if (level === 1) {
			section = 0;
			if (numbered) {
				chapter++;
				label =
					mode === 'arabigo' ? `${chapter}.` : `${toRoman(chapter)}.`;
			}
		} else if (numbered) {
			{
				section++;
				label =
					mode === 'arabigo'
						? `${chapter}.${section}`
						: `${section}.`;
			}
		}
		const id = `${level === 1 ? 'sec' : 'sub'}-${slugify(title)}`;
		token.attrSet('id', id);
		token.meta = { label, level, title };
		toc.push({ id, label, level, title });
	}
	state.env.toc = toc;
}

const ID_PATTERN = /\b(?:RNF|RF|RN|CP|H|R|C)-\d{2}\b/gu;

/** Keep requirement/test IDs (RF-01, CP-12…) on one line: wrap them in a nowrap span. */
function nowrapIdsRule(state) {
	for (const block of state.tokens) {
		if (block.type !== 'inline' || !block.children) continue;
		const out = [];
		for (const child of block.children) {
			if (child.type !== 'text' || !child.content.match(ID_PATTERN)) {
				out.push(child);
				continue;
			}
			let last = 0;
			for (const match of child.content.matchAll(ID_PATTERN)) {
				const push = (type, content) => {
					const token = new state.Token(type, '', 0);
					token.content = content;
					out.push(token);
				};
				if (match.index > last)
					push('text', child.content.slice(last, match.index));
				push('html_inline', '<span class="id">');
				push('text', match[0]);
				push('html_inline', '</span>');
				last = match.index + match[0].length;
			}
			if (last < child.content.length) {
				const token = new state.Token('text', '', 0);
				token.content = child.content.slice(last);
				out.push(token);
			}
		}
		block.children = out;
	}
}

/** Build a markdown-it instance with the report rules installed. */
export function createMarkdown(meta = {}) {
	const numbering = {
		mode: meta.numeracion,
		start: meta.capitulo_inicial,
	};
	const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
	md.use(attrs);
	md.core.ruler.push('report_figure', figureRule);
	md.core.ruler.push('report_ids', nowrapIdsRule);
	md.core.ruler.push('report_numbering', (state) =>
		numberingRule(state, numbering),
	);

	md.renderer.rules.heading_open = (tokens, index, options, _env, self) => {
		const { label } = tokens[index].meta ?? {};
		const open = self.renderToken(tokens, index, options);
		return label ? `${open}<span class="num">${label}</span>` : open;
	};
	md.renderer.rules.image = (tokens, index, options, env, self) => {
		const token = tokens[index];
		token.attrSet('alt', token.content);
		const caption = token.attrGet('title');
		token.attrs = token.attrs.filter(([name]) => name !== 'title');
		const img = self.renderToken(tokens, index, options);
		return caption
			? `${img}<figcaption>${md.utils.escapeHtml(caption)}</figcaption>`
			: img;
	};
	return md;
}
