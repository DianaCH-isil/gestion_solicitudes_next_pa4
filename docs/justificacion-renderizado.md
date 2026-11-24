# Justificación del renderizado (SSR / SSG)

**PA4 · Programación Web II · Actividad 2**

## 1. Vista `/solicitudes` — Renderizado del lado del servidor (SSR)

Para la vista `/solicitudes` se eligió Server-Side Rendering (SSR), mediante un Server Component de Next.js.

La página obtiene los datos desde el backend utilizando la función `listarSolicitudesSinToken()` del servicio ubicado en `src/services/api.js`. La consulta se ejecuta en el servidor antes de entregar la vista al navegador.

Se configuró `dynamic = "force-dynamic"` para que Next.js genere la página en cada solicitud y no utilice una versión estática almacenada.

**Motivos de la elección:**

- **Actualización de información:** las solicitudes pueden cambiar de estado o registrarse nuevas solicitudes, por lo que conviene consultar los datos actualizados al acceder a la página.
- **SEO:** el servidor entrega el contenido inicial renderizado en HTML, lo que facilita que los buscadores puedan interpretar la información. Sin embargo, al tratarse de una vista de gestión, el SEO no es el objetivo principal.
- **Tiempo de respuesta:** el navegador recibe una página con los datos iniciales, sin tener que esperar a que JavaScript ejecute la primera consulta para mostrar el listado.
- **Carga del servidor:** cada visita genera una consulta al backend, por lo que existe una carga adicional en comparación con una página estática.

Los datos obtenidos en el servidor se envían al componente cliente `SolicitudesClient`, que permite mantener las funcionalidades interactivas de la vista.

## 2. Vista `/solicitudes/[id]` — Ruta dinámica con SSR

Para visualizar el detalle de una solicitud se implementó una ruta dinámica:

`/solicitudes/[id]`

El segmento `[id]` permite recibir el identificador de la solicitud desde la URL. En Next.js, este parámetro se obtiene mediante `params` y se utiliza para consultar el registro correspondiente.

Se eligió SSR porque el detalle depende de información almacenada en MongoDB y puede cambiar durante el funcionamiento del sistema.

La página utiliza la función `obtenerSolicitud(id)` para solicitar al backend el detalle mediante el endpoint:

`GET /api/solicitudes/:id`

También se configuró `dynamic = "force-dynamic"` para solicitar la información en cada acceso a la ruta.

Si ocurre un problema durante la consulta, la página captura el error y muestra un mensaje al usuario, evitando que la vista quede sin respuesta.

## 3. Alternativas descartadas

**Static Site Generation (SSG):**

No se eligió SSG porque las solicitudes son datos dinámicos que pueden cambiar con el tiempo. Generar las páginas durante la compilación podría mostrar información desactualizada y requerir una nueva generación para reflejar los cambios.

**Client-Side Rendering (CSR) como estrategia principal:**

No se eligió CSR como estrategia principal porque la primera consulta se ejecutaría desde el navegador después de cargar la página. Esto podría retrasar la visualización de la información inicial.

Sin embargo, se mantiene un componente cliente en el listado para conservar las funcionalidades interactivas.

## 4. Conclusión

Se utilizó SSR en las dos vistas porque ambas necesitan consultar información actualizada del backend.

La vista `/solicitudes` muestra el listado de solicitudes y la ruta dinámica `/solicitudes/[id]` permite consultar el detalle de un registro específico.

Esta implementación aprovecha los Server Components de Next.js, permite separar la obtención de datos de las funcionalidades interactivas y facilita el manejo de errores durante las consultas al backend.