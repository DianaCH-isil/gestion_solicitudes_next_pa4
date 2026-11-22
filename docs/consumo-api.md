# Integrante 1 — Consumo de API y Manejo de Errores

**PA4 · Programación Web II · Código 30690 · Periodo 202620**

Este documento es la evidencia técnica del alcance del **Integrante 1** dentro de
la Actividad 1 de la rúbrica (*"Consumo de APIs, respuestas, JWT y sesiones en
React"*, 2 de los 20 puntos del total). No sustituye al `README.md` oficial
del equipo (Integrante 5); es el respaldo detallado de esta parte.

---

## 1. Alcance entregado

| Archivo | Tipo | Responsabilidad |
|---|---|---|
| `src/services/api.js` | Nuevo | Cliente HTTP (Fetch) contra la API REST de Node.js: URL base por variable de entorno, token JWT en cabecera `Authorization`, timeout con `AbortController`, validación de respuestas, try/catch y bitácora de peticiones. |
| `src/utils/errorHandler.js` | Nuevo | Normalización de errores a un tipo único (`ApiError`), clasificación por código HTTP, mensajes en español para la UI y registro en consola. |
| `src/app/solicitudes/page.jsx` | Nuevo | Vista del listado de solicitudes abandonado por la API (búsqueda y detalle por registro). Si la API falla, muestra el error ya traducido por `errorHandler.js`. |
| `evidencias/integrante-1/*.jpeg` | Nuevo | Capturas de pantalla usadas en el video de exposición. |
| `evidencias/README.md` | Nuevo | Índice de evidencias por integrante (base para el Integrante 5). |

> **Fuera de mi alcance (creado sólo como estructura vacía, sin implementación):**
> `src/context/AuthContext.jsx` y `src/app/login/page.jsx` y
> `src/components/ProtectedRoute.jsx` (Integrante 2);
> `src/app/solicitudes/[id]/page.jsx` y `docs/justificacion-renderizado.md`
> (Integrante 3); `next.config.mjs`, `.env.example` y `src/utils/logger.js`
> (Integrante 4); `src/components/Navbar.jsx` y `src/app/page.jsx`
> (Integrante 5).
> Esos archivos contienen únicamente un stub con el aviso de a quién le
> corresponde completarlo: el equipo trabaja en ramas separadas y así nadie
> pisa el avance de otro.

---

## 2. Arquitectura del consumo

```
Componente React (app/solicitudes, app/api-demo)
        │  llama a un método del servicio
        ▼
src/services/api.js  ── apiRequest(endpoint, {method, body, auth, timeout, validate})
        │
        ├── fetch(url, { headers, body, signal })        ← token JWT + timeout
        │
        ├── respuesta OK ──► parseo JSON ──► validate() ──► devuelve datos
        │                                │
        │                                └─ (formato inválido) ──► ApiError VALIDATION
        │
        └── respuesta !OK ──► statusToType(status) ──► ApiError
                │
                ▼
        catch (error) ──► normalizeError() ──► handleError() ──► mensaje en español
                │
                └──► bitácora (getRequestLog) visible en la interfaz
```

Decisiones y su justificación (en relación a las sesiones 11–13):

1. **Fetch nativo en lugar de Axios.** No se agrega una dependencia externa al
   proyecto: Next.js ya corre sobre el navegador y `fetch` cubre las necesidades
   (cabeceras, JSON, cancelación). Se evita el peso extra de Axios y se
   demuestra el dominio de la API `fetch` trabajada en las sesiones 11 y 12.
2. **Una sola función `apiRequest` como núcleo.** Todos los endpoints pasan por
   el mismo `try/catch`, el mismo timeout y la misma bitácora. Así el manejo de
   errores es **verificable y uniforme** en lugar de repetirse vista por vista.
3. **Validación de la respuesta, no sólo del `fetch`.** `fetch` sólo lanza si la
   petición falla a nivel de red; un `200` con cuerpo vacío o con una forma
   inesperada igual es un error. Por eso cada método declara un `validate()` que
   comprueba la forma esperada (p. ej. que `/api/solicitudes` devuelva un
   arreglo).
4. **Errores normalizados en un único tipo (`ApiError`).** Las vistas no
   repasan `TypeError`, `AbortError` ni códigos HTTP: reciben siempre
   `{ mensaje, tipo, status, detalles }`. Esto es lo que permite pintar la
   interfaz sin repetir `if/else` por cada código.
5. **Token JWT fuera de la vista.** El cliente expone `login()`, `getToken()`,
   `setToken()` y `clearToken()` para que el Integrante 2 los reexporte desde
   `AuthContext.jsx` sin reescribir la capa de red.
6. **Bitácora en memoria.** Cada petición queda registrada (método, URL,
   estado, duración). Es la evidencia que se muestra en pantalla durante el
   video, sin depender de herramientas externas.

---

## 3. Configuración

Variables de entorno usadas (definidas en `.env.local`, que **no** se versiona;
el archivo `.env.example` corresponde al Integrante 4):

| Variable | Valor por defecto | Uso |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | URL base de la API REST. |
| `NEXT_PUBLIC_DEMO_CORREO` | `admin@isil.pe` | Cuenta del *seed* local usada en la demo. |
| `NEXT_PUBLIC_DEMO_PASSWORD` | `123` | Contraseña del *seed* local usada en la demo. |
| `NEXT_PUBLIC_DEMO_ESTUDIANTE_CORREO` | `diana@isil.pe` | Cuenta estudiante para provocar el 403. |

> **Puertos.** La API de Node.js (PA2) corre en el **3000** (su puerto
> original, definido en el `.env` del backend) y la aplicación Next.js en el
> **3001**, porque el 3000 ya está ocupado por la API. La URL de la API se
> configura en el `.env.local` del frontend con
> `NEXT_PUBLIC_API_URL=http://localhost:3000`. Como el backend habilita CORS,
> el frontend puede consumirlo desde otro puerto sin problema.

> Las credenciales mostradas son las del *seed* de desarrollo del backend PA2
> (`seed/seedData.js`), no credenciales reales de producción. Se pueden
> sobrescribir por `.env.local` sin tocar el código.

---

## 4. Endpoints consumidos

| Método | Endpoint | Auth | Uso en el frontend |
|---|---|---|---|
| GET | `/api/health` | No | Verificar que el backend Node.js esté encendido. |
| POST | `/api/auth/login` | No | Autenticarse y guardar el token JWT. |
| POST | `/api/auth/register` | No | Alta de usuarios (expuesto en el servicio). |
| GET | `/api/auth/me` | Sí | Validar el token de la sesión. |
| GET | `/api/solicitudes` | Sí (admin/personal) | Listado con filtros `estado` y `codigoAlumno`. |
| GET | `/api/solicitudes/mias` | Sí (estudiante) | Solicitudes del estudiante autenticado. |
| GET | `/api/solicitudes/:id` | No | Detalle por ObjectId o por `codigoRadicado`. |
| POST | `/api/solicitudes` | Sí | Crear solicitud (201). |
| PATCH | `/api/solicitudes/:id/estado` | Sí (admin/personal) | Cambiar estado. |
| DELETE | `/api/solicitudes/:id` | Sí (admin) | Eliminar solicitud. |
| GET | `/api/usuarios` | Sí (admin) | Listado de usuarios. |
| GET | `/api/estudiantes` | Sí (admin) | Listado de estudiantes. |

---

## 5. Manejo de errores

`src/utils/errorHandler.js` clasifica cada falla y la traduce a un mensaje
comprensible para el usuario final:

| Situación | Código / tipo | Mensaje mostrado al usuario |
|---|---|---|
| Sin token o token expirado | 401 · `AUTH_ERROR` | *"Sesión no autorizada (401). Inicie sesión nuevamente…"* |
| Rol sin permisos | 403 · `FORBIDDEN_ERROR` | *"Acceso denegado (403). Su rol no tiene permisos…"* |
| Recurso inexistente | 404 · `NOT_FOUND_ERROR` | *"Recurso no encontrado (404). Verifique el identificador…"* |
| Datos inválidos (express-validator) | 400 · `VALIDATION_ERROR` | *"Los datos enviados no son válidos (400)…"* + detalle por campo |
| Conflicto (correo/código duplicado) | 409 · `CONFLICT_ERROR` | *"Conflicto (409). El registro ya existe…"* |
| Fallo del servidor | 500 · `SERVER_ERROR` | *"Error interno del servidor (500). Intente nuevamente…"* |
| Backend caído / URL inválida | `NETWORK_ERROR` | *"Error de conexión. No se pudo alcanzar el servidor de la API."* |
| La API no responde a tiempo | `TIMEOUT_ERROR` | *"Tiempo de espera agotado…"* |
| Respuesta no JSON | `PARSE_ERROR` | *"La respuesta del servidor no pudo interpretarse."* |

Cada error expone además `isAuthError` (para reaccionar cerrando la sesión) e
`isRetryable` (para ofrecer reintento en fallas de red, timeout o 5xx).

---

## 6. Evidencia reproducible

### 6.1 Requisitos

```bash
# 1) Backend PA2 (MongoDB local debe estar encendido)
cd ../pa2/pa2_backend_gestion_usuarios_solicitudes
npm install
node server.js            # →  http://localhost:3000

# 2) Frontend PA4
cd ../../pa4/gestion_solicitudes_next
npm install
npm run dev          # →  http://localhost:3001
```

### 6.2 Rutas de verificación

| Ruta | Qué demuestra |
|---|---|
| `http://localhost:3001/solicitudes` | Listado de solicitudes obtenido desde la API, con búsqueda y detalle por registro. Si el backend está caído, muestra el error traducido. |
| `http://localhost:3001/` | Portada (Integrante 5) con los enlaces a todos los módulos. |
| `http://localhost:3001/solicitudes/[id]` | Ruta dinámica (Integrante 3), ya compila como *dynamic* server-rendered. |

### 6.3 Capturas

| Captura | Contenido |
|---|---|
| `evidencias/integrante-1/01-listado-solicitudes.jpeg` | Vista `/solicitudes`: los 7 registros de la base de datos obtenidos con `GET /api/solicitudes` (200) y el detalle desplegable de una solicitud (`GET /api/solicitudes/:id`). |
| `evidencias/integrante-1/02-manejo-de-errores.jpeg` | Manejo de errores en la aplicación real: con el backend detenido, la vista muestra el banner "Error · NETWORK_ERROR — Error de conexión. No se pudo alcanzar el servidor de la API." en lugar de romperse. |

### 6.4 Peticiones que consume la aplicación

Bitácora del cliente HTTP (`getRequestLog()` de `src/services/api.js`) durante
una sesión completa de pruebas:

| Método | URL | Estado |
|---|---|---|
| GET | `/api/auth/me` | **401** (no hay sesión todavía) |
| POST | `/api/auth/login` | 200 (el frontend se autentica solo) |
| GET | `/api/solicitudes` | 200 (listado cargado) |
| GET | `/api/solicitudes/:id` | 200 (detalle desplegado) |
| GET | `/api/solicitudes` | **401** (petición sin token) |
| GET | `/api/solicitudes/000…000` | **404** (id inexistente) |
| GET | `/api/solicitudes` | **500** (inyección controlada) |

Además se ejercitaron el resto de endpoints del cliente: `GET /api/health`,
`GET /api/solicitudes/mias`, `GET /api/usuarios`, `GET /api/estudiantes`,
`POST /api/solicitudes` (201), `PATCH /api/solicitudes/:id/estado` (200) y
`DELETE /api/solicitudes/:id` (200).

### 6.5 Errores 401 y 500

- **401**: el backend devuelve 401 cuando falta el token o expiró. El cliente
  lo captura, `errorHandler.js` lo clasifica como `AUTH_ERROR` y la vista
  muestra *"Sesión no autorizada (401). Inicie sesión nuevamente para obtener
  un token JWT válido."*
- **500**: el backend de PA2 no expone ningún endpoint que devuelva un 500 de
  forma natural (todos sus `catch` devuelven 400/404/409). Para evidenciar el
  **manejo** del error 500 sin alterar el backend ni la base de datos, el
  servicio expone `simularErrorServidor()`, que construye exactamente el mismo
  `ApiError` (`status: 500`, `type: SERVER_ERROR`) que produciría una respuesta
  real del servidor y lo registra en la bitácora.
- **Red**: es el error que se ve en la aplicación real cuando el backend está
  apagado (captura `02-manejo-de-errores.jpeg`). El `fetch` lanza un
  `TypeError`, `errorHandler.js` lo clasifica como `NETWORK_ERROR` y la vista
  muestra *"Error de conexión. No se pudo alcanzar el servidor de la API."* en
  lugar de romperse.

La bitácora completa se puede consultar en cualquier momento desde la consola
del navegador con `getRequestLog()` o con los `console.groupCollapsed()` que
emite `errorHandler.js` en cada error.

---

## 7. Cómo lo retoman los demás integrantes

- **Integrante 2 (JWT y sesiones):** `login()`, `getToken()`, `setToken()` y
  `clearToken()` de `src/services/api.js` ya están listos para consumirse desde
  `AuthContext.jsx`. El token se guarda hoy en `localStorage` de forma simple
  para poder demostrar el consumo de la API de forma aislada; con el
  `AuthContext` la estrategia pasa a ser la del equipo.
- **Integrante 3 (SSR/SSG y ruta dinámica):** los servicios son funciones
  puras que pueden ejecutarse en el servidor (`await listarSolicitudes()` en un
  Server Component). La ruta `/solicitudes/[id]` puede resolver el detalle con
  `obtenerSolicitud(id)` sin tocar `src/services/api.js`.
- **Integrante 4 (producción y logs):** la bitácora en memoria de
  `getRequestLog()` es el punto de integración natural con `src/utils/logger.js`
  (envío a un servicio externo o a Vercel Logs).
- **Integrante 5 (interfaz y README):** el estilo de `/solicitudes` es
  deliberadamente mínimo para que la navbar y el resto de vistas lo completen
  sin romper el estilo general del equipo.

---

## 8. Estructura de carpetas

El proyecto sigue la estructura que asigna la PA4: las rutas viven en
`src/app/` y los módulos compartidos en `src/services/` y `src/utils/`.
(Next.js no permite que existan `app/` y `src/app/` a la vez, por eso se
migró todo con `git mv` de la raíz a `src/`.)

```
gestion_solicitudes_next/
├── src/
│   ├── app/
│   │   ├── layout.jsx              # layout raíz de la aplicación
│   │   ├── page.jsx                # portada            → Integrante 5
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.jsx            # login JWT          → Integrante 2
│   │   └── solicitudes/
│   │       ├── page.jsx            # listado API +      → Integrante 1 (este)
│   │       │                        # manejo de errores
│   │       └── [id]/
│   │           └── page.jsx        # ruta dinámica      → Integrante 3
│   ├── components/
│   │   ├── Navbar.jsx              # navegación         → Integrante 5
│   │   └── ProtectedRoute.jsx      # rutas privadas     → Integrante 2
│   ├── context/
│   │   └── AuthContext.jsx         # sesión JWT         → Integrante 2
│   ├── services/
│   │   └── api.js                  # cliente HTTP       → Integrante 1 (este)
│   └── utils/
│       ├── errorHandler.js         # manejo de errores  → Integrante 1 (este)
│       └── logger.js               # logs/monitoreo     → Integrante 4
├── docs/
│   ├── consumo-api.md              # esta evidencia     → Integrante 1
│   └── justificacion-renderizado.md # SSR/SSG            → Integrante 3
├── evidencias/
│   ├── README.md                   # índice             → Integrante 5
│   └── integrante-1/               # capturas           → Integrante 1 (este)
├── next.config.mjs                 # producción         → Integrante 4
├── .env.example                    # variables          → Integrante 4
└── .env.local                      # local (no versionado)
```

Los archivos marcados con *(este)* tienen contenido real y funcionando. Los
demás son stubs con el aviso del responsable, para que cada integrante
trabaje en su rama sin pisar el avance de otro.

**Rutas generadas por `npm run build`:**

```
┌ ○ /                     (static)
├ ○ /login                (static)
├ ○ /solicitudes          (static)
└ ƒ /solicitudes/[id]     (dynamic - server-rendered on demand)
```
