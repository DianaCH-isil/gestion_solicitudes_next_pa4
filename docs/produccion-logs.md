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

1. **Minificación y limpieza de código (`next.config.mjs`):**
   * Se habilitó `compiler.removeConsole` en entornos de producción conservando únicamente `console.error` y `console.warn` para evitar fuga de información de depuración en el navegador del cliente.
   * Se desactivó `poweredByHeader: false` para ocultar la cabecera `X-Powered-By: Next.js` y reducir la superficie de exposición del servidor.
   * Se activó `compress: true` para entregar los recursos estáticos comprimidos mediante Gzip/Brotli.

2. **Optimización de empaquetado con Webpack (`splitChunks`):**
   * Se configuró la estrategia `optimization.splitChunks` en `next.config.mjs` para separar las dependencias externas de `node_modules` en un chunk independiente (`vendors`), mejorando el almacenamiento en caché del navegador y reduciendo el peso de descarga inicial por ruta.

3. **Optimización de recursos y cabeceras HTTP de seguridad:**
   * Se configuró soporte nativo para formatos modernos de imagen (`image/avif` y `image/webp`).
   * Se añadieron cabeceras de seguridad estándar (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` y `Referrer-Policy: strict-origin-when-cross-origin`) aplicables a todas las rutas (`/:path*`).

---

## 3. Gestión de Variables de Entorno

Se estandarizó el archivo `.env.example` en la raíz del proyecto y se replicaron las claves en el entorno **Production** del panel de Vercel (`Settings -> Environments -> Production`)[cite: 10, 11]:

| Variable | Valor en Producción | Propósito |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | URL base del backend REST / modo simulación sin servidor externo. |
| `NEXT_PUBLIC_APP_ENV` | `production` | Identificador del entorno activo de ejecución. |
| `NEXT_PUBLIC_ENABLE_MONITORING` | `true` | Habilita el registro estructurado de eventos y telemetría. |
| `NEXT_PUBLIC_DEMO_CORREO` | `admin@isil.pe` | Credencial de demostración para acceso rápido al módulo de solicitudes. |
| `NEXT_PUBLIC_DEMO_PASSWORD` | `123` | Contraseña de demostración para pruebas funcionales en producción. |

---

## 4. Logs, Manejo de Errores y Monitoreo

* **Logger estructurado (`src/utils/logger.js`):** Centraliza las trazas de aplicación con marca de tiempo ISO, nivel de severidad (`info`, `warn`, `error`) y contexto operativo, integrándose con la bitácora de peticiones HTTP (`getRequestLog()`) definida en `src/services/api.js`.
* **Control de fallos en tiempo de ejecución (`src/app/error.jsx`):** Captura excepciones no controladas dentro del árbol de componentes de Next.js App Router, registra el detalle técnico mediante el logger y ofrece al usuario una interfaz limpia de recuperación (`reset()`).
* **Rutas inexistentes (`src/app/not-found.jsx`):** Intercepta accesos a URLs no registradas (HTTP 404) mostrando una vista coherente con la identidad visual de la plataforma y navegación de retorno segura.
* **Telemetría en vivo (`@vercel/analytics`):** Incorporado en `src/app/layout.jsx` junto con el panel nativo de **Observability** de Vercel para auditar invocaciones de funciones, solicitudes CDN y rendimiento real de páginas[cite: 8].

---

## 5. Despliegue en Producción (Vercel) y Evidencias

### 5.1 Parámetros de despliegue
* **Plataforma:** Vercel (Plan Hobby)[cite: 4, 6]
* **Repositorio origen:** `DianaCH-isil/gestion_solicitudes_next_pa4` (rama `main`)[cite: 6]
* **Framework Preset:** Next.js
* **Comando de compilación:** `npm run build`

### 5.2 Enlace público activo
* **URL de Producción:** https://gestionsolicitudesnextpa4.vercel.app[cite: 8]
* **Estado del despliegue:** `Ready` (Verificado en producción con CDN y funciones activas)[cite: 8]

### 5.3 Capturas de evidencia (`evidencias/integrante-4/`)

| Captura | Contenido |
|---|---|
| `evidencias/integrante-4/01-build-produccion.png` | Salida de consola de `npm run build` mostrando la compilación exitosa, minificación y pesos de *chunks*. |
| `evidencias/integrante-4/02-next-config.png` | Configuración implementada en `next.config.mjs` y `src/utils/logger.js`. |
| `evidencias/integrante-4/03-despliegue-vercel.png` | Panel de Vercel en estado *Ready* con el dominio público `gestionsolicitudesnextpa4.vercel.app` activo[cite: 8]. |
| `evidencias/integrante-4/04-logs-monitoreo.png` | Variables de entorno configuradas en Vercel y monitoreo activo de rutas y manejo de errores. |