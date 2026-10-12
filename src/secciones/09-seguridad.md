# Seguridad: riesgos, controles y relación con buenas prácticas OWASP

El análisis de seguridad se realizó sobre los controles realmente presentes en la versión evaluada y los hallazgos obtenidos durante las pruebas. Se usa OWASP Top 10:2025 como marco de referencia de riesgos de aplicaciones web, junto con la Ley chilena N.º 21.459 sobre delitos informáticos. La mención de OWASP, ISO o normativa no constituye una certificación ni una declaración formal de cumplimiento; se emplea para justificar riesgos, controles y mejoras.

## Modelo de autenticación y autorización implementado

El acceso del personal se realiza en dos etapas. Primero se validan usuario y contraseña; luego el backend emite un mfa\_challenge temporal. El usuario debe completar un segundo factor TOTP de seis dígitos. Solo después de verificar o confirmar el MFA se entregan tokens JWT access y refresh. Para usuarios nuevos, el sistema incorpora un enrolamiento mediante QR y no entrega JWT antes de completar la confirmación del TOTP.

> **Controles verificados.** Challenge MFA con vigencia de 300 segundos; máximo 5 códigos incorrectos por desafío; nuevo login invalida el desafío anterior; cambio de contraseña o desactivación invalida desafíos pendientes; throttling de autenticación de 30 solicitudes/minuto; endpoint de JWT basado solo en contraseña retirado.

## Matriz de riesgos, controles y OWASP

| **ID** | **Riesgo**                                                     | **OWASP 2025**                             | **Control aplicado**                                                                  | **Evidencia**                                | **Riesgo residual**                                                                |
| ------ | -------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| R-01   | Acceso de un Operador a funciones administrativas              | A01: Pérdida de control de acceso          | IsAdminRole en backend + restricción en UI + endpoints autenticados                   | Test operator\_cannot\_see\_users + Figura 2 | Bajo, si el backend se mantiene como autoridad                                     |
| R-02   | Robo/abuso de contraseña o bypass del segundo factor           | A07: Fallas de autenticación               | MFA TOTP, challenge 5 min, 5 intentos, throttling, retiro del token por contraseña    | Tests MFA y login                            | No hay flujo de recuperación MFA; requiere definición segura                       |
| R-03   | Configuración insegura al pasar a producción                   | A02: Configuración de seguridad incorrecta | Variables de entorno y check --deploy como control preventivo                         | 6 warnings de Django                         | Alto hasta aplicar HTTPS/HSTS/cookies secure/DEBUG=False                           |
| R-04   | Clave JWT/secretos criptográficos insuficientemente protegidos | A04: Fallas criptográficas                 | JWT mediante SimpleJWT; secretos MFA no expuestos por API/admin                       | Warning HMAC 28 bytes                        | Debe fortalecerse SECRET\_KEY y cifrado en reposo de secretos MFA                  |
| R-05   | Entrada maliciosa o datos inválidos                            | A05: Inyección                             | Serializers DRF, validadores de RUT/correo/TOTP, ORM Django; no se observó SQL manual | Tests + Figura 6                             | Persisten riesgos web generales; se recomienda SAST/DAST en CI                     |
| R-06   | Falta de trazabilidad o manipulación de logs                   | A09: Fallas de registro y alertas          | AuditLog + API ReadOnly + acceso administrativo                                       | Figura 7                                     | Sin alerting/monitoreo central; admin Django aún puede requerir bloqueo de cambios |

## Análisis de los riesgos más relevantes

Control de acceso (A01). OWASP establece que el control de acceso debe implementarse en código confiable del lado servidor. En este proyecto, la interfaz evita que el Operador utilice Gestión de Personal y el backend refuerza la misma regla mediante IsAdminRole. La evidencia Figura 2 muestra el bloqueo visible y la suite automatizada confirma que un Operador no puede consultar usuarios. Por ello, el control no depende únicamente de ocultar opciones en React.

Autenticación (A07). La solución reduce el riesgo de una contraseña comprometida mediante MFA TOTP. Además, el desafío tiene caducidad, limita intentos, se consume al utilizarse correctamente y se invalida frente a eventos sensibles. El test password\_only\_jwt\_endpoint\_is\_removed verifica que no exista una ruta paralela para obtener JWT únicamente con contraseña.

Validación e inyección (A05). Los datos ingresan por serializers de DRF, que validan tipos y reglas; el RUT y los dominios de correo tienen validadores específicos y el código MFA acepta exactamente seis dígitos ASCII. La revisión del backend no evidenció consultas SQL manuales: las operaciones utilizan el ORM de Django. Esto reduce la exposición a inyección SQL, aunque no sustituye revisiones SAST/DAST en un despliegue real.

Configuración (A02) y criptografía (A04). El comando manage.py check --deploy identificó seis advertencias: HSTS no configurado, ausencia de redirección obligatoria a HTTPS, SECRET\_KEY de desarrollo/débil, cookies de sesión y CSRF sin atributo Secure y DEBUG=True. Durante los tests de JWT también se observó que la clave HMAC usada en el entorno tenía 28 bytes. Estos puntos no impidieron la ejecución local, pero deben resolverse antes de producción.

Registro y alertas (A09). La bitácora guarda quién hizo qué, sobre qué registro, cuándo y desde qué IP; esto se comprobó con los préstamos y devoluciones realizados por Jane. Sin embargo, el proyecto aún no implementa monitoreo central ni alertas automáticas. Además, la API de auditoría es ReadOnly, pero AuditLog se encuentra registrado mediante el administrador genérico de Django; por ello, la afirmación de “registro inmutable” requiere un refuerzo adicional frente a superusuarios.

## Relación con la Ley N.º 21.459

La Ley N.º 21.459 actualiza la legislación chilena sobre delitos informáticos y tipifica, entre otras conductas, el acceso ilícito y los ataques contra la integridad de sistemas y datos. El artículo 2 aborda el acceso a un sistema sin autorización o excediendo la autorización poseída. En el contexto de este proyecto, MFA, roles, autorización de backend y trazabilidad de operaciones son medidas coherentes con la necesidad de impedir accesos no autorizados y disponer de evidencia de actividad.

Esta relación se plantea a nivel de reconocimiento normativo, tal como solicita el instructivo. No se afirma que el prototipo constituya por sí mismo cumplimiento legal integral; un despliegue institucional requeriría evaluación formal de políticas, privacidad, retención, respuesta a incidentes y administración de accesos.

## Riesgos de seguridad pendientes antes de producción

- Configurar HTTPS obligatorio, HSTS, cookies seguras y DEBUG=False; generar una SECRET\_KEY larga, aleatoria y exclusiva del ambiente productivo.
- Proteger los secretos TOTP también en reposo. Aunque no se exponen por API ni por el UserAdmin, los campos mfa\_secret y mfa\_pending\_secret son recuperables desde la base de datos por diseño y requieren protección adicional en un entorno real.
- Convertir la bitácora en realmente append-only también para el panel /admin/, además de definir retención, respaldo y alertas ante patrones sospechosos.
- Incorporar análisis de dependencias, SAST/DAST y escaneo de seguridad al pipeline de integración antes de un despliegue institucional.
- Revisar la estrategia de almacenamiento de JWT. sessionStorage reduce persistencia en equipos compartidos, pero un XSS podría acceder a los tokens; se requiere defensa estricta contra XSS y evaluar cookies HttpOnly/Secure si la arquitectura lo permite.
