# PA4 - Plataforma de Gestión de Solicitudes Académicas (Next.js)

**Institución:** ISIL  
**Asignatura:** Programación Web II (Código 30690 · Período Académico 202620)  
**Evaluación:** PA4 - Proceso de Aprendizaje 4 (Sesiones 11 a 13 · Sesión de corte: Sesión 13 · Ponderación: 15%)  
**Repositorio GitHub:** https://github.com/DianaCH-isil/gestion_solicitudes_next_pa4  
**Despliegue en Vercel:** (https://gestionsolicitudesnextpa4.vercel.app) 
**Video público de YouTube:** [PEGAR AQUÍ EL ENLACE]

---

## 1. Integrantes y participación

| Integrante | Correo | Rol asignado | Participación / Aporte principal |
| :--- | :--- | :--- | :--- |
| Diana Clabel | 75224086@mail.isil.pe | Integrante 1 — Consumo de API y Manejo de Errores (`feature/api-client`) | Configuración del consumo de API desde Node.js (`src/services/api.js`), validación de respuestas y manejo de errores HTTP (`src/utils/errorHandler.js`), junto con capturas de peticiones y errores controlados. |
| José Miguel Pollick | 70657707@mail.isil.pe | Integrante 2 — Autenticación y Sesiones JWT (`feature/auth-jwt`) | Implementación del flujo de inicio de sesión con JWT (`src/app/login/page.jsx`), gestión y validación segura de sesión (`src/context/AuthContext.jsx`), cierre de sesión y protección de rutas (`src/components/ProtectedRoute.jsx`). |
| Giancarlo Quispe | 72478618@mail.isil.pe | Integrante 3 — Vistas Next.js (SSR / SSG) y Rutas Dinámicas (`feature/nextjs-ssr-ssg`) | Implementación de vistas en Next.js aplicando SSR y/o SSG (`src/app/solicitudes/page.jsx`), ruta dinámica (`src/app/solicitudes/[id]/page.jsx`) y redacción de la justificación técnica (`docs/justificacion-renderizado.md`). |
| Roberto Palacios Lara | 76836869@mail.isil.pe | Integrante 4 — Configuración de Producción, Logs y Vercel (`feature/prod-config`) | Configuración de optimización/minificación (`next.config.mjs`), variables de entorno (`.env.example`), registro de logs/monitoreo (`src/utils/logger.js`) y despliegue en Vercel verificando rutas en vivo. |
| Aaron Pereyra Cabrejos | 72623386@mail.isil.pe | Integrante 5 — Interfaz Principal, Evidencias y README (`feature/ui-evidencias`) | Integración de la navegación principal con el estado de sesión y las vistas (`src/components/Navbar.jsx` y `src/app/page.jsx`), recopilación de evidencias en `/evidencias` y redacción/consolidación del `README.md`. |

---

## 2. Descripción y objetivo

### 2.1. Descripción y problema
El caso progresivo **"Plataforma de Gestión de Solicitudes Académicas"** en su cuarta etapa (PA4) conecta el frontend con servicios API, gestiona sesiones de usuario con JWT, aplica estrategias de renderizado con Next.js (incluyendo rutas dinámicas), despliega la aplicación en Vercel y prepara la solución para producción con optimización, variables de entorno y logs/monitoreo.

De acuerdo con el corte curricular de la **Sesión 13**, esta evaluación comprende las **Sesiones 11 a 13** y no incluye aún despliegue de backend en Render/MongoDB Atlas ni seguridad XSS/CSRF, Helmet.js o Lighthouse (correspondientes a la Evaluación Integral).

### 2.2. Objetivo
Desarrollar, desplegar y documentar una aplicación frontend en **Next.js** para la gestión de solicitudes académicas que integre consumo de API REST con validación y manejo de errores, autenticación y sesión JWT, renderizado SSR/SSG con ruta dinámica, despliegue en Vercel y preparación para producción, respaldada con evidencias verificables y documentación técnica.

---

## 3. Desarrollo y solución propuesta

El trabajo se dividió en cinco frentes coordinados sobre el repositorio:

1. **Consumo de API y manejo de errores — Integrante 1 (`src/services/api.js`, `src/utils/errorHandler.js`):**
   - Peticiones al servicio/backend, validación de respuestas y manejo de errores HTTP (`try/catch`, estados como `401`/`500`) para evitar fallos no controlados en la interfaz.
2. **Autenticación y sesiones JWT — Integrante 2 (`src/context/AuthContext.jsx`, `src/app/login/page.jsx`, `src/components/ProtectedRoute.jsx`):**
   - Manejo de autenticación con JWT, validación y control de sesión (conforme a la Sesión 11), cierre de sesión y restricción de rutas privadas cuando no hay sesión activa.
3. **Vistas Next.js (SSR / SSG) y rutas dinámicas — Integrante 3 (`src/app/solicitudes/page.jsx`, `src/app/solicitudes/[id]/page.jsx`, `docs/justificacion-renderizado.md`):**
   - Implementación de vistas con renderizado en servidor (`SSR`) y/o generación estática (`SSG`) según su naturaleza, ruta dinámica `[id]` para consultar el detalle de una solicitud y documentación técnica de la elección de renderizado.
4. **Configuración de producción, logs y Vercel — Integrante 4 (`next.config.mjs`, `.env.example`, `src/utils/logger.js`, Vercel):**
   - Preparación de optimización/minificación, configuración pertinente de compilación, definición segura de variables de entorno sin exponer secretos, registro de logs/monitoreo y publicación en Vercel con verificación de rutas en vivo.
5. **Interfaz principal, evidencias y README — Integrante 5 (`src/components/Navbar.jsx`, `src/app/page.jsx`, `evidencias/`, `README.md`):**
   - Integración de la navegación superior con el estado de sesión y las rutas principales (`/`, `/solicitudes`, `/login` y `/solicitudes/[id]`), recopilación de evidencias en `/evidencias` y consolidación del `README.md`.

> **Nota de seguridad y confidencialidad:** En este repositorio y documentación no se publican contraseñas, credenciales, tokens, datos personales sensibles, información confidencial ni accesos de producción.

---

## 4. Estructura de archivos del repositorio

```text
gestion_solicitudes_next_pa4/
├── docs/
│   ├── consumo-api.md
│   ├── justificacion-renderizado.md
│   └── produccion-logs.md
├── evidencias/
│   ├── integrante-1/
│   ├── integrante-3/
│   ├── integrante-4/
│   ├── integrante-5/
│   │   ├── 01-interfaz-principal-navbar.png
│   │   ├── 02-navegacion-solicitudes.png
│   │   ├── 03-navegacion-login.png
│   │   ├── fotografía navbar.jsx pwa.jpg
│   │   └── fotografía page.jsx pwa.jpg
│   └── README.md
├── public/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.jsx
│   │   ├── solicitudes/
│   │   │   ├── [id]/
│   │   │   │   └── page.jsx
│   │   │   ├── SolicitudesClient.jsx
│   │   │   └── page.jsx
│   │   ├── error.jsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   ├── not-found.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   └── utils/
│       ├── errorHandler.js
│       └── logger.js
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

5. Requisitos previos y cómo ejecutar o revisar
Requisitos previos
Node.js (versión 18 o superior recomendada) y npm.

Visual Studio Code (o editor compatible) y acceso al repositorio en GitHub.

Variables de entorno configuradas a partir de .env.example (sin exponer secretos, contraseñas ni tokens en el repositorio).

6. Evidencias
Las capturas de verificación, pruebas y compilación están organizadas por integrante en evidencias/ y detalladas en evidencias/README.md:

evidencias/integrante-1/: Peticiones a la API y manejo de errores controlados.

evidencias/integrante-3/: Compilación, pruebas en Postman, vista SSR, ruta dinámica de detalle y detalle expandible.

evidencias/integrante-4/: Build de producción, configuración en next.config.mjs y despliegue en Vercel.

evidencias/integrante-5/: Interfaz principal con Navbar.jsx y page.jsx, navegación hacia /solicitudes y /login, y capturas de implementación.

7. Conclusiones

Consumo de API y sesiones JWT: Validar respuestas, manejar errores HTTP de forma controlada y centralizar el estado de sesión JWT permite que la aplicación responda de manera coherente ante distintos estados de autenticación y red.

Next.js, SSR/SSG y rutas dinámicas: Elegir la estrategia de renderizado según la naturaleza de cada vista y contar con rutas dinámicas ([id]) facilita la entrega de contenido y el acceso al detalle de solicitudes.

Producción y despliegue en Vercel: Preparar variables de entorno, optimización/minificación, logs y despliegue en Vercel garantiza que el proyecto sea verificable y mantenible en un entorno real dentro del corte de la sesión 13.

Trabajo en equipo: Distribuir responsabilidades claras por integrante sobre una misma base en GitHub permitió integrar servicios, autenticación, vistas, despliegue y documentación sin pisar el trabajo de los demás.

8. Video público de exposición
Video público de YouTube: [PEGAR AQUÍ EL ENLACE] 
