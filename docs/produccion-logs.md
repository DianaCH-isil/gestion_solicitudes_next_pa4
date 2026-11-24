# Integrante 4 — Configuración de Producción, Logs y Vercel

**PA4 · Programación Web II · Código 30690 · Periodo 202620**

Este documento es la evidencia técnica del alcance del **Integrante 4** dentro de las Actividades 3 y 4 de la rúbrica (*"Despliegue del frontend en Vercel"* y *"Preparación para producción: minificación/optimización, Webpack/Babel, variables de entorno y logs/monitoreo"*). No sustituye al `README.md` oficial del equipo (Integrante 5); es el respaldo detallado de esta parte.

---

## 1. Alcance entregado

| Archivo | Tipo | Responsabilidad |
|---|---|---|
| `next.config.mjs` | Modificado | Configuración de producción: eliminación automática de `console.log` (`removeConsole`), compresión Gzip/Brotli, optimización de imágenes (`AVIF`/`WebP`), cabeceras HTTP de seguridad y segmentación de paquetes en Webpack (`splitChunks`). |
| `.env.example` | Modificado | Plantilla estandarizada de variables de entorno públicas y de monitoreo sin exponer secretos ni credenciales reales en el repositorio. |
| `src/utils/logger.js` | Nuevo | Servicio centralizado de logging estructurado por niveles (`info`, `warn`, `error`) conectado con la bitácora `getRequestLog()` de `src/services/api.js`. |
| `src/app/error.jsx` | Nuevo | *Global Error Boundary* de Next.js App Router para capturar excepciones no controladas en tiempo de ejecución y registrarlas de forma estructurada. |
| `src/app/not-found.jsx` | Nuevo | Vista personalizada para el manejo controlado de rutas inexistentes (HTTP 404) en producción. |
| `src/app/layout.jsx` | Modificado | Integración del componente `<Analytics />` (`@vercel/analytics`) para telemetría y monitoreo de tráfico en vivo. |
| `docs/produccion-logs.md` | Nuevo | Documentación técnica de las configuraciones de producción, variables de entorno y despliegue. |
| `evidencias/integrante-4/*` | Nuevo | Capturas de compilación optimizada (`npm run build`), configuración y despliegue activo en Vercel. |

---

## 2. Decisiones Técnicas (Optimización, Webpack y Compilación)