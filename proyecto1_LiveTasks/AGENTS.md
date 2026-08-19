# Life&Tasks

Gestor de tareas con IA (Angular 21 standalone, SCSS, Firebase Auth + API Node/Express + MySQL + Google Gemini + ngx-editor). Repo: `Personal-Projects` (rama `main`).

## Entorno

- Proyecto: `C:\Users\rodlo\Documents\GitHub\Personal-Projects\proyecto1_LiveTasks\` (carpeta renombrada, ya sin `&`).
- Frontend (Angular): `http://localhost:4200/`. Backend (Express): `http://localhost:3000/`.
- `apiUrl` del frontend: `http://localhost:3000/api` (dev) / `/api` (prod) en `src/environments/environment{,prod}.ts`.
- Los scripts de npm funcionan (el bug del `&` desapareció al renombrar). Si algún día fallaran, usar el binario directo:
  ```bash
  node "node_modules\@angular\cli\bin\ng.js" serve
  node "node_modules\@angular\cli\bin\ng.js" build
  node "node_modules\@angular\cli\bin\ng.js" lint
  node "node_modules\@angular\cli\bin\ng.js" test
  ```
- Backend (`server/`):
  ```bash
  npm install
  npm run dev      # tsx watch
  npm run db:setup # aplica schema.sql a MySQL
  npm run build    # tsc → dist/
  npm run start    # node dist/index.js
  ```
- MySQL local: base **`live_tasks`** (no `liveTasks`; el usuario `crl` solo tiene permisos ahí y no puede crear BDs). Credenciales en `server/.env` (NO versionado).
- Pendiente: renombrar la carpeta a `live-tasks` cuando ningún proceso la tenga abierta.

## Arquitectura

- **Frontend (Angular 21)**: autenticación Firebase directa (email/contraseña + Google). Obtiene el ID token y lo envía como `Authorization: Bearer <token>` (interceptor) a la API.
- **Backend (`server/`, Node.js + Express + TypeScript)**: verifica el token con `firebase-admin`, persiste datos en **MySQL local** y actúa como **proxy de Gemini** (la API key solo vive en el servidor). `serviceAccountKey.json` y `.env` NO se suben al repo.
- **i18n**: pipe `translate` + diccionarios `src/i18n/{es,en}.ts` (spec de pantallas).

## Estado

### Paso 1 completado: auth frontend

- Firebase configurado en `src/environments/{environment,environment.prod}.ts` (proyecto `livetasks-6bac8`).
- `core/services/auth.service.ts`: `signUp` (con displayName), `signIn`, `signInWithGoogle`, `logOut`, signal `user`, `authState$`, `getIdToken()`, mapeo de errores Firebase → claves i18n.
- `core/interceptors/auth.interceptor.ts`: añade `Authorization: Bearer <idToken>` a las peticiones.
- `core/guards/auth.guard.ts`: protege rutas privadas → redirige a `/auth/login`.
- `features/auth/login` y `features/auth/register` con `@angular/forms` (validaciones, errores traducidos, botón Google, link cruzado).
- Sección `auth` en `i18n/{es,en}.ts` (+ `tasks.comingSoon`).
- Ruta placeholder `/tasks` (protegida) como destino tras login.
- UI primitives globales en `styles.scss`: `.button` (variants) y `.field` (label/input/error).
- Antes (pasos previos): landing, rutas lazy, i18n funcional, scaffold commiteado (`2006805d`).

### Paso 2 completado: backend Node/Express/TS + MySQL

- `server/` con Express + TS (ESM, `NodeNext`), `firebase-admin`, `mysql2` (pool con prepared statements y `namedPlaceholders`), `zod`.
- `server/src/config/{env,firebase,db}.ts`: env validado con zod; Firebase init con `serviceAccountKey.json`; pool MySQL.
- `server/src/middleware/auth.ts`: `verifyToken` (Bearer → `firebase-admin`) + `ensureUser` (upsert del usuario en tabla `users`); export `authenticate` para rutas protegidas.
- `server/schema.sql`: tablas `users` / `tasks` / `notes` en BD `live_tasks` (aplicadas).
- `GET /api/health` (público) verifica conexión a MySQL → `{ status, db }`.
- `server/.env` (credenciales MySQL + `GEMINI_API_KEY` pendiente) y `server/serviceAccountKey.json` NO se versionan (gitignore propio).
- `scripts/apply-schema.ts` (`npm run db:setup`) aplica `schema.sql`.
- Verificado: `npm run typecheck`, `npm run build`, arranque del servidor y `GET /api/health` → `{"status":"ok","db":"up"}`.

### Paso 3 completado: pulido de vistas públicas

- **Landing** (`features/landing`): hero con CTA (Empezar + Iniciar sesión ghost + botón Google funcional vía `AuthService`), sección features con iconos SVG (tareas/calendario/monitoreo/notas), banda CTA y footer enriquecido (links + copyright con año). Overlay `landing-backdrop` (crema translúcido fijo) para legibilidad sobre la imagen de fondo.
- **Logo**: `public/assets/logoApp.png` (cuadrado) en header y footer de la landing a 2rem (`.landing-brand__logo img`, `object-fit: contain`).
- **Auth** (`features/auth/login|register`): `login.scss`/`register.scss` con escrim difuminado, tarjeta frosted + barra de acento degradada, animación de entrada y ajuste responsive. Botón `.auth-back` "Volver" → `/` en ambas tarjetas (clave `common.back`).
- **Primitivas**: `.button--ghost` en `styles.scss` ahora es ghost real (transparente, borde/texto primary).
- **Presupuesto CSS**: `angular.json` → `anyComponentStyle` warning 4 kB → **6 kB** (error 8 kB).
- **i18n**: nuevas claves `landing.featuresEyebrow/featuresTitle/featuresSubtitle`, `landing.ctaTitle/ctaSubtitle`, `landing.footerTagline/footerRights` en `{es,en}.ts`.
- Verificado: `npm run lint`, `npm run build` (sin warnings) y tests (2/2).

### Paso 4 completado: i18n + dark mode + nombre Life&Tasks

- **ThemeService** (`core/services/theme.service.ts`): signal `theme`, `toggleTheme()`, persistencia `localStorage`, atributo `data-theme` en `<html>`. Respeta `prefers-color-scheme`.
- **LangToggleComponent** (`shared/components/lang-toggle/`): pill button ES↔EN, usa `I18nService.setLang()`.
- **ThemeToggleComponent** (`shared/components/theme-toggle/`): pill button sol/luna con SVG inline, usa `ThemeService.toggleTheme()`.
- **Dark mode real**: `[data-theme='dark']` en `styles.scss` con paleta oscura (#1a1625 bg, #231e30 surface, #a78bfa primary). Transiciones en body. Imagen de fondo visible en dark mode con overlay más opaco.
- **Nombre**: "Live&Tasks" → "Life&Tasks" en todos los archivos (i18n, server, AGENTS.md).
- **Claves i18n**: `common.language`, `common.darkMode`, `common.lightMode` en `{es,en}.ts`.
- Toggles en landing header (`.landing-nav`).
- Verificado: lint, build, tests 2/2.

### Paso 5 completado: Shell + navegación

- **ShellComponent** (`features/shell/`): navbar sticky con backdrop blur, logo Life&Tasks, 4 tabs (`routerLinkActive` con borde inferior animado), lang toggle, theme toggle, botón logout.
- **Rutas anidadas**: `/app` → `ShellComponent` → children (`/app/tasks`, `/app/calendar`, `/app/monitoring`, `/app/notes`). Default redirect a `/app/tasks`.
- **Placeholder components**: `CalendarComponent`, `MonitoringComponent`, `NotesComponent` con título i18n + "Próximamente".
- **Navegación actualizada**: login, register y landing ahora navegan a `/app/tasks`.
- **i18n**: `nav.tasks`, `nav.calendar`, `nav.monitoring`, `nav.notes` ya existentes.
- Verificado: lint, build, tests 2/2.

### Paso 6 en ejecución: Tasks (CRUD frontend + backend)

- Modelo `Task` en `src/app/models/task.model.ts` con tipos `TaskStatus` (todo/doing/done), `TaskPriority` (low/medium/high), interfaces `Task`, `CreateTaskPayload`, `UpdateTaskPayload`.
- `TaskService` (`core/services/task.service.ts`): CRUD HTTP con `HttpClient` ( interceptor auth automático).
- Backend `server/src/routes/tasks.ts`: GET/POST/PATCH/DELETE `/api/tasks` con Zod + `authenticate`.
- `TasksComponent` completo: input de creación, filtros por status, lista con checkbox/eliminar, contador de pendientes.
- Mapeo DB→Frontend: `todo↔pending`, `doing↔inProgress`, `done↔completed`.

## Plan por ejecutar (en orden)

1. ~~**Shell + navegación**~~ ✅ Completado (paso 5).
2. **Tasks** — modelo en `models/`, CRUD `/api/tasks` (backend) + `task.service` (frontend), entrada en lenguaje natural, filtros, prioridades, estados (`i18n/tasks`).
3. **Calendar / Monitoring / Notes** — resumen IA del día, estadísticas + tendencia 7 días, notas rich-text con autosave (ngx-editor) → `/api/notes`.
4. **Integración IA (Gemini) en backend** — `POST /api/ai/*` con `@google/generative-ai` server-side (parsing de lenguaje natural, priorización, chat asistente) (`i18n/ai`).

### Claves para los próximos pasos

- Backend listo: middleware `authenticate` (verifyToken + ensureUser) en `server/src/middleware/auth.ts` para rutas protegidas; tablas `tasks` y `notes` ya creadas en `live_tasks`; `GET /api/health` como referencia. **Faltan** las rutas `/api/tasks`, `/api/notes` y `/api/ai/*`.
- `GEMINI_API_KEY` sigue vacía en `server/.env` (solo hará falta en el paso de IA).
- Frontend: `src/app/models/` vacío (solo `.gitkeep`); crear modelo `Task` y `task.service`; la ruta `/tasks` es un placeholder protegido.
- i18n: las secciones `nav`, `tasks`, `calendar`, `monitoring`, `notes` y `ai` ya existen en `{es,en}.ts` (spec de pantallas) — usarlas al construir vistas.
- Auth login/register comparten SCSS/HTML casi idénticos: al pulir una, espejar los cambios en la otra.

## Convenciones

- Componentes standalone: `*.ts` / `*.html` / `*.scss` (mismo nombre, sin sufijo `.component`).
- Texto siempre vía pipe `translate` (nunca strings hardcodeados).
- Rutas con lazy loading (`loadComponent` / `loadChildren`).
- Backend: TypeScript estricto, `zod` para validar bodies, queries con prepared statements, rutas protegidas con `verifyToken`.
- Verificación: lint antes de terminar (comando directo de `ng.js`).
