# Estrategia de Pruebas, Validación y Seguridad

## Estrategia y Entorno de Pruebas

Para garantizar la confiabilidad del software antes de su entrega, se definió un plan de pruebas estructurado que abarca tres niveles de verificación:

1. **Pruebas Unitarias:** Validación de métodos y funciones aisladas, verificando cálculos y lógica de validación interna.
2. **Pruebas de Integración:** Verificación de la comunicación entre los endpoints de la API y el motor de base de datos.
3. **Pruebas de Aceptación y Usuario (UAT):** Ejecución de casos de uso completos por parte de los integrantes del equipo sobre un entorno con datos sintéticos representativos.

## Matriz de Casos de Prueba (CP)

La siguiente tabla resume los casos de prueba ejecutados para comprobar el cumplimiento de los requerimientos funcionales definidos:

| Caso de Prueba | Requerimiento | Descripción del Escenario | Resultado Esperado | Estado |
| -------------- | ------------- | ------------------------- | ------------------ | ------ |
| CP-01 | RF-01 | Inicio de sesión con credenciales válidas | El sistema autentica al usuario y redirige al panel principal con el token JWT correspondiente. | Aprobado |
| CP-02 | RF-01 | Intento de acceso con contraseña incorrecta | El sistema bloquea el ingreso y muestra un mensaje de advertencia sin exponer detalles internos. | Aprobado |
| CP-03 | RF-02 | Creación de un nuevo registro con campos obligatorios | El registro se almacena en la base de datos y se visualiza en la tabla principal con estado activo. | Aprobado |
| CP-04 | RF-02 | Intento de registrar un elemento con identificador duplicado | El sistema intercepta el conflicto y devuelve un error de validación 409 Conflict. | Aprobado |
| CP-05 | RF-03 | Filtrado dinámico por fecha y estado | La consulta retorna únicamente las filas coincidentes sin afectar la paginación global. | Aprobado |
| CP-06 | RF-05 | Verificación de bitácora tras modificación de datos | Se comprueba que la tabla de auditoría contenga el identificador del operador y los valores modificados. | Aprobado |

## Medidas de Seguridad y Mitigación de Riesgos

En concordancia con las recomendaciones del proyecto **OWASP Top 10**, se implementaron controles técnicos específicos:

- **Prevención de Inyecciones SQL:** Uso exclusivo de consultas parametrizadas a través del ORM, descartando sentencias concatenadas dinámicamente.
- **Protección contra Cross-Site Scripting (XSS):** Sanitización automática de salidas y escapado de caracteres especiales en el motor de plantillas de la interfaz.
- **Control de Acceso Basado en Roles (RBAC):** Validación en cada endpoint del backend para asegurar que ningún usuario pueda invocar métodos fuera de su perfil asignado.
