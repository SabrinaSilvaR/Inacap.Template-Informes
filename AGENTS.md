# AGENTS.md — Plantilla de Informes INACAP

> Fuente única de verdad, neutral a la herramienta, para todos los asistentes de IA. `CLAUDE.md`
> es un puntero delgado a este documento. Si editas las reglas, edítalas **aquí**.

Plantilla **corporativa INACAP** para producir **informes académicos** en **PDF y DOCX** a partir de
un único archivo **Markdown** (`src/informe.md`), con la identidad INACAP (rojo `#E30513`, gris
`#5A5B5E`, Roboto, logo) y el formato de la plantilla institucional de informes (carta, márgenes
2,5 cm, portada, índice, encabezado con logo, numeración, referencias APA).

## Cómo usar este documento

- Contrato de alto nivel. El detalle vive en [`.ai/`](.ai/README.md) y [`BRAND.md`](BRAND.md).
- **Lee primero** [`.ai/skills/ways-of-working.md`](.ai/skills/ways-of-working.md): autonomía,
  Definition of Done y cómo hablar con un usuario a menudo no técnico.

## Orden de prioridad

1. Instrucciones del usuario en el chat.
2. Este archivo.
3. `BRAND.md` y `.ai/skills/*`.
4. Patrones existentes en `src/` y `scripts/`.

## Stack

| Área        | Elección                                                  |
| ----------- | --------------------------------------------------------- |
| Contenido   | Markdown (`src/informe.md`) + `report.config.yaml`        |
| Render HTML | `markdown-it` + `markdown-it-attrs`                       |
| PDF         | Paged.js en Edge/Chrome vía `playwright-core`             |
| DOCX        | librería `docx` (npm)                                     |
| Marca       | `src/tokens.json` → variables CSS; Roboto (`@fontsource`) |
| Tooling     | ESLint + Prettier, pnpm, Node `>=22`                      |

## Comandos

```bash
pnpm start        # vista en vivo en http://localhost:3000 (recarga al guardar)
pnpm build        # HTML + PDF + DOCX → .reports/
pnpm build:pdf    # sólo PDF (añade -- --screenshots para PNG por página en .reports/build/)
pnpm build:docx   # sólo DOCX
pnpm check        # revisa el PDF generado
pnpm lint         # ESLint --fix
pnpm format       # Prettier --write
```

## Estructura

```
.
├─ report.config.yaml      # metadatos de portada/encabezado
├─ src/secciones/*.md      # el informe, un archivo por ítem (NN-nombre.md; 99 = referencias)
├─ src/tokens.json         # marca: única fuente de verdad de colores/fuentes
├─ src/styles/             # fonts.css · print.css · cover.css
├─ src/assets/             # logos INACAP + imágenes del informe
├─ scripts/                # build.mjs + lib/ (markdown, html, pdf, docx)
└─ .ai/                    # skills, plantillas
```

## Reglas críticas

1. **Idioma:** informe en español (es-CL); código/identificadores/comentarios en inglés.
2. **Markdown primero:** el contenido se escribe en `src/informe.md`; metadatos en
   `report.config.yaml`. No edites HTML generado (`.reports/`).
3. **Nunca hex crudo** fuera de `src/tokens.json`. Usa `var(--primary-600)` etc.
4. **Tipografía:** sólo Roboto autohospedada. Sin fuentes externas.
5. **Logo:** sin recolorear, deformar ni sombras.
6. **Accesibilidad:** `alt` en imágenes, headings sin saltar niveles, contraste AA (rojo sobre
   blanco sólo con `primary-700` o más oscuro).
7. **Nunca inventes** datos, citas ni referencias: márcalos como pendientes.
8. **Formato de código:** tabs (ancho 4), comillas simples, `;`, trailing commas.

## Verificación

No hay tests unitarios. Verifica con `pnpm lint`, `pnpm build` y **revisión visual del PDF**
(portada, índice con números correctos, saltos de capítulo, encabezado/pie). Ver la Definition of
Done en el manual de trabajo.

## Commits

Conventional Commits con Gitmoji: `<tipo>(<scope>) <gitmoji>: <descripción>` (≤ 72 caracteres),
p. ej. `feat(cover) ✨: portada con bloque rojo` o `fix(toc) 🐛: corrige numeración de páginas`.

## Deep references

| Documento                                          | Alcance                                      |
| -------------------------------------------------- | -------------------------------------------- |
| [Manual de trabajo](.ai/skills/ways-of-working.md) | Autonomía, defaults, Definition of Done      |
| [BRAND.md](BRAND.md)                               | Paleta, tipografía, logo, portada, AA        |
| [SDD informe](.ai/skills/sdd-informe.md)           | Loop brief → esquema → redacción → verificar |
| [Redacción](.ai/skills/report-authoring.md)        | Sintaxis Markdown del informe                |
| [Diagramas](.ai/skills/flowchart-diagrams.md)      | Modelado y diseño de diagramas con Mermaid   |
| [Export y build](.ai/skills/export-build.md)       | PDF/DOCX, depuración de paginación           |
| [README](README.md)                                | Puesta en marcha                             |
