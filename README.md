# Plantilla de Informes Institucionales INACAP

Escribe tu informe en Markdown y genera automáticamente **PDF**, **DOCX** y **HTML** con la identidad corporativa oficial de INACAP (rojo/gris, tipografía Roboto, isotipo institucional), portada formal, tabla de contenidos automática con números de página, encabezado corrido con logo y numeración de capítulos.

## Requisitos

- Node `>=22` y pnpm `>=10`
- Microsoft Edge o Google Chrome instalado (utilizado para paginar el PDF con Paged.js)

## Puesta en Marcha

```bash
pnpm install

# 1. Configurar datos de portada e integrantes:
#    report.config.yaml

# 2. Iniciar servidor de previsualización en vivo (HMR):
pnpm dev      # Abre http://localhost:3000 con recarga automática

# 3. Compilar documentos finales:
pnpm build    # Genera .reports/informe.pdf y .reports/informe.docx
```

## Estructura de Edición

| Objetivo                                        | Archivo o Carpeta                                 |
| ----------------------------------------------- | ------------------------------------------------- |
| Cambiar título, asignatura, integrantes y fecha | `report.config.yaml`                              |
| Editar el contenido del informe                 | `src/secciones/` (archivos `02-*.md` a `99-*.md`) |
| Modificar o agregar diagramas Mermaid           | `src/diagramas/*.mmd`                             |
| Agregar imágenes o capturas de evidencia        | `src/assets/evidencias/`                          |
| Personalizar tokens de marca (colores)          | `src/tokens.json`                                 |

## Comandos Disponibles

```bash
pnpm dev         # Servidor de desarrollo con vista previa de páginas y recarga en vivo
pnpm build       # Genera HTML, PDF y DOCX completos en .reports/
pnpm build:pdf   # Genera únicamente el PDF (.reports/informe.pdf)
pnpm build:docx  # Genera únicamente el documento Word (.reports/informe.docx)
pnpm build:html  # Genera la vista web (.reports/build/index.html)
pnpm check       # Ejecuta validaciones de calidad sobre el PDF generado
pnpm format      # Formatea todos los archivos del proyecto con Prettier
pnpm lint        # Analiza el código con ESLint
```

## Guías de Referencia

- **Guía de marca:** [`BRAND.md`](BRAND.md)
- **Instrucciones para agentes de IA:** [`AGENTS.md`](AGENTS.md)
- **Estructura y capítulos:** [`.ai/skills/informe-template.md`](.ai/skills/informe-template.md)
- **Sintaxis y formateo de informes:** [`.ai/skills/report-authoring.md`](.ai/skills/report-authoring.md)
