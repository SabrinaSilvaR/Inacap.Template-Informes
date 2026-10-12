# Informe Evaluación 3 — mapa de los 13 ítems

Proyecto: **Sistema de Gestión de Biblioteca INACAP** · Ingeniería de Software (TI3V43) · Unidad 3.
Equipo: Pablo Herrera, Jesús Rincón, Sabrina Silva, Abraham Tapia.

Cada ítem vive en su propio archivo `src/secciones/NN-*.md` (se unen por orden numérico). La
portada (ítem 1) se genera desde `report.config.yaml`; los capítulos se numeran desde el **2**.
Los números de títulos (`2.`, `7.4`…) los pone el build: no los escribas a mano.

| #   | Ítem (instructivo)                         | Archivo                          | Estado                  |
| --- | ------------------------------------------ | -------------------------------- | ----------------------- |
| 1   | Portada e integrantes                      | `report.config.yaml`             | Faltan datos de cursada |
| 2   | Resumen del problema, usuarios y valor     | `02-resumen-problema.md`         | Redactado               |
| 3   | Cambios desde la UA2 y Entrevista 2 (A)    | `03-cambios-ua2-entrevista-2.md` | **Pendiente**           |
| 4   | Arquitectura y diagramas UML (C)           | `04-arquitectura-uml.md`         | **Pendiente**           |
| 5   | Prototipo, funcionalidades y evidencia (B) | `05-prototipo.md`                | **Pendiente**           |
| 6   | Despliegue / cloud (D)                     | `06-despliegue-cloud.md`         | **Pendiente**           |
| 7   | Matriz de casos de prueba (E)              | `07-matriz-casos-de-prueba.md`   | Redactado (31 casos)    |
| 8   | Resultados de testing y hallazgos (F)      | `08-resultados-testing.md`       | Redactado (7 figuras)   |
| 9   | Seguridad, OWASP y Ley 21.459 (G)          | `09-seguridad.md`                | Redactado               |
| 10  | Correcciones y mejoras (H)                 | `10-correcciones-mejoras.md`     | Redactado               |
| 11  | Calidad y confiabilidad (I)                | `11-calidad-confiabilidad.md`    | Redactado               |
| 12  | Uso de IA / agentes (J)                    | `12-uso-de-ia.md`                | **Pendiente**           |
| 13  | Conclusiones                               | `13-conclusiones.md`             | Redactado               |
| —   | Referencias (APA 7)                        | `99-referencias.md`              | Redactado               |

Un ítem pendiente contiene `<!-- PENDIENTE: … -->`; `pnpm build` lista los que faltan.
Al completarlo, borra ese comentario.

## Criterios del instructivo a no olvidar

- Trazabilidad: requerimiento → diseño/prototipo → prueba → evidencia.
- Al menos un diagrama UML pertinente (ítem 4).
- Casos de prueba con happy path, negativos, validaciones y un caso de permisos/seguridad (ítem 7).
- Decisiones de cloud, arquitectura, pruebas e IA **justificadas**, no puestas por cumplir.
- Evidencia de al menos una corrección derivada de pruebas, entrevista o revisión (ítem 10).
- Ley 21.459 solo "a nivel de reconocimiento"; sin afirmar cumplimiento legal.

## Figuras

Las capturas están en `src/assets/evidencias/figura-0N.jpg` y se citan en el texto como
"Figura N" (en el Word original eran E-01…E-07). Nuevas figuras: seguir la numeración.

## Revisiones pendientes entre ítems

- Ítem 8.3 (trazabilidad) usa 11 filas con RF/evidencia; la matriz del ítem 7 tiene 31 casos
  (CP-xx). No hay resultado explícito para RF-04, RF-07 (CP-12/13/14, CP-19/20, CP-30/31).
- El ítem 10.2 habla de una "Entrevista 2 simulada": el ítem 3 debe ser coherente con eso.
