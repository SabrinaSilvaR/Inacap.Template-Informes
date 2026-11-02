# Requerimientos y Especificación del Sistema

## Usuarios y Actores del Sistema

El sistema contempla diversos roles con diferentes niveles de responsabilidad, privilegios y casos de uso dentro de la plataforma:

- **Administrador del Sistema:** Responsable de la configuración global, gestión de cuentas de usuario, asignación de roles y consulta de bitácoras de auditoría.
- **Operador / Usuario Principal:** Usuario que ejecuta las tareas diarias de registro, consulta y actualización de información en la plataforma.
- **Usuario de Consulta / Auditor:** Perfil con permisos de solo lectura para supervisar métricas, generar reportes y verificar el cumplimiento de normativas.

## Requerimientos Funcionales (RF)

Los requerimientos funcionales definen los comportamientos, servicios y transformaciones que el sistema debe ejecutar en respuesta a las interacciones de los usuarios.

| Identificador | Requerimiento Funcional | Descripción del Comportamiento | Prioridad |
| ------------- | ----------------------- | ------------------------------ | --------- |
| RF-01 | Autenticación y Control de Acceso | El sistema debe permitir el inicio de sesión seguro mediante credenciales institucionales y generar sesiones protegidas por tokens. | Alta |
| RF-02 | Gestión de Registros Principales | El sistema debe permitir crear, consultar, actualizar y deshabilitar lógicamente los registros de la entidad principal. | Alta |
| RF-03 | Búsqueda y Filtrado Avanzado | El sistema debe proveer filtros multicriterio (por estado, fecha y texto) con resultados paginados en tiempo real. | Media |
| RF-04 | Emisión de Comprobantes o Reportes | El sistema debe generar documentos descargables (PDF o CSV) con el resumen de las operaciones ejecutadas. | Media |
| RF-05 | Registro de Auditoría de Cambios | Cada acción de modificación o eliminación debe registrar el identificador del usuario, marca de tiempo y estado previo. | Alta |

## Requerimientos No Funcionales (RNF)

Con base en el estándar internacional **ISO/IEC 25010**, se definen las características de calidad que aseguran el desempeño, confiabilidad y seguridad del software.

| Identificador | Característica ISO 25010 | Métrica o Estándar | Criterio de Aceptación |
| ------------- | ------------------------ | ------------------ | ---------------------- |
| RNF-01 | Rendimiento y Eficiencia | Tiempo de respuesta P95 | Respuestas de la API inferiores a 200 ms bajo carga nominal de 50 usuarios simultáneos. |
| RNF-02 | Seguridad de la Información | Cifrado y Políticas OWASP | Contraseñas almacenadas con hashing seguro (Argon2 o bcrypt) y comunicaciones bajo HTTPS / TLS 1.3. |
| RNF-03 | Usabilidad y Accesibilidad | Estándar WCAG 2.1 Nivel AA | Interfaz con contraste mínimo de 4.5:1, diseño adaptativo y navegación completa por teclado. |
| RNF-04 | Mantenibilidad | Arquitectura limpia y modular | Código estructurado por capas desacopladas con cobertura de pruebas automatizadas superior al 70%. |
| RNF-05 | Compatibilidad | Navegadores web modernos | Soporte garantizado en las versiones actuales de Google Chrome, Mozilla Firefox y Microsoft Edge. |
