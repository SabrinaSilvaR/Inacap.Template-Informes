# Resumen del problema, usuarios y propuesta de valor

## Contexto del problema

La biblioteca de la institución administra libros y recursos tecnológicos, como tablets, audífonos y accesorios, que son entregados temporalmente a los estudiantes. Sin embargo, actualmente no cuenta con un sistema centralizado que permita controlar de manera confiable el inventario, los préstamos, las devoluciones y las sanciones.

El único intento previo de organización fue una planilla Excel que se encuentra desactualizada y no representa necesariamente el stock físico disponible. Además, parte de la información se comunica verbalmente o depende de la memoria del bibliotecario que atiende en un turno determinado. Esta situación dificulta conocer el estado real de los recursos y genera riesgos operacionales y de seguridad.

El problema no consiste únicamente en la ausencia de una herramienta informática. También existe una falta de reglas comunes y de trazabilidad entre los distintos turnos de atención. Como los cuatro bibliotecarios trabajan en horarios rotativos, una operación realizada por un funcionario puede no quedar disponible de forma clara para quien continúa el turno. A esto se suma la participación de ayudantes o trabajadores temporales, cuyos permisos deben estar limitados al período en que cumplen funciones.

## Problemas específicos y consecuencias

| Problema identificado                                                              | Consecuencia para la biblioteca                                                                                                                       | Necesidad que debe resolver la solución                                                                              |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| No existe un inventario confiable y actualizado de libros y equipos.               | Se producen discrepancias entre el stock registrado y el stock físico; las pérdidas pueden detectarse tarde o no atribuirse a una operación concreta. | Registrar cada recurso y ejemplar con un identificador único y consultar su estado actual.                           |
| No hay trazabilidad completa de los préstamos.                                     | No siempre es posible saber quién tiene un recurso, qué operador lo entregó, cuál era el plazo o cuándo debe ser devuelto.                            | Asociar cada préstamo con el estudiante, el ejemplar, el operador responsable, la fecha de inicio y la fecha límite. |
| Los operadores trabajan en turnos rotativos sin un registro común.                 | Se generan inconsistencias, duplicidad de información y decisiones diferentes frente a una misma situación.                                           | Mantener una fuente única de información accesible para los operadores autorizados.                                  |
| Las sanciones se aplican de manera subjetiva.                                      | Los estudiantes pueden recibir tratamientos distintos según el criterio o la memoria del operador de turno, sin una duración claramente respaldada.   | Calcular las sanciones mediante reglas automáticas y uniformes según el atraso registrado.                           |
| La hora de devolución se comunica verbalmente.                                     | El estudiante puede olvidar el plazo y la biblioteca no cuenta con una evidencia objetiva de la información entregada.                                | Generar un comprobante digital con el recurso, la fecha de préstamo y la hora límite exacta.                         |
| Existen operadores temporales o ayudantes con períodos de participación limitados. | Una cuenta podría permanecer habilitada después de que la persona deje de trabajar en la biblioteca.                                                  | Permitir cuentas temporales con fecha de expiración automática y desactivación lógica.                               |

## Usuarios y actores involucrados

La solución considera usuarios directos, usuarios indirectos y actores de apoyo o gobierno. No todos interactúan con la aplicación de la misma manera.

### Administrador o jefe de biblioteca

Es el responsable de configurar y supervisar la operación del sistema. Puede crear y administrar cuentas de otros administradores y operadores, asignar roles, definir la vigencia de cuentas temporales, desactivar usuarios mediante borrado lógico y consultar información global, reportes y bitácoras.

Su principal necesidad es mantener el control sobre las personas autorizadas y disponer de información confiable para supervisar el inventario y las operaciones de la biblioteca.

### Bibliotecario u operador de turno

Es el usuario operativo principal. Utiliza el sistema durante la atención en mesón para consultar recursos, verificar la elegibilidad de un estudiante, registrar préstamos, seleccionar el plazo correspondiente, registrar devoluciones y revisar el estado de los ejemplares.

Cada operación debe quedar asociada al operador que la ejecutó. De esta manera, el sistema permite mantener continuidad entre turnos y facilita la revisión posterior de las operaciones.

### Operador temporal o estudiante de apoyo

Realiza tareas de mesón similares a las del operador permanente, pero su acceso está limitado temporalmente. La cuenta debe incluir una fecha de inicio y una fecha de término, después de la cual el sistema debe impedir nuevos accesos sin depender de una desactivación manual.

Este actor requiere acceso suficiente para cumplir su función, pero no debe disponer de permisos administrativos para gestionar personal o modificar configuraciones sensibles.

### Estudiante o alumno solicitante

Es un usuario indirecto. No inicia sesión ni utiliza directamente la aplicación. Solicita el recurso en el mesón y entrega sus datos de identificación, como RUT o correo institucional @inacap o @inacapmail.

Su beneficio principal es recibir un comprobante digital con información clara sobre el recurso recibido y la fecha y hora límite de devolución. Además, el sistema permite verificar si posee préstamos vencidos o sanciones vigentes antes de autorizar una nueva operación.

### Equipo de TI y ciberseguridad

Es un actor indirecto relacionado con la administración técnica y la seguridad institucional. Su interés se centra en que la solución utilice autenticación robusta, control de roles, MFA, protección de datos, registro de eventos y configuraciones adecuadas para un eventual despliegue productivo.

## Necesidades de los usuarios

Las necesidades principales se pueden resumir de la siguiente manera:

- El administrador necesita controlar los usuarios, roles y vigencias sin perder el historial de operaciones.
- El operador necesita ejecutar préstamos y devoluciones rápidamente, con información actualizada y reglas claras.
- El operador temporal necesita contar con acceso limitado y automáticamente revocable.
- El estudiante necesita conocer con precisión el plazo de devolución y contar con un respaldo digital.
- La biblioteca necesita conservar trazabilidad de quién realizó cada operación y cuándo la realizó.
- La institución necesita reducir pérdidas, evitar accesos no autorizados y contar con una base para auditar incidentes.

## Alcance de la solución frente al problema

La propuesta consiste en una aplicación web de uso interno para el personal de biblioteca. El sistema permite registrar el inventario de libros y equipos, consultar la disponibilidad de ejemplares, gestionar préstamos y devoluciones, aplicar sanciones automáticas, administrar usuarios y mantener una bitácora de auditoría.

El sistema considera autenticación del personal mediante credenciales institucionales y segundo factor MFA. También diferencia entre administradores y operadores, y permite gestionar cuentas temporales con expiración programada.

El estudiante no utiliza directamente la aplicación. La atención continúa realizándose de forma presencial en el mesón, mientras que el operador registra la operación en el sistema y el comprobante se envía al correo institucional informado.

Quedan fuera del alcance el portal de autoservicio para estudiantes y los préstamos entre distintas sedes. La solución se concentra en resolver el control interno de inventario y la operación de préstamos de una biblioteca.

## Propuesta de valor

La propuesta de valor es entregar a la biblioteca una fuente única, trazable y segura para controlar sus recursos y operaciones de préstamo, reemplazando registros desactualizados y decisiones dependientes de la memoria del personal.

El valor se concreta en los siguientes beneficios:

1.  **Mayor control del inventario:** cada libro o equipo puede registrarse como un ejemplar identificable, con un estado actualizado como disponible, prestado, en mantenimiento o dado de baja.
2.  **Trazabilidad entre turnos:** cada préstamo y devolución conserva la identidad del operador responsable, el estudiante asociado, el ejemplar utilizado y las marcas temporales de la operación.
3.  **Atención más clara y respaldada:** el estudiante recibe un comprobante digital con la hora límite de devolución, reduciendo discusiones y olvidos.
4.  **Aplicación objetiva de sanciones:** el sistema calcula el bloqueo por atraso de acuerdo con reglas definidas, evitando diferencias basadas en el criterio personal de cada operador.
5.  **Acceso controlado:** los permisos se asignan según el rol y las cuentas temporales expiran automáticamente, reduciendo el riesgo de accesos posteriores al término de una ayudantía o reemplazo.
6.  **Base para una operación confiable:** la información centralizada permite consultar el estado real de los recursos y tomar decisiones con evidencia.

## Relación entre problema, solución y resultado esperado

| Problema de origen                          | Funcionalidad propuesta                                         | Resultado esperado                                                                |
| ------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Stock desconocido o desactualizado          | Inventario de categorías, títulos y ejemplares con código único | La biblioteca puede conocer qué recursos existen y cuáles están disponibles.      |
| Falta de información sobre los responsables | Registro del operador que entrega y recibe                      | Cada movimiento queda asociado a una persona y a un momento determinado.          |
| Inconsistencias entre turnos                | Catálogo y operaciones centralizadas                            | Todos los operadores consultan la misma información actualizada.                  |
| Sanciones subjetivas                        | Motor de sanciones automáticas por atraso                       | Los estudiantes reciben un tratamiento uniforme y verificable.                    |
| Plazos comunicados solo verbalmente         | Comprobante digital por correo institucional                    | El estudiante y la biblioteca cuentan con un respaldo de la hora límite.          |
| Permanencia de accesos temporales           | Fecha de caducidad y desactivación automática                   | Se reduce el riesgo de que una cuenta siga activa fuera de su período autorizado. |

## Síntesis

La biblioteca enfrenta un problema operacional de control, continuidad y trazabilidad. La falta de un inventario confiable, el uso de registros desactualizados, la comunicación verbal de los plazos y la aplicación subjetiva de sanciones afectan tanto al personal como a los estudiantes.

La solución propuesta aborda estos problemas mediante una aplicación web interna que centraliza la información y formaliza los procesos críticos. Sus usuarios principales son el administrador y los operadores de turno, mientras que el estudiante recibe los beneficios de manera indirecta mediante un servicio de atención respaldado por comprobantes digitales.

El aporte principal de la propuesta es transformar una operación dependiente de planillas, memoria y criterios personales en un proceso controlado por reglas, roles, registros temporales y evidencia auditable. Con esto se busca mejorar la confiabilidad del inventario, la continuidad entre turnos, la seguridad de los accesos y la calidad del servicio entregado a los estudiantes.
