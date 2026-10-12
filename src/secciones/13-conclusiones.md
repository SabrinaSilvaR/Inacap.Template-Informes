# Conclusiones

## Evolución de la propuesta

Durante la Unidad 3, el proyecto evolucionó desde una propuesta de sistema de gestión de biblioteca hacia un prototipo funcional con una arquitectura implementable, reglas de negocio verificables y controles de seguridad incorporados.

En la Unidad 2 se definió el problema principal: la biblioteca no contaba con un sistema confiable para administrar el inventario, controlar los préstamos y devoluciones, mantener la continuidad entre turnos y aplicar sanciones objetivas. A partir de esa definición se establecieron los actores, los requerimientos funcionales, las entidades principales y los flujos de negocio.

En la Unidad 3 se concretaron y reforzaron varios aspectos de la propuesta:

- Se implementó la integración entre el frontend React y el backend Django REST Framework.
- Se reemplazó el flujo de autenticación simple por un proceso basado en contraseña, desafío MFA y token JWT posterior a la verificación del segundo factor.
- Se incorporó un flujo de enrolamiento MFA mediante código QR para usuarios nuevos.
- Se retiró la posibilidad de obtener un token utilizando solamente usuario y contraseña.
- Se implementaron controles de expiración, límite de intentos y consumo de los desafíos MFA.
- Se incorporó renovación automática del access token cuando la sesión expira durante una operación.
- Se reforzaron los permisos de backend para diferenciar administradores y operadores.
- Se mantuvo la gestión de cuentas temporales y la desactivación lógica de usuarios para preservar el historial.
- Se implementaron los flujos de inventario, catálogo, préstamos, devoluciones y sanciones automáticas.
- Se incorporó una bitácora con información del usuario, acción, entidad, fecha/hora e IP.

Estos cambios permitieron que la solución tuviera mayor coherencia entre problema, requerimientos, diseño, prototipo, pruebas y controles de seguridad.

## Aspectos que quedaron validados

La verificación realizada permitió confirmar el comportamiento de los principales procesos críticos del sistema.

### Autenticación y control de acceso

Se validó que el acceso del personal requiere credenciales y segundo factor MFA. Para los usuarios nuevos, el sistema permite realizar el enrolamiento mediante un código QR y no entrega la sesión final hasta confirmar correctamente el código TOTP.

También se verificó que los desafíos MFA tengan una duración limitada, un número máximo de intentos y mecanismos de invalidación. Además, se comprobó que un operador no pueda acceder a las funciones administrativas de gestión de personal, debido a que la restricción se aplica tanto en la interfaz como en el backend.

### Gestión de usuarios

Se validó la creación y administración de usuarios según su rol. Las cuentas temporales pueden tener una fecha de caducidad y el sistema impide su autenticación cuando finaliza el período autorizado.

También se confirmó el uso de desactivación lógica. Esto permite bloquear el acceso de un usuario sin eliminar su identidad de los préstamos y eventos históricos asociados.

### Inventario y catálogo

El prototipo permite registrar categorías, títulos y ejemplares físicos, incluyendo recursos como libros, tablets, audífonos y accesorios. Los ejemplares poseen un identificador y un estado operativo, lo que permite consultar su disponibilidad y distinguir entre recursos disponibles, prestados, en mantenimiento o dados de baja.

### Préstamos y comprobantes

Se validó el registro de préstamos para estudiantes habilitados y ejemplares disponibles. El sistema verifica la elegibilidad del estudiante, registra el operador que ejecuta la operación, calcula la fecha límite y cambia el estado del ejemplar a prestado.

También se comprobó la generación del comprobante digital con los datos principales del préstamo y la marca temporal del envío. Para los equipos tecnológicos se controlan los plazos permitidos de 1, 3 o 6 horas.

### Devoluciones y sanciones

Se validó que una devolución actualice el préstamo, registre la hora real y el operador receptor, y devuelva el ejemplar al estado disponible. En caso de atraso, el sistema calcula y genera una sanción automática. En caso de devolución a tiempo, no se genera una sanción.

También se verificó que un estudiante con sanción vigente o préstamo vencido no pueda registrar nuevos préstamos.

### Resultados de las pruebas

La ejecución documentada alcanzó los siguientes resultados:

- 42 de 42 pruebas automatizadas del backend aprobadas.
- 102 de 102 pruebas del frontend aprobadas.
- 144 de 144 pruebas automatizadas aprobadas en total.
- Verificación de Django sin problemas reportados.
- Migraciones aplicadas sin cambios pendientes.
- Compilación del frontend completada correctamente.
- Pruebas manuales exitosas para autenticación, autorización, préstamo, devolución, validación de RUT y auditoría.

Estos resultados permiten afirmar que el prototipo cumple los casos automatizados y manuales definidos para los flujos evaluados en el entorno local.

## Valor entregado por la solución

La solución aporta una mejora concreta frente al problema original de la biblioteca. El control deja de depender exclusivamente de una planilla desactualizada, de registros verbales o de la memoria del operador de turno.

El prototipo centraliza la información y permite relacionar cada operación con un usuario, un estudiante, un ejemplar, una fecha y un estado. Esto mejora la trazabilidad entre turnos y facilita la revisión de responsabilidades. Además, la automatización de sanciones reduce la subjetividad en la atención y el comprobante digital entrega un respaldo tanto para el estudiante como para la biblioteca.

Desde el punto de vista de seguridad, MFA, roles, validadores, cuentas temporales, renovación controlada de sesión y bitácora entregan una base adecuada para proteger el sistema. Sin embargo, estos controles deben complementarse con medidas de endurecimiento antes de utilizar la aplicación en un ambiente institucional.

## Riesgos que permanecen

Aunque los casos evaluados fueron aprobados, el prototipo todavía presenta riesgos y limitaciones que deben resolverse antes de un despliegue productivo.

### Configuración de producción

El chequeo de despliegue de Django informó advertencias asociadas a la configuración de seguridad. Entre ellas se encuentran la falta de HTTPS obligatorio, HSTS no configurado, cookies de sesión y CSRF sin el atributo Secure, uso de DEBUG=True y necesidad de proteger adecuadamente las claves secretas.

La solución no debe desplegarse institucionalmente con la configuración de desarrollo actualmente evaluada.

### Protección de secretos y claves criptográficas

Se identificó una advertencia relacionada con una clave HMAC de 28 bytes, inferior a la longitud recomendada para SHA-256. Además, los secretos utilizados para MFA requieren una estrategia de protección en reposo y una administración segura mediante variables o servicios de secretos por ambiente.

### Inmutabilidad de la auditoría

La bitácora registra los eventos y la API de auditoría es de solo lectura. Sin embargo, el modelo AuditLog permanece disponible en el panel administrativo genérico de Django, por lo que un superusuario podría modificar o eliminar registros si no se aplican controles adicionales.

Por este motivo, se considera validada la existencia y consulta de la trazabilidad, pero no la inmutabilidad completa frente a todos los perfiles administrativos.

### Monitoreo y alertas

El prototipo registra eventos, pero todavía no cuenta con monitoreo centralizado ni alertas automáticas para detectar intentos repetidos de acceso, fallos de MFA, manipulación de logs u otros patrones anómalos.

### Rendimiento, concurrencia y disponibilidad

Las pruebas realizadas fueron locales y no incluyeron pruebas de carga, estrés o recuperación ante fallos. La persistencia utilizada en el prototipo es SQLite, por lo que no se puede afirmar que la aplicación tenga disponibilidad alta, redundancia o capacidad comprobada para una operación institucional simultánea.

Antes de producción se requiere evaluar una base de datos adecuada para concurrencia, como PostgreSQL, además de definir respaldos, restauración, monitoreo y continuidad operacional.

### Validación con usuarios reales

Las pruebas manuales y automatizadas demostraron el funcionamiento de los flujos definidos, pero todavía se requiere una validación con bibliotecarios y operadores reales. Esta instancia permitiría medir tiempos de atención, claridad de los mensajes, facilidad de uso, accesibilidad y comportamiento en situaciones reales de mesón.

### Deuda técnica

El frontend compiló correctamente, pero el análisis estático registró advertencias de ESLint y Stylelint. Estas advertencias no bloquearon las pruebas ni el build, aunque representan oportunidades de mejora en complejidad, formato, orden del código y consistencia de estilos.

## Conclusión general

El proyecto logró transformar una necesidad operacional concreta de la biblioteca en un prototipo funcional, verificable y coherente con los requerimientos definidos. La solución aborda los problemas principales de inventario, préstamos, devoluciones, sanciones, control de usuarios y trazabilidad.

La evidencia disponible demuestra que los flujos críticos evaluados funcionan correctamente en el entorno local: las 144 pruebas automatizadas fueron aprobadas y las validaciones manuales seleccionadas confirmaron el comportamiento visible de autenticación, permisos, préstamos, devoluciones, validaciones y auditoría.

Por lo tanto, se considera validada la factibilidad funcional del prototipo y la coherencia entre el problema, la propuesta, la arquitectura y las pruebas. No obstante, la solución aún debe considerarse una versión prototipal y no un sistema listo para producción. Los principales riesgos pendientes corresponden al hardening de seguridad, la protección de secretos, la inmutabilidad completa de la auditoría, el monitoreo, las pruebas de carga, los respaldos y la validación con usuarios reales.

En síntesis, el sistema constituye una base sólida para continuar hacia una implementación institucional, siempre que los riesgos identificados se incorporen como condiciones previas al despliegue y se mantenga la trazabilidad entre cada mejora, su prueba y la evidencia correspondiente.

## Acciones recomendadas antes de un despliegue institucional

1.  Configurar HTTPS obligatorio, HSTS, cookies seguras y DEBUG=False.
2.  Generar claves secretas robustas y separadas por ambiente.
3.  Proteger los secretos MFA en reposo y revisar su administración.
4.  Hacer que la bitácora sea realmente append-only, incluso frente al panel administrativo.
5.  Incorporar monitoreo, alertas, retención y respaldo de logs.
6.  Migrar desde SQLite a una base de datos preparada para concurrencia productiva.
7.  Ejecutar pruebas de carga, recuperación, DAST, SAST y análisis de dependencias.
8.  Realizar pruebas de usabilidad y accesibilidad con operadores de biblioteca.
9.  Resolver las advertencias relevantes de ESLint, Stylelint y configuración de Vite.
10. Definir un procedimiento de operación, respaldo, recuperación y respuesta ante incidentes.
