import { readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import {
	AlignmentType,
	BorderStyle,
	Document,
	ExternalHyperlink,
	Footer,
	Header,
	HeadingLevel,
	ImageRun,
	LevelFormat,
	Packer,
	PageNumber,
	Paragraph,
	ShadingType,
	Table,
	TableCell,
	TableOfContents,
	TableRow,
	TextRun,
	VerticalAlign,
	WidthType,
} from 'docx';
import { launchBrowser } from './browser.mjs';
import { flatColors } from './config.mjs';
import { createMarkdown } from './markdown.mjs';
import { SRC } from './paths.mjs';

const TWIPS_PER_CM = 567;
const PAGE_WIDTH = 12_240; // letter, 8.5in
const MARGIN = Math.round(2.5 * TWIPS_PER_CM);
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const MAX_IMAGE_PX = 600; // ~15.9 cm at 96 dpi
const FONT = 'Roboto';
const MONO = 'Consolas';

/** Rasterize any image (svg/png/jpg) to PNG with the system browser; returns data + size. */
async function createRasterizer() {
	const browser = await launchBrowser();
	const page = await browser.newPage({ deviceScaleFactor: 2 });
	const cache = new Map();
	return {
		async rasterize(file, width) {
			const key = `${file}:${width ?? ''}`;
			if (cache.has(key)) return cache.get(key);
			const bytes = await readFile(file);
			const mime = {
				'.jpg': 'image/jpeg',
				'.jpeg': 'image/jpeg',
				'.png': 'image/png',
				'.svg': 'image/svg+xml',
			}[extname(file).toLowerCase()];
			const url = `data:${mime};base64,${bytes.toString('base64')}`;
			await page.setContent(
				`<body style="margin:0;background:transparent"><img id="i" src="${url}" ${width ? `style="width:${width}px"` : ''}></body>`,
			);
			const image = page.locator('#i');
			await image.evaluate((element) => element.decode());
			const box = await image.boundingBox();
			const data = await image.screenshot({
				omitBackground: true,
				type: 'png',
			});
			const out = {
				data,
				height: Math.round(box.height),
				width: Math.round(box.width),
			};
			cache.set(key, out);
			return out;
		},
		close: () => browser.close(),
	};
}

/** Build the .docx from the same markdown the PDF uses. */
export async function buildDocx(markdown, meta, tokens, outFile) {
	const color = flatColors(tokens);
	const raster = await createRasterizer();
	try {
		const body = await convertBody(markdown, color, raster, meta);
		const logoWhite = await raster.rasterize(
			resolve(SRC, 'assets/inacap-logo-white.svg'),
			320,
		);
		const logo = await raster.rasterize(
			resolve(SRC, 'assets/inacap-logo.svg'),
			240,
		);

		const document = new Document({
			creator: 'INACAP',
			title: meta.titulo,
			description: meta.subtitulo,
			features: { updateFields: true },
			styles: buildStyles(color),
			numbering: { config: body.numbering },
			sections: [
				{
					properties: {
						page: {
							margin: {
								bottom: 0,
								footer: 0,
								header: 0,
								left: 0,
								right: 0,
								top: 0,
							},
							size: { height: 15_840, width: PAGE_WIDTH },
						},
					},
					children: buildCover(meta, color, logoWhite),
				},
				{
					properties: {
						page: {
							margin: {
								bottom: MARGIN,
								footer: 544,
								header: 448,
								left: MARGIN,
								right: MARGIN,
								top: MARGIN,
							},
							pageNumbers: { start: 2 },
							size: { height: 15_840, width: PAGE_WIDTH },
						},
					},
					headers: { default: buildHeader(meta, color, logo) },
					footers: { default: buildFooter(color) },
					children: [
						new Paragraph({
							children: [new TextRun('Contenido')],
							style: 'TocTitle',
						}),
						new TableOfContents('Contenido', {
							headingStyleRange: '1-2',
							hyperlink: true,
						}),
						...body.children,
					],
				},
			],
		});
		await writeFile(outFile, await Packer.toBuffer(document));
	} finally {
		await raster.close();
	}
}

function buildStyles(color) {
	const heading = (id, name, size, hex, extra = {}) => ({
		basedOn: 'Normal',
		id,
		name,
		next: 'Normal',
		quickFormat: true,
		paragraph: { alignment: AlignmentType.LEFT, keepNext: true, ...extra },
		run: { bold: true, color: hex, font: FONT, size },
	});
	return {
		default: {
			document: {
				paragraph: {
					alignment: AlignmentType.JUSTIFIED,
					spacing: { after: 160, line: 276 },
				},
				run: { color: color['secondary-900'], font: FONT, size: 22 },
			},
		},
		paragraphStyles: [
			heading('Heading1', 'Heading 1', 28, color['primary-700'], {
				border: {
					bottom: {
						color: color['primary-600'],
						size: 12,
						space: 4,
						style: BorderStyle.SINGLE,
					},
				},
				pageBreakBefore: true,
				spacing: { after: 240, before: 0 },
			}),
			heading('Heading2', 'Heading 2', 24, color['secondary-900'], {
				spacing: { after: 100, before: 280 },
			}),
			heading('Heading3', 'Heading 3', 22, color['secondary-700'], {
				spacing: { after: 80, before: 200 },
			}),
			heading('TocTitle', 'TOC Title', 28, color['primary-700'], {
				border: {
					bottom: {
						color: color['primary-600'],
						size: 12,
						space: 4,
						style: BorderStyle.SINGLE,
					},
				},
				spacing: { after: 240 },
			}),
			{
				basedOn: 'Normal',
				id: 'Caption',
				name: 'Caption',
				paragraph: {
					alignment: AlignmentType.CENTER,
					spacing: { after: 200 },
				},
				run: { color: color['secondary-700'], size: 18 },
			},
			{
				basedOn: 'Normal',
				id: 'Bibliografia',
				name: 'Bibliografia',
				paragraph: {
					alignment: AlignmentType.LEFT,
					indent: {
						hanging: 2 * TWIPS_PER_CM,
						left: 2 * TWIPS_PER_CM,
					},
				},
			},
		],
	};
}

function buildCover(meta, color, logoWhite) {
	const white = color.white;
	const cellMargin = {
		bottom: 0,
		left: 2.5 * TWIPS_PER_CM,
		right: 2.5 * TWIPS_PER_CM,
		top: 0,
	};
	const none = { color: 'auto', size: 0, style: BorderStyle.NONE };
	const noBorders = { bottom: none, left: none, right: none, top: none };
	const line = (text, run, paragraph = {}) =>
		new Paragraph({
			alignment: AlignmentType.LEFT,
			children: [new TextRun({ font: FONT, text, ...run })],
			...paragraph,
		});

	const hero = new TableRow({
		children: [
			new TableCell({
				borders: noBorders,
				children: [
					new Paragraph({
						alignment: AlignmentType.LEFT,
						children: [
							new ImageRun({
								data: logoWhite.data,
								transformation: { height: 74, width: 162 },
								type: 'png',
							}),
						],
						spacing: { after: 2600, before: 700 },
					}),
					line(
						meta.tipo.toUpperCase(),
						{
							characterSpacing: 40,
							color: color['primary-100'],
							size: 20,
						},
						{
							spacing: { after: 160 },
						},
					),
					line(
						meta.titulo,
						{ bold: true, color: white, size: 68 },
						{ spacing: { after: 200, line: 240 } },
					),
					line(
						meta.subtitulo,
						{ color: color['primary-50'], size: 28 },
						{ spacing: { after: 700 } },
					),
				],
				margins: cellMargin,
				shading: {
					fill: color['primary-600'],
					type: ShadingType.CLEAR,
				},
				verticalAlign: VerticalAlign.TOP,
				width: { size: PAGE_WIDTH, type: WidthType.DXA },
			}),
		],
		height: { rule: 'atLeast', value: 7_000 },
	});
	const stripe = new TableRow({
		children: [
			new TableCell({
				borders: noBorders,
				children: [
					new Paragraph({ children: [], spacing: { after: 0 } }),
				],
				shading: {
					fill: color['secondary-700'],
					type: ShadingType.CLEAR,
				},
				width: { size: PAGE_WIDTH, type: WidthType.DXA },
			}),
		],
		height: { rule: 'exact', value: 160 },
	});

	const field = (label, values) => [
		new Paragraph({
			alignment: AlignmentType.LEFT,
			children: [
				new TextRun({
					characterSpacing: 30,
					color: color['primary-700'],
					font: FONT,
					size: 16,
					text: label.toUpperCase(),
				}),
			],
			indent: { left: MARGIN },
			spacing: { after: 20, before: 280 },
		}),
		...[values].flat().map(
			(value, index, all) =>
				new Paragraph({
					alignment: AlignmentType.LEFT,
					border:
						index === all.length - 1
							? {
									bottom: {
										color: color['secondary-200'],
										size: 6,
										space: 4,
										style: BorderStyle.SINGLE,
									},
								}
							: undefined,
					children: [
						new TextRun({ font: FONT, size: 24, text: value }),
					],
					indent: { left: MARGIN, right: MARGIN },
					spacing: { after: index === all.length - 1 ? 40 : 0 },
				}),
		),
	];

	return [
		new Table({
			borders: {
				...noBorders,
				insideHorizontal: none,
				insideVertical: none,
			},
			columnWidths: [PAGE_WIDTH],
			rows: [hero, stripe],
			width: { size: PAGE_WIDTH, type: WidthType.DXA },
		}),
		...field('Asignatura', `${meta.asignatura} · ${meta.codigo}`),
		...field('Sección', meta.seccion),
		...field('Académico', meta.academico),
		...field('Integrantes', meta.integrantes ?? []),
		...field('Fecha de entrega', meta.fecha),
	];
}

function buildHeader(meta, color, logo) {
	const line = (text, run = {}) =>
		new Paragraph({
			alignment: AlignmentType.LEFT,
			children: [
				new TextRun({
					color: color['secondary-700'],
					font: FONT,
					size: 16,
					text,
					...run,
				}),
			],
			spacing: { after: 0, line: 240 },
		});
	const none = { color: 'auto', size: 0, style: BorderStyle.NONE };
	const noBorders = { bottom: none, left: none, right: none, top: none };
	const left = Math.round(CONTENT_WIDTH * 0.7);
	return new Header({
		children: [
			new Table({
				borders: {
					...noBorders,
					insideHorizontal: none,
					insideVertical: none,
				},
				columnWidths: [left, CONTENT_WIDTH - left],
				rows: [
					new TableRow({
						children: [
							new TableCell({
								borders: noBorders,
								children: [
									line(meta.area),
									line(meta.carrera),
									line(`${meta.asignatura}-${meta.codigo}`, {
										bold: true,
										color: color['primary-700'],
									}),
								],
								width: { size: left, type: WidthType.DXA },
							}),
							new TableCell({
								borders: noBorders,
								children: [
									new Paragraph({
										alignment: AlignmentType.RIGHT,
										children: [
											new ImageRun({
												data: logo.data,
												transformation: {
													height: 30,
													width: 66,
												},
												type: 'png',
											}),
										],
										spacing: { after: 0 },
									}),
								],
								width: {
									size: CONTENT_WIDTH - left,
									type: WidthType.DXA,
								},
							}),
						],
					}),
				],
				width: { size: CONTENT_WIDTH, type: WidthType.DXA },
			}),
		],
	});
}

function buildFooter(color) {
	return new Footer({
		children: [
			new Paragraph({
				alignment: AlignmentType.RIGHT,
				children: [
					new TextRun({
						children: [PageNumber.CURRENT],
						color: color['secondary-700'],
						font: FONT,
						size: 18,
					}),
				],
			}),
		],
	});
}

/** markdown-it tokens -> docx block elements. */
async function convertBody(markdown, color, raster, meta) {
	const md = createMarkdown(meta);
	const tokens = md.parse(markdown, {});
	const children = [];
	const numbering = [
		{
			reference: 'bullets',
			levels: [0, 1, 2].map((level) => ({
				alignment: AlignmentType.LEFT,
				format: LevelFormat.BULLET,
				level,
				style: {
					paragraph: {
						indent: { hanging: 280, left: 540 + level * 360 },
					},
					run: { color: color['primary-600'] },
				},
				text: ['•', '–', '·'][level],
			})),
		},
	];
	let orderedCount = 0;
	const listStack = [];
	let quoteDepth = 0;
	let index = 0;
	let inRefs = false;

	const inline = (token, base = {}) =>
		convertInline(token.children ?? [], base, color);

	while (index < tokens.length) {
		const token = tokens[index];
		switch (token.type) {
			case 'heading_open': {
				const level = Number(token.tag[1]);
				const { label, title } = token.meta ?? {};
				if (level === 1) inRefs = /referencias/iu.test(title ?? '');
				const text = [label, title ?? tokens[index + 1].content]
					.filter(Boolean)
					.join('  ');
				children.push(
					new Paragraph({
						children: [new TextRun(text)],
						heading:
							[
								HeadingLevel.HEADING_1,
								HeadingLevel.HEADING_1,
								HeadingLevel.HEADING_2,
								HeadingLevel.HEADING_3,
							][level] ?? HeadingLevel.HEADING_3,
					}),
				);
				index += 3;
				break;
			}
			case 'paragraph_open': {
				const inlineToken = tokens[index + 1];
				const listItem = inRefs ? undefined : listStack.at(-1);
				children.push(
					new Paragraph({
						alignment:
							listItem || quoteDepth
								? AlignmentType.LEFT
								: undefined,
						border: quoteDepth
							? {
									left: {
										color: color['primary-600'],
										size: 18,
										space: 8,
										style: BorderStyle.SINGLE,
									},
								}
							: undefined,
						children: inline(inlineToken),
						indent: quoteDepth ? { left: 300 } : undefined,
						style: inRefs ? 'Bibliografia' : undefined,
						numbering:
							listItem && !listItem.used
								? {
										level: listItem.level,
										reference: listItem.reference,
									}
								: undefined,
						shading: quoteDepth
							? {
									fill: color['primary-50'],
									type: ShadingType.CLEAR,
								}
							: undefined,
						spacing: listItem ? { after: 60 } : undefined,
					}),
				);
				if (listItem) listItem.used = true;
				index += 3;
				break;
			}
			case 'bullet_list_open':
			case 'ordered_list_open': {
				const ordered = token.type === 'ordered_list_open';
				let reference = 'bullets';
				if (ordered) {
					reference = `ordered-${++orderedCount}`;
					numbering.push({
						reference,
						levels: [0, 1, 2].map((level) => ({
							alignment: AlignmentType.LEFT,
							format: LevelFormat.DECIMAL,
							level,
							style: {
								paragraph: {
									indent: {
										hanging: 360,
										left: 540 + level * 360,
									},
								},
							},
							text: `%${level + 1}.`,
						})),
					});
				}
				listStack.push({
					level: listStack.length,
					ordered,
					reference,
					used: true,
				});
				index++;
				break;
			}
			case 'bullet_list_close':
			case 'ordered_list_close':
				listStack.pop();
				index++;
				break;
			case 'list_item_open': {
				const list = listStack.at(-1);
				const parent = list.reference;
				listStack[listStack.length - 1] = {
					...list,
					reference: parent,
					used: false,
				};
				index++;
				break;
			}
			case 'blockquote_open':
				quoteDepth++;
				index++;
				break;
			case 'blockquote_close':
				quoteDepth--;
				index++;
				break;
			case 'fence':
			case 'code_block':
				for (const line of token.content
					.replace(/\n$/u, '')
					.split('\n')) {
					children.push(
						new Paragraph({
							alignment: AlignmentType.LEFT,
							children: [
								new TextRun({
									font: MONO,
									size: 18,
									text: line || ' ',
								}),
							],
							shading: {
								fill: color['secondary-50'],
								type: ShadingType.CLEAR,
							},
							spacing: { after: 0 },
						}),
					);
				}
				children.push(
					new Paragraph({ children: [], spacing: { after: 120 } }),
				);
				index++;
				break;
			case 'hr':
				children.push(
					new Paragraph({
						border: {
							bottom: {
								color: color['secondary-300'],
								size: 6,
								space: 1,
								style: BorderStyle.SINGLE,
							},
						},
						children: [],
					}),
				);
				index++;
				break;
			case 'figure_open': {
				const image = tokens[index + 1].children[0];
				const src = image.attrGet('src');
				const caption = image.attrGet('title');
				const file = resolve(SRC, src);
				const { data, height, width } = await raster.rasterize(file);
				const scale = Math.min(1, MAX_IMAGE_PX / width);
				children.push(
					new Paragraph({
						alignment: AlignmentType.CENTER,
						children: [
							new ImageRun({
								altText: {
									description: image.content,
									name: image.content,
									title: image.content,
								},
								data,
								transformation: {
									height: Math.round((height * scale) / 2),
									width: Math.round((width * scale) / 2),
								},
								type: 'png',
							}),
						],
						keepNext: Boolean(caption),
						spacing: { after: 60, before: 120 },
					}),
				);
				if (caption)
					children.push(
						new Paragraph({
							children: [new TextRun(caption)],
							style: 'Caption',
						}),
					);
				index += 3;
				break;
			}
			case 'table_open': {
				const end = tokens.findIndex(
					(item, at) => at > index && item.type === 'table_close',
				);
				children.push(buildTable(tokens.slice(index, end + 1), color));
				children.push(
					new Paragraph({ children: [], spacing: { after: 120 } }),
				);
				index = end + 1;
				break;
			}
			default:
				index++;
		}
	}

	return { children, numbering };
}

function buildTable(tokens, color) {
	const rows = [];
	let cells = [];
	let isHeader = false;
	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];
		if (token.type === 'thead_open') isHeader = true;
		if (token.type === 'tbody_open') isHeader = false;
		if (token.type === 'tr_open') cells = [];
		if (token.type === 'th_open' || token.type === 'td_open') {
			const header = token.type === 'th_open';
			const content = tokens[index + 1];
			cells.push(
				new TableCell({
					children: [
						new Paragraph({
							alignment: AlignmentType.LEFT,
							children: convertInline(
								content.children ?? [],
								header
									? { bold: true, color: color.white }
									: {},
								color,
							),
							spacing: { after: 0 },
						}),
					],
					margins: { bottom: 70, left: 120, right: 120, top: 70 },
					shading: header
						? {
								fill: color['primary-800'],
								type: ShadingType.CLEAR,
							}
						: undefined,
				}),
			);
		}
		if (token.type === 'tr_close')
			rows.push(new TableRow({ children: cells, tableHeader: isHeader }));
	}
	const line = {
		color: color['secondary-300'],
		size: 4,
		style: BorderStyle.SINGLE,
	};
	return new Table({
		borders: {
			bottom: line,
			insideHorizontal: line,
			insideVertical: line,
			left: line,
			right: line,
			top: line,
		},
		rows,
		width: { size: CONTENT_WIDTH, type: WidthType.DXA },
	});
}

/** Inline tokens -> runs (bold, italic, code, links). */
function convertInline(tokens, base, color) {
	const runs = [];
	const state = { bold: false, italics: false };
	let link;
	const push = (text, extra = {}) => {
		const run = new TextRun({
			...base,
			...(state.bold && { bold: true }),
			...(state.italics && { italics: true }),
			...extra,
			text,
		});
		if (link) {
			runs.push(
				new ExternalHyperlink({
					children: [
						new TextRun({
							...base,
							color: color['primary-700'],
							text,
							underline: {},
						}),
					],
					link,
				}),
			);
			return;
		}
		runs.push(run);
	};
	for (const token of tokens) {
		switch (token.type) {
			case 'text':
				push(token.content);
				break;
			case 'code_inline':
				push(token.content, {
					font: MONO,
					shading: {
						fill: color['secondary-100'],
						type: ShadingType.CLEAR,
					},
					size: 19,
				});
				break;
			case 'strong_open':
				state.bold = true;
				break;
			case 'strong_close':
				state.bold = false;
				break;
			case 'em_open':
				state.italics = true;
				break;
			case 'em_close':
				state.italics = false;
				break;
			case 'link_open':
				link = token.attrGet('href');
				break;
			case 'link_close':
				link = undefined;
				break;
			case 'softbreak':
				push(' ');
				break;
			case 'html_inline':
				if (/^<br\s*\/?>$/u.test(token.content)) {
					runs.push(new TextRun({ break: 1 }));
				}
				break;
			case 'hardbreak':
				runs.push(new TextRun({ break: 1 }));
				break;
			default:
		}
	}
	return runs;
}
