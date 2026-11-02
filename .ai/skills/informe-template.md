# Plantilla de Informes INACAP — Guía de Estructura y Capítulos

Esta guía documenta la estructura modular de la plantilla institucional de informes INACAP. Cada capítulo vive en su propio archivo dentro de `src/secciones/NN-*.md` y se unen automáticamente en orden alfanumérico durante el proceso de build.

## Estructura de Capítulos

| Capítulo        | Archivo                               | Descripción del Contenido                                      |
| --------------- | ------------------------------------- | -------------------------------------------------------------- |
| **Portada**     | `report.config.yaml`                  | Título, asignatura, carrera, docente y nómina de integrantes   |
| **Cap. 2**      | `02-contexto-y-problema.md`           | Justificación, definición del problema, objetivos y alcance    |
| **Cap. 3**      | `03-requerimientos-y-analisis.md`     | Actores, matriz de RF y matriz de RNF (ISO/IEC 25010)          |
| **Cap. 4**      | `04-arquitectura-y-diseno.md`         | Vista de arquitectura, diagrama de interacción y stack técnico |
| **Cap. 5**      | `05-implementacion-y-evidencias.md`   | Módulos del prototipo, evidencias visuales y código relevante  |
| **Cap. 6**      | `06-pruebas-y-calidad.md`             | Matriz de casos de prueba (CP), seguridad OWASP y validación   |
| **Cap. 7**      | `07-conclusiones-y-trabajo-futuro.md` | Cumplimiento de metas, lecciones aprendidas y trabajo futuro   |
| **Referencias** | `99-referencias.md`                   | Bibliografía en formato APA 7 con sangría francesa automática  |

## Convenciones de Formato

1. **Numeración Automática:** Los títulos `# Capítulo` y `## Subcapítulo` son numerados automáticamente por el motor de build (`2.`, `2.1`, etc.). No inserte números manuales en los encabezados.
2. **Figuras y Diagramas:** Utilice la sintaxis `![Pie de figura](ruta "Título descriptivo")`. El build lo transformará automáticamente en un elemento `<figure>` con `<figcaption>`.
3. **Identificadores:** Los códigos `RF-01`, `RNF-01`, `CP-01` son detectados automáticamente para prevenir quiebres de línea incómodos.
4. **Referencias APA:** El archivo final de referencias debe utilizar el sufijo `{.sin-numero}` en su título principal para excluirse de la numeración capitular.
