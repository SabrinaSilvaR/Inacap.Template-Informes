# Plantilla de Informes INACAP

Escribe tu informe en Markdown y genera **PDF** y **DOCX** con la identidad INACAP (rojo/gris,
Roboto, logo), portada, índice automático, encabezado con logo y numeración.

## Requisitos

- Node `>=22` y pnpm `>=10`
- Microsoft Edge o Google Chrome instalado (se usa para paginar el PDF)

## Puesta en marcha

```bash
pnpm install
# 1. Edita los datos de portada
#    report.config.yaml
# 2. Escribe el informe
#    src/informe.md
pnpm build        # → .reports/informe.pdf y .reports/informe.docx
```

## Qué editar

| Quiero…                                 | Archivo              |
| --------------------------------------- | -------------------- |
| Cambiar título, asignatura, integrantes | `report.config.yaml` |
| Escribir el contenido                   | `src/informe.md`     |
| Agregar imágenes                        | `src/assets/`        |
| Cambiar colores de la marca             | `src/tokens.json`    |

Sintaxis (capítulos, tablas, figuras, referencias APA): `.ai/skills/report-authoring.md`.

## Notas

- El DOCX usa Roboto: instálala en tu equipo para verlo igual que el PDF.
- Al abrir el DOCX, Word pide actualizar campos (índice): acepta.
- Guía de marca: [`BRAND.md`](BRAND.md). Para agentes de IA: [`AGENTS.md`](AGENTS.md).
