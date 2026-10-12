# Correcciones o mejoras realizadas a partir de pruebas y feedback

Durante la Unidad 3 la solución evolucionó principalmente en el área de autenticación, integración entre frontend y backend y manejo de sesión. La regla utilizada fue detectar una debilidad, aplicar el cambio y volver a verificarla con pruebas automatizadas o manuales. La Entrevista 2 simulada se utilizó como instancia de validación de decisiones y prioridades; cuando una observación coincidía con una mejora ya aplicada, se registró como validación del cambio y no como una corrección ficticia posterior.

## Mejoras efectivamente incorporadas

| **ID** | **Problema / hallazgo**                                         | **Evidencia inicial**                                                                                                | **Corrección aplicada**                                                                                        | **Verificación**                                 |
| ------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| C-01   | Contrato de autenticación incompatible entre frontend y backend | El frontend antiguo esperaba un token inmediato y esquema Token; el backend final exigía challenge MFA y JWT Bearer. | AuthService, schemas y HttpClient adaptados a mfa\_challenge, access/refresh y Authorization: Bearer.          | 102/102 frontend + login manual                  |
| C-02   | Primer ingreso MFA poco operativo                               | Un usuario nuevo necesitaba un mecanismo guiado para configurar su segundo factor.                                   | Se agregó /auth/mfa/setup/ + /confirm/ y QR SVG generado localmente; JWT solo después de confirmar TOTP.       | Tests de enrolamiento MFA                        |
| C-03   | Posible bypass por endpoint JWT estándar                        | Una ruta basada solo en contraseña habría contradicho el requisito MFA.                                              | Se retiró el endpoint de obtención de token por contraseña; se conserva solo refresh.                          | test\_password\_only\_jwt\_endpoint\_is\_removed |
| C-04   | Expiración del access token durante una operación               | Una sesión podía interrumpirse a mitad de un turno.                                                                  | Refresh automático, reintento único y refresh compartido entre peticiones concurrentes.                        | Tests HttpClient de refresh/401/403/concurrencia |
| C-05   | Reutilización/abuso de desafíos MFA                             | Challenges largos o reutilizables aumentan exposición.                                                               | Expiración 300 s, 5 fallos, consumo al éxito, invalidación por nuevo login/cambio de contraseña/desactivación. | Suite MFA backend                                |
| C-06   | Exposición accidental de secretos MFA en gestión de usuarios    | Un CRUD o panel administrativo no debe devolver el secreto del autenticador.                                         | Secretos excluidos del serializer/admin; mfa\_confirmed solo lectura.                                          | Tests de no divulgación                          |
| C-07   | Compatibilidad con cuentas que ya tenían MFA                    | Una migración podía romper acceso de usuarios existentes.                                                            | Migración 0002 conserva secretos existentes y confirma solo esas cuentas.                                      | Migración aplicada + test específico             |

## Validación mediante Entrevista 2 simulada

| **Pregunta / feedback**                                                      | **Necesidad validada**                                             | **Decisión o evidencia**                                                                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| ¿Qué ocurre cuando un operador nuevo aún no tiene Authenticator configurado? | El cliente espera un flujo que no dependa de intervención técnica. | Se valida el enrolamiento por QR en el primer login y la confirmación TOTP previa a la sesión.           |
| ¿Cómo se evita que un operador de mesón vea o modifique personal?            | La restricción debe existir aunque el usuario conozca la URL.      | Se valida control de rol en backend y pantalla “Acceso restringido” para OPERATOR (Figura 2).            |
| ¿Qué pasa si el token vence mientras el bibliotecario está atendiendo?       | La sesión no debería fallar abruptamente en una operación normal.  | Se valida refresh automático y reintento único, manteniendo cierre de sesión si el refresh es rechazado. |
| ¿Cómo se demuestra quién hizo un préstamo o devolución?                      | El cliente necesita trazabilidad entre turnos.                     | Se valida la bitácora con usuario, acción, fecha/hora, registro e IP (Figura 7).                         |

## Mejoras detectadas que permanecen pendientes

La evaluación también generó mejoras que no se consideran “realizadas” porque todavía no están incorporadas. Se mantienen como backlog técnico para evitar confundir una recomendación con un control implementado.

| **Prioridad** | **Mejora pendiente**                                                                    | **Motivo**                                                                                       |
| ------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Alta          | Hardening de producción: HTTPS/HSTS, cookies Secure, DEBUG=False y SECRET\_KEY robusta. | Proviene directamente de los 6 warnings de check --deploy y del warning HMAC.                    |
| Alta          | Hacer AuditLog inmutable también desde /admin/ y añadir alerta/monitoreo.               | La API es de solo lectura, pero la integridad del log debe protegerse de modificación y borrado. |
| Media         | Reducir complejidad de funciones marcadas por ESLint y resolver warnings automáticos.   | Hay 64 warnings JS/TS; varias funciones tienen complejidad 17 frente a máximo 15.                |
| Media         | Normalizar CSS y selectores duplicados reportados por Stylelint.                        | 96 warnings CSS; 54 corregibles automáticamente.                                                 |
| Media         | Actualizar la importación JSON de vite.config.ts.                                       | Evita incompatibilidad cuando configLoader native se convierta en valor predeterminado.          |
| Media         | Pruebas de carga, DAST, backup y recuperación.                                          | No fueron parte de la verificación actual y son necesarias antes de producción.                  |
