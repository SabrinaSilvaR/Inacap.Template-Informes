# BRAND.md — Identidad INACAP para informes

Fuente de los valores: manual INACAP de redes sociales, tal como está aplicado en
`react-template-vite/uno.config.ts`. Los valores viven en [`src/tokens.json`](src/tokens.json).

## Paleta

| Rol                      | Token           | Hex       |
| ------------------------ | --------------- | --------- |
| Rojo INACAP (oficial)    | `primary-600`   | `#E30513` |
| Gris INACAP (oficial)    | `secondary-700` | `#5A5B5E` |
| Rojo texto/enlaces       | `primary-700`   | `#AD000A` |
| Rojo encabezado de tabla | `primary-800`   | `#8B0006` |
| Fondo suave rojo         | `primary-50`    | `#FFF4F2` |
| Texto cuerpo             | `secondary-900` | `#37383A` |
| Líneas / bordes          | `secondary-300` | `#C0C1C2` |

Las escalas 50–950 de `primary` y `secondary` están completas en `tokens.json`; sólo 600 (rojo) y
700 (gris) son colores oficiales, el resto está derivado.

## Reglas de uso

- **Nunca hex crudo** fuera de `tokens.json`. En CSS: `var(--primary-600)`.
- **Contraste (WCAG AA):** blanco sobre `primary-600` ≈ 4,9:1 y sobre `secondary-700` ≈ 6,8:1.
  Texto rojo sobre blanco: `primary-700` o más oscuro. Tablas: fondo `primary-800` + texto blanco.
- No transmitas información sólo con color.

## Tipografía

**Roboto** 300/400/500/700 (+ 400 cursiva), autohospedada vía `@fontsource/roboto`. Cuerpo 11 pt
justificado; capítulos 14 pt negrita; subcapítulos 12 pt negrita; pies de figura 9 pt; encabezado
8 pt. Código: Consolas.

## Logo

`src/assets/inacap-logo.svg` (fondo claro) · `inacap-logo-white.svg` (sobre rojo). No recolorear,
deformar, rotar ni añadir sombras. Altura mínima ≈ 20 px. Espacio de respeto igual a la altura del
isotipo.

## Portada

Bloque rojo (`primary-600`) con logo blanco, círculos tonales, tipo de documento en mayúsculas,
título 34 pt negrita y subtítulo; franja gris (`secondary-700`); rejilla de metadatos con etiquetas
rojas pequeñas; círculos suaves (`primary-50/100/200`, `secondary-100`) al pie. En DOCX es una
versión simplificada y editable (tabla roja, sin círculos).

## Formato de página (plantilla institucional)

Carta, márgenes 2,5 cm; portada sin número; encabezado interior de 3 líneas (área, carrera,
asignatura-código) + logo a la derecha; número de página a la derecha del pie; salto de página
antes de cada capítulo; referencias APA con sangría francesa de 2 cm.
