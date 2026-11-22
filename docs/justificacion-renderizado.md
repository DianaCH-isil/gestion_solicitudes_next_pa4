# Justificación del renderizado (SSR / SSG)

**PA4 · Programación Web II · Actividad 2**

> **PENDIENTE — Integrante 3 (Vistas Next.js SSR/SSG y Rutas Dinámicas).**
>
> Aquí debe ir la justificación técnica de por qué se eligió SSR y/o SSG para
> cada vista, con relación a los contenidos de las sesiones 11 a 13.
>
> Estructura sugerida:
>
> 1. **Vista `/solicitudes`** — estrategia elegida (SSR o SSG), motivo y
>    efectos sobre el SEO, el tiempo de respuesta y la carga al servidor.
> 2. **Vista `/solicitudes/[id]`** — ruta dinámica: por qué se implementa con
>    renderizado en el servidor y qué parámetros de la ruta se usan.
> 3. **Alternativas descartadas** y por qué.
>
> ### Contexto para el Integrante 3
>
> El cliente HTTP ya está implementado en `src/services/api.js` (Integrante 1)
> y sus funciones pueden ejecutarse en el servidor sin cambios:
>
> ```js
> import { listarSolicitudes, obtenerSolicitud } from "@/src/services/api";
>
> // En un Server Component
> const solicitudes = await listarSolicitudes();      // GET /api/solicitudes
> const detalle = await obtenerSolicitud(id);          // GET /api/solicitudes/:id
> ```
>
> Ojo: `apiRequest` adjunta el token JWT desde `localStorage`, que no existe
> en el servidor. Para el renderizado en el servidor hay que pasar el token
> explícitamente (por ejemplo, con `cookies()` de Next.js) o exponer una
> variante del servicio que acepte el token como parámetro.
