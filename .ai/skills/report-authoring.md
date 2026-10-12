# Redactar el informe

- El contenido va en `src/secciones/NN-*.md` (un archivo por capítulo, orden por prefijo
  numérico). Si no existe esa carpeta, se usa `src/informe.md`.
- La numeración se configura en `report.config.yaml`: `numeracion: arabigo | romano` y
  `capitulo_inicial` (primer número de capítulo).

- `# Título` = capítulo (salto de página; numeración automática según `numeracion`).
  `# Anexos {.sin-numero}` lo deja sin número.
- `## Título` = subcapítulo (numeración automática: `7.1`, `7.2`… en modo arábigo). `###` sin número.
- **Índice automático** a partir de `#` y `##`; no lo escribas a mano.
- Tablas Markdown estándar: encabezado rojo oscuro con texto blanco. Antes de la tabla, una
  línea que la introduzca; después, la fuente si no es propia.
- Figuras: `![descripción](assets/archivo.png "Figura 1. Pie. Fuente: Elaboración propia (2026).")`.
  Ruta relativa a `src/`; el título entre comillas es el pie de figura.
- Citas en bloque con `>`; bloques de código con triple acento grave (monoespaciada).
- Referencias: lista bajo `# Referencias bibliográficas`, APA 7, orden alfabético; la sangría
  francesa (2 cm) se aplica sola.
- Los comentarios `<!-- guía -->` no se imprimen; elimínalos antes de entregar.
- Cursiva con `*texto*`, negrita con `**texto**`. Typographer activo: comillas tipográficas y
  `--` → –.
- Imágenes nuevas van en `src/assets/`.
