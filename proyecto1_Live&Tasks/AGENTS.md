# Live&Tasks

Gestor de tareas con IA (Angular 21 standalone, SCSS, Firebase Auth + API Node/Express + MySQL + Google Gemini + ngx-editor). Repo: `Personal-Projects` (rama `main`).

## Entorno

- Proyecto: `C:\Users\rodlo\Documents\GitHub\Personal-Projects\proyecto1_Live&Tasks\`
- Frontend (Angular): `http://localhost:4200/`. Backend (Express): `http://localhost:3000/`.
- **Bug Windows:** el `&` del nombre de la carpeta rompe los scripts de npm. NO usar `npm run <cmd>`; invocar Angular directo:
  ```bash
  node "node_modules\@angular\cli\bin\ng.js" serve
  node "node_modules\@angular\cli\bin\ng.js" build
  node "node_modules\@angular\cli\bin\ng.js" lint
  node "node_modules\@angular\cli\bin\ng.js" test
  ```
- Backend (`server/`):
  ```bash
  npm install
  npm run dev
  ```
- Pendiente: renombrar la carpeta a `live-tasks` cuando ningún proceso la tenga abierta.

## Arquitectura

- **Frontend (Angular 21)**: autenticación Firebase directa (email/contraseña + Google). Obtiene el ID token y lo envía como `Authorization: Bearer <token>` (interceptor) a la API.
- **Backend (`server/`, Node.js + Express + TypeScript)**: verifica el token con `firebase-admin`, persiste datos en **MySQL local** y actúa como **proxy de Gemini** (la API key solo vive en el servidor). `serviceAccountKey.json` y `.env` NO se suben al repo.
- **i18n**: pipe `translate` + diccionarios `src/i18n/{es,en}.ts` (spec de pantallas).

## Estado (paso 1 completado)

- Firebase configurado en `src/environments/{environment,environment.prod}.ts` (proyecto `livetasks-6bac8`).
- `core/services/auth.service.ts`: `signUp` (con displayName), `signIn`, `signInWithGoogle`, `logOut`, signal `user`, `authState$`, `getIdToken()`, mapeo de errores Firebase → claves i18n.
- `core/interceptors/auth.interceptor.ts`: añade `Authorization: Bearer <idToken>` a las peticiones.
- `core/guards/auth.guard.ts`: protege rutas privadas → redirige a `/auth/login`.
- `features/auth/login` y `features/auth/register` con `@angular/forms` (validaciones, errores traducidos, botón Google, link cruzado).
- Sección `auth` en `i18n/{es,en}.ts` (+ `tasks.comingSoon`).
- Ruta placeholder `/tasks` (protegida) como destino tras login.
- UI primitives globales en `styles.scss`: `.button` (variants) y `.field` (label/input/error).
- Antes (pasos previos): landing, rutas lazy, i18n funcional, scaffold commiteado (`2006805d`).

## Plan por ejecutar (en orden)

1. **Backend Node/Express/TS + MySQL** — `server/`: Express + `firebase-admin` (middleware `verifyToken` sobre `Bearer <idToken>`) + `mysql2` (pool, prepared statements) + `zod`. `schema.sql` (users/tasks/notes). `GET /api/health`. `.env` con credenciales MySQL (host/puerto/usuario/clave/nombre) y `GEMINI_API_KEY`. Requiere: datos de conexión MySQL + `serviceAccountKey.json` de Firebase.
2. **Shell + navegación** — layout con 4 pestañas (Tareas, Calendario, Monitoreo, Notas) y logout (`i18n/nav`).
3. **Tasks** — modelo en `models/`, CRUD `/api/tasks` (backend) + `task.service` (frontend), entrada en lenguaje natural, filtros, prioridades, estados (`i18n/tasks`).
4. **Calendar / Monitoring / Notes** — resumen IA del día, estadísticas + tendencia 7 días, notas rich-text con autosave (ngx-editor) → `/api/notes`.
5. **Integración IA (Gemini) en backend** — `POST /api/ai/*` con `@google/generative-ai` server-side (parsing de lenguaje natural, priorización, chat asistente) (`i18n/ai`).

## Convenciones

- Componentes standalone: `*.ts` / `*.html` / `*.scss` (mismo nombre, sin sufijo `.component`).
- Texto siempre vía pipe `translate` (nunca strings hardcodeados).
- Rutas con lazy loading (`loadComponent` / `loadChildren`).
- Backend: TypeScript estricto, `zod` para validar bodies, queries con prepared statements, rutas protegidas con `verifyToken`.
- Verificación: lint antes de terminar (comando directo de `ng.js`).
