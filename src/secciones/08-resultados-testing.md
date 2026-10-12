# Resultados de testing y hallazgos

Las pruebas se ejecutaron sobre la versión final integrada del sistema de biblioteca, compuesta por un backend Django/DRF y un frontend React. Se combinaron pruebas automatizadas con validaciones manuales de los flujos críticos. El objetivo fue comprobar no solo el camino exitoso, sino también restricciones de negocio, validaciones de entrada, autenticación, autorización y comportamiento ante condiciones anómalas.

## Entorno y alcance de verificación

| **Elemento**               | **Configuración / resultado**                                                  |
| -------------------------- | ------------------------------------------------------------------------------ |
| Backend                    | Python 3.13.15 · Django 6.1.1 · Django REST Framework 3.18.1 · SimpleJWT 5.5.1 |
| Frontend                   | React 19.2.8 · Vite 8.2.2 · Vitest 5.0.0 · TypeScript 6.0.3                    |
| Persistencia del prototipo | SQLite                                                                         |
| Chequeo Django             | System check identified no issues (0 silenced)                                 |
| Migraciones                | 0001\_initial y 0002\_user\_mfa\_enrollment aplicadas; sin cambios pendientes  |
| Tipo de ejecución          | Entorno local; backend y frontend integrados en localhost                      |

> **Alcance de las conclusiones.** Las pruebas realizadas permiten afirmar que los casos definidos fueron superados en el entorno evaluado. No se realizaron pruebas de penetración (DAST), fuzzing exhaustivo ni pruebas formales de carga; por tanto, no se declara ausencia total de vulnerabilidades ni capacidad productiva bajo alta concurrencia.

## Resultado de pruebas automatizadas

La ejecución completa del backend encontró 42 casos y finalizó sin fallos. En frontend, Vitest ejecutó 102 casos distribuidos en 18 archivos de prueba, también sin fallos. En conjunto se obtuvieron 144 pruebas automatizadas aprobadas.

| **Componente** | **Prueba / control** | **Resultado** | **Lectura del resultado**                |
| -------------- | -------------------- | ------------- | ---------------------------------------- |
| Backend        | Suite apiGit         | 42/42 PASS    | 0 fallos · 0 errores · 46,762 s          |
| Backend        | manage.py check      | PASS          | 0 issues                                 |
| Backend        | Migraciones          | PASS          | 2/2 aplicadas · sin cambios pendientes   |
| Frontend       | Vitest               | 102/102 PASS  | 18/18 archivos · 43,74 s                 |
| Frontend       | Build Vite           | PASS          | 312 módulos transformados · build 4,45 s |
| Frontend       | ESLint               | 0 errores     | 64 advertencias de estilo/mantenibilidad |
| Frontend       | Stylelint            | 0 errores     | 96 advertencias CSS                      |

## Trazabilidad de requerimientos hacia pruebas y evidencia

| **Req.**   | **Aspecto**                     | **Caso verificado**                                                                                  | **Evidencia**                | **Estado** |
| ---------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------- | ---------- |
| RF-01      | Autenticación con MFA           | Login + MFA válido; primer login requiere enrolamiento                                               | Automatizada + Figura 1      | PASS       |
| RF-01      | Protección del segundo factor   | Challenge expira a 300 s; 5 códigos erróneos lo invalidan; endpoint JWT solo con contraseña retirado | Automatizada                 | PASS       |
| RF-02      | Roles y gestión de personal     | OPERATOR no puede consultar/gestionar usuarios                                                       | Automatizada + Figura 2      | PASS       |
| RF-03      | Cuentas temporales              | Cuenta fuera de vigencia no inicia autenticación                                                     | Automatizada                 | PASS       |
| RF-05      | Disponibilidad del catálogo     | Consulta por barcode y cálculo de disponibilidad                                                     | Automatizada                 | PASS       |
| RF-06      | Registro de préstamo            | Alumno habilitado + ejemplar disponible genera préstamo                                              | Automatizada + Figura 3      | PASS       |
| RF-06      | Restricción de ejemplar ocupado | Segundo préstamo sobre ejemplar no disponible devuelve conflicto                                     | Automatizada                 | PASS       |
| RF-08      | Registro de devolución          | Devolución en plazo cambia estado y libera el ejemplar                                               | Automatizada + Figuras 4 y 5 | PASS       |
| RF-09      | Sanción por atraso              | Devolución tardía crea sanción y bloquea nuevos préstamos                                            | Automatizada                 | PASS       |
| Validación | RUT de alumno                   | RUT con dígito verificador incorrecto es rechazado                                                   | Automatizada + Figura 6      | PASS       |
| RNF-05     | Trazabilidad                    | Bitácora registra usuario, acción, registro, fecha/hora e IP                                         | Manual Figura 7              | PASS\*     |

\*PASS respecto de registro y consulta. La condición de “inmutabilidad” completa se analiza como riesgo residual en la sección 9, porque la API es de solo lectura pero el modelo AuditLog está registrado en el panel administrativo genérico de Django.

## Evidencia manual de los flujos críticos

Las siguientes capturas complementan los tests automatizados y demuestran el comportamiento visible del prototipo. Se seleccionaron casos representativos de autenticación, autorización, operación del negocio, validación y auditoría.

![Acceso exitoso del usuario admin con rol Administrador luego del flujo de autenticación.](assets/evidencias/figura-01.jpg 'Figura 1. Acceso exitoso del usuario admin con rol Administrador luego del flujo de autenticación. Fuente: Elaboración propia (2026).')

![Control de autorización: un Operador intenta ingresar a Gestión de Personal y recibe “Acceso restringido”.](assets/evidencias/figura-02.jpg 'Figura 2. Control de autorización: un Operador intenta ingresar a Gestión de Personal y recibe “Acceso restringido”. Fuente: Elaboración propia (2026).')

![Registro exitoso de préstamo de una Tablet Samsung Galaxy Tab A9 por un Operador.](assets/evidencias/figura-03.jpg 'Figura 3. Registro exitoso de préstamo de una Tablet Samsung Galaxy Tab A9 por un Operador. Fuente: Elaboración propia (2026).')

![Devolución localizada por código de ejemplar; el sistema identifica préstamo activo, alumno y vencimiento.](assets/evidencias/figura-04.jpg 'Figura 4. Devolución localizada por código de ejemplar; el sistema identifica préstamo activo, alumno y vencimiento. Fuente: Elaboración propia (2026).')

![Confirmación visible de la devolución registrada correctamente.](assets/evidencias/figura-05.jpg 'Figura 5. Confirmación visible de la devolución registrada correctamente. Fuente: Elaboración propia (2026).')

![Validación negativa: un RUT con dígito verificador incorrecto es rechazado antes del registro.](assets/evidencias/figura-06.jpg 'Figura 6. Validación negativa: un RUT con dígito verificador incorrecto es rechazado antes del registro. Fuente: Elaboración propia (2026).')

![Bitácora administrativa con fecha/hora, usuario, acción, registro e IP para préstamos, devoluciones e inicios de sesión.](assets/evidencias/figura-07.jpg 'Figura 7. Bitácora administrativa con fecha/hora, usuario, acción, registro e IP para préstamos, devoluciones e inicios de sesión. Fuente: Elaboración propia (2026).')

## Hallazgos obtenidos

| **ID** | **Hallazgo**                                                                          | **Impacto / interpretación**                                                                                                          | **Estado**      |
| ------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| H-01   | 144 de 144 pruebas automatizadas aprobaron.                                           | La versión evaluada satisface los casos automatizados definidos para autenticación, reglas de negocio, permisos y servicios frontend. | Conforme        |
| H-02   | Django check --deploy reportó 6 advertencias.                                         | El prototipo funciona en desarrollo, pero no debe desplegarse con la configuración actual sin hardening.                              | Pendiente prod. |
| H-03   | PyJWT advirtió una clave HMAC de 28 bytes, menor a los 32 recomendados para SHA-256.  | No causa fallo funcional, pero debilita la configuración criptográfica del entorno.                                                   | Pendiente prod. |
| H-04   | ESLint: 0 errores y 64 warnings; Stylelint: 0 errores y 96 warnings.                  | Existe deuda técnica menor en complejidad, orden, formato y consistencia CSS; no bloquea la compilación.                              | Mejorable       |
| H-05   | Vite advirtió compatibilidad futura por importación JSON en vite.config.ts.           | No afecta el build actual, pero conviene corregir antes de una versión mayor de Vite.                                                 | Mejorable       |
| H-06   | La API de bitácora es de solo lectura, pero AuditLog usa el admin genérico de Django. | La trazabilidad está demostrada, pero la inmutabilidad total frente a superusuarios no queda garantizada.                             | Riesgo residual |
