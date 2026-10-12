# Build y exportación

```bash
pnpm build        # HTML + PDF + DOCX → .reports/
pnpm build:pdf    # sólo PDF (pnpm build:pdf -- --screenshots deja un PNG por página)
pnpm build:docx   # sólo DOCX
pnpm check        # inspecciona el PDF (páginas, tamaño, fuentes)
```

- **PDF:** Markdown → HTML (`markdown-it`) → paginado con Paged.js en Edge/Chrome (Playwright) →
  `.reports/informe.pdf`. Carta, márgenes 2,5 cm, portada sin número, índice con números de
  página, encabezado institucional, pie con número. Requiere Edge o Chrome instalado.
- **DOCX:** mismo Markdown → `docx` (npm). Portada editable (tabla roja), índice real de Word
  (se actualiza al abrir: acepta el aviso, o `Ctrl+A` y `F9`), encabezado con logo, pie con
  número. Instala Roboto en el equipo para verlo como el PDF; si no, Word sustituye la fuente.
- Paged.js sólo lee CSS servido por HTTP: `scripts/lib/pdf.mjs` levanta un servidor local efímero.
- Depurar paginación: `pnpm build:pdf -- --screenshots` y revisa `.reports/build/page-NN.png`.
