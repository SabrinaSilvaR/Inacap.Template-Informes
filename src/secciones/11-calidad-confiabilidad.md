# Consideraciones de calidad y confiabilidad

El análisis de calidad utiliza como referencia el modelo de calidad de producto de ISO/IEC 25010:2023 y, para seguridad de la información, los principios de gestión de riesgo de ISO/IEC 27001:2022. El sistema no se declara certificado ni conforme a estas normas; se emplean únicamente como marcos para identificar atributos relevantes y brechas del prototipo.

## Evaluación de atributos relevantes

| **Atributo**              | **Valoración**                      | **Evidencia**                                                                                                                                 | **Limitación / riesgo**                                                                           |
| ------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Confiabilidad             | Alta para los casos evaluados       | 144/144 tests; transaction.atomic; select\_for\_update; restricción de un préstamo activo por ejemplar; devolución y sanción determinísticas. | No existen pruebas de estrés/concurrencia a escala institucional.                                 |
| Mantenibilidad            | Media–alta                          | Separación en models, serializers, views, services, selectors, permissions y validations; dependencias versionadas; tests automatizados.      | 64 warnings ESLint y 96 Stylelint muestran deuda técnica menor.                                   |
| Rendimiento               | Adecuado al prototipo               | Uso de select\_related/agregaciones en consultas; frontend compila 312 módulos correctamente.                                                 | No se realizaron benchmarks ni pruebas de carga; no se puede prometer rendimiento productivo.     |
| Disponibilidad            | Limitada al prototipo               | La aplicación es funcional en entorno local.                                                                                                  | SQLite y ejecución local no ofrecen alta disponibilidad, redundancia ni recuperación ante fallos. |
| Seguridad                 | Buena base, con hardening pendiente | MFA, JWT, roles, validaciones, throttling, soft delete y auditoría.                                                                           | 6 warnings de despliegue, clave HMAC corta, alerting ausente y log no totalmente inmutable.       |
| Usabilidad                | Buena para el flujo de mesón        | Flujos guiados, QR para MFA, mensajes inmediatos, búsqueda por barcode/RUT y retroalimentación visible.                                       | Debe validarse con usuarios reales y pruebas de accesibilidad/UX más formales.                    |
| Integridad y trazabilidad | Alta en flujo normal                | PROTECT en relaciones históricas, soft delete, bitácora y cambios de estado coordinados.                                                      | La inmutabilidad del AuditLog requiere refuerzo administrativo.                                   |

## Confiabilidad de los procesos críticos

Préstamo. create\_loan() está envuelto en transaction.atomic y bloquea el ResourceItem mediante select\_for\_update(). Esto evita que dos operaciones concurrentes modifiquen el mismo ejemplar durante el registro. Si el recurso no está AVAILABLE, la operación se rechaza; si es válido, se crea el Loan, se cambia el ejemplar a ON\_LOAN y se registra el evento de auditoría dentro de una única unidad transaccional.

Devolución. return\_loan() también es atómica y bloquea el préstamo antes de modificarlo. Rechaza una segunda devolución, registra returned\_at y el operador receptor, marca el préstamo RETURNED, libera el ejemplar a AVAILABLE y aplica la sanción cuando existe atraso. La prueba manual Figuras 4 y 5 y el test return\_on\_time\_no\_sanction verifican este flujo.

Integridad histórica. Las relaciones críticas usan on\_delete=PROTECT y la gestión de usuarios se basa en soft delete mediante is\_active=False. Esto permite deshabilitar accesos sin eliminar la identidad del operador que quedó asociada a préstamos o eventos anteriores.

## Mantenibilidad y deuda técnica visible

La estructura del backend separa el dominio y sus responsabilidades: models.py define datos y relaciones; serializers.py valida/transforma; views.py expone endpoints; services.py concentra operaciones de negocio; selectors.py concentra lecturas; permissions.py controla acceso; validations.py centraliza reglas reutilizables. Esta separación disminuye el acoplamiento y facilita probar reglas específicas.

En frontend, los tests del HttpClient cubren autorización Bearer, refresh, errores 401/403, concurrencia y respuestas que no cumplen el esquema. Sin embargo, el análisis estático mostró oportunidades concretas de refactorización: cuatro componentes presentan complejidad 17 sobre un máximo configurado de 15; además existen advertencias de orden/formato y selectores CSS duplicados. La calidad funcional es alta en los casos verificados, pero el código aún puede simplificarse.

## Disponibilidad, operación y paso a producción

La versión evaluada es un prototipo funcional local y utiliza SQLite. Por lo tanto, no corresponde afirmar alta disponibilidad ni resiliencia productiva. Para un uso institucional deberían definirse una base de datos adecuada para concurrencia (por ejemplo PostgreSQL), backups automáticos, restauración probada, monitoreo, gestión centralizada de logs, despliegue HTTPS, manejo de secretos por ambiente y una estrategia de continuidad operacional.

## Síntesis de calidad y confiabilidad

> **Conclusión de calidad.** El prototipo demuestra una base confiable para los flujos críticos: todas las pruebas automatizadas aprobaron, los casos manuales seleccionados fueron exitosos y las reglas sensibles se implementan en backend. La principal brecha ya no es funcional, sino de preparación para producción: hardening de configuración, protección/alerta de auditoría, fortalecimiento criptográfico, reducción de deuda técnica y validación bajo carga.

> **Nota sobre evidencia.** Las cifras de pruebas, warnings y capturas incorporadas en este documento proceden de la ejecución local realizada el 10-10-2026 sobre las versiones finales del backend y frontend entregadas por el equipo. Las referencias externas se utilizan para fundamentar el análisis de seguridad y calidad, no para sustituir la evidencia del proyecto.
