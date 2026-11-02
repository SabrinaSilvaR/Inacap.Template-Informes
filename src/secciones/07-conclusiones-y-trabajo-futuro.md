# Conclusiones y Trabajo Futuro

## Evaluación de Cumplimiento de Objetivos

El desarrollo del presente proyecto permitió diseñar e implementar satisfactoriamente la solución técnica orientada a resolver las deficiencias identificadas en el diagnóstico inicial. A través de un enfoque metódico de ingeniería de software, se alcanzaron los siguientes hitos:

- **Cumplimiento de Requerimientos:** Se cubrió el 100% de los requerimientos funcionales de alta prioridad definidos en el alcance del proyecto.
- **Validación de Arquitectura:** El diseño desacoplado demostró estabilidad y bajo acoplamiento, permitiendo que la interfaz de usuario y los servicios del backend evolucionen de forma independiente.
- **Garantía de Calidad:** Las pruebas ejecutadas validaron los criterios de aceptación del estándar ISO/IEC 25010 en cuanto a tiempos de respuesta, seguridad y usabilidad.

## Dificultades Enfrentadas y Lecciones Aprendidas

Durante el ciclo de vida del proyecto surgieron desafíos técnicos y metodológicos que requirieron adaptaciones oportunas:

1. **Gestión de Entornos de Prueba:** La necesidad de simular datos realistas sin acceso a información sensible obligó al equipo a diseñar generadores de datos sintéticos controlados.
2. **Coordinación e Integración de Cambios:** La adopción de integración continua y revisiones de código permitió resolver tempranamente conflictos de fusión y mantener la calidad del repositorio.
3. **Optimización de Rendimiento:** La incorporación de estrategias de indexación en la base de datos y compresión en la transferencia de datos redujo sustancialmente la latencia percibida en el cliente.

## Trabajo Futuro y Siguientes Pasos

Con el propósito de proyectar la solución hacia futuras etapas de maduración, se proponen las siguientes líneas de desarrollo:

- **Ampliación de Integraciones:** Conectar el sistema con APIs externas de mensajería para el envío automatizado de notificaciones y recordatorios.
- **Implementación de Telemetría Avanzada:** Incorporar paneles de observabilidad con métricas en tiempo real de consumo de recursos y tasa de errores.
- **Despliegue Continuo Automatizado (CD):** Extender el pipeline actual hacia un flujo de entrega automatizada en infraestructura en la nube contenerizada.
