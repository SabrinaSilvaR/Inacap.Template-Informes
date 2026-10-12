# SDD para informes

```
brief      → specs/NNN-slug/brief.md    (audiencia, objetivo, secciones, extensión, plazo)
esquema    → specs/NNN-slug/outline.md  (capítulos y subcapítulos, 1 línea de contenido c/u)
redactar   → src/informe.md             (texto, tablas, figuras, referencias)
verificar  → pnpm build + revisión visual + DoD (ways-of-working §5)
```

1. **Brief** — usa `.ai/templates/brief.template.md`. Rellena `report.config.yaml` con los datos
   de portada.
2. **Esquema** — respeta la estructura institucional: Introducción · Objetivos · Desarrollo ·
   Conclusiones · Referencias bibliográficas · Anexos. Extensiones de referencia: Introducción y
   Objetivos máx. 1 página; Conclusiones mín. 2 páginas.
3. **Redacción** — tercera persona, tiempo presente, párrafos justificados. Ver
   `report-authoring.md`.
4. **Verificación** — `pnpm build`, abre el PDF, recorre la DoD.

Ajusta la ceremonia: un cambio de texto no necesita brief.
