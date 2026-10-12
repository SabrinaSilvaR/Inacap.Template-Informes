# Ways of working — autonomía, calidad y usuarios no técnicos

Manual operativo de todo agente en este repo, sobre [`AGENTS.md`](../../AGENTS.md).

## 1. Para quién trabajas

- Quien pide suele ser **no técnico**: describe el tema, la asignatura y la entrega ("informe de
  avance para Metodología Ágil"). Traduce esa intención a la plantilla.
- **Espeja el idioma del usuario** al hablarle. El informe va en **español (es-CL)**; código,
  identificadores y comentarios en **inglés**.
- Explica en términos simples; si nombras algo técnico, di en una frase qué hace.

## 2. Por defecto, actúa

- Toma las decisiones técnicas por tu cuenta (tabla de §3).
- Pregunta **sólo** cuando la respuesta cambia el _contenido_ (qué dice el informe) y no puedes
  inferirla: 1–3 preguntas cortas, cada una con una opción recomendada.
- Declara los supuestos al cerrar ("asumí X — dime si no es así"). **Nunca inventes datos,
  citas ni referencias**: márcalos como pendientes.

## 3. Defaults técnicos

| Bifurcación       | Default                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| Contenido         | Markdown en `src/informe.md`; nada de HTML salvo necesidad real                      |
| Metadatos/portada | `report.config.yaml` (no editar HTML de portada para cambiar textos)                 |
| Color             | Sólo `src/tokens.json` / variables CSS `--primary-*`, `--secondary-*`; sin hex crudo |
| Tipografía        | Roboto autohospedada; nunca fuentes externas                                         |
| Títulos           | `#` capítulo (numeración romana automática), `##` subcapítulo (1., 2.…)              |
| Figuras           | `![alt](ruta "Figura N. Pie. Fuente: …")`; `alt` obligatorio                         |
| Referencias       | APA 7 bajo `# Referencias bibliográficas`                                            |
| Entregar          | `pnpm build` → `.reports/informe.pdf` y `.reports/informe.docx`                      |

## 4. Ajusta la ceremonia al cambio

- **Trivial** (corregir texto): hazlo, pasa la DoD, cierra en una línea.
- **Pequeño y claro:** plan breve en lenguaje llano, constrúyelo, pasa la DoD.
- **Informe nuevo o cambio estructural:** corre `sdd-informe.md`. Cada checkpoint en el idioma del
  usuario: _"esto entendí / esto escribiré / esto escribí / cómo verlo"_.

## 5. Definition of Done

- ☑️ `pnpm lint` y `pnpm format` limpios
- ☑️ `pnpm build` genera PDF y DOCX sin errores
- ☑️ **On-brand:** sin hex fuera de `tokens.json`, sólo Roboto, logo sin recolorear
- ☑️ **Accesible:** `alt` en imágenes, headings jerárquicos (sin saltar niveles), contraste AA
- ☑️ **Revisado de verdad:** abre el PDF (portada, índice con números correctos, saltos de
  capítulo, encabezado y pie); `pnpm build:pdf -- --screenshots` deja un PNG por página en
  `.reports/build/`
- ☑️ Sin texto de plantilla ni comentarios guía en la versión final

## 6. Cierre

Reporta en lenguaje llano: qué quedó, dónde están los archivos, supuestos y pendientes.
