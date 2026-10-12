# Sistema de marca

Detalle completo en [`BRAND.md`](../../BRAND.md). Resumen operativo:

- **Única fuente de verdad:** `src/tokens.json` (escalas `primary` = rojo INACAP `#E30513` en 600,
  `secondary` = gris `#5A5B5E` en 700). El build genera las variables CSS `--primary-600`… y el
  DOCX lee el mismo archivo. No pegues hex en CSS ni en scripts.
- Para cambiar un color: edita `tokens.json` y reconstruye.
- Texto sobre rojo/gris: blanco (AA). Texto rojo sobre blanco: usa `primary-700` o más oscuro.
- Tipografía: Roboto 300/400/500/700 autohospedada (`@fontsource/roboto`, copiada en el build).
- Logo: `src/assets/inacap-logo.svg` (fondo claro) e `inacap-logo-white.svg` (fondo rojo). No
  recolorear, deformar ni añadir sombras.
- Portada: `src/styles/cover.css` + `renderCover` en `scripts/lib/html.mjs`; textos desde
  `report.config.yaml`.
