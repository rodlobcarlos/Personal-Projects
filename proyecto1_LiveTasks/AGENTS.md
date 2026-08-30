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
- Tests frontend (Vitest vía `@angular/build:unit-test`): `npm test` (watch) / `npm run test:ci` (una pasada). Setup global en `src/test-setup.ts` (mock de `matchMedia`) declarado en `angular.json → test.setupFiles` e incluido en `tsconfig.spec.json`.
- Backend (`server/`):
  ```bash
  npm install
  npm run dev      # tsx watch
  npm run db:setup # aplica schema.sql a MySQL
  npm run build    # tsc → dist/
  npm run start    # node dist/index.js
  npm run typecheck # tsc --noEmit
  npm test          # vitest run (suite backend)
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
- **Presupuesto CSS**: `angular.json` → `anyComponentStyle` warning 4 kB → **6 kB**, luego 6 → **8 kB** (error 10 kB) al enriquecer los componentes.
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

### Paso 6b completado: GSAP Animations

- **GSAP** (`gsap` npm package) integrado en todo el frontend.
- **`GsapService`** (`core/services/gsap.service.ts`): utilidades reutilizables `fadeUp`, `fadeIn`, `staggerIn`, `scaleIn`, `slideIn` con defaults (`duration: 0.6`, `ease: power2.out`).
- **`ScrollAnimateDirective`** actualizada: IntersectionObserver + GSAP (reemplaza CSS transitions previas).
- **Landing**: header slide-down, hero children stagger-in (0.15s), feature cards con `appScrollAnimate`.
- **Shell**: navbar entrance animation.
- **Tasks**: title fade-up, list stagger-in, new task slide-in, delete slide-out before HTTP.
- **Auth (login + register)**: card entrance (`scale: 0.95 → 1`, `y: 30 → 0`, `autoAlpha`).
- **`styles.scss`**: eliminadas reglas `.scroll-animate`/`.scroll-visible` (reemplazadas por GSAP). `prefers-reduced-motion` general.
- `DestroyRef` para cleanup de observers/tweens en cada componente.

### Paso 7 completado: Calendar / Monitoring / Notes

- **Backend**: `server/src/routes/notes.ts` — CRUD completo `/api/notes` (GET all, GET by id, POST, PATCH, DELETE) con Zod + `authenticate`, registrado en `server/src/app.ts`.
- **Modelo**: `src/app/models/note.model.ts` — interfaces `Note`, `CreateNotePayload`, `UpdateNotePayload`.
- **NoteService** (`core/services/note.service.ts`): CRUD HTTP con `HttpClient`.
- **NotesComponent** (`features/notes/`): editor rich-text con `ngx-editor` v19 (toolbar completa: bold/italic/underline/strike/code/blockquote/lists/headings/link/image/colors/alignment/hr), sidebar con lista de notas, autosave con debounce 1s, status indicator (saving/saved/error), crear/eliminar notas, responsive (sidebar colapsa en mobile).
- **CalendarComponent** (`features/calendar/`): grilla de mes con navegación (prev/next), dots de color por tarea según status (todo=warning, doing=primary, done=success), selección de día con sidebar de tareas del día, botón "Hoy", highlight de día actual, month label capitalizado con `TitleCasePipe`.
- **MonitoringComponent** (`features/monitoring/`): 5 stat cards (total, completadas, pendientes, en curso, tasa de completado con progress bar), gráfico de barras últimos 7 días (created vs completed con leyenda), empty state cuando no hay datos.
- Verificado: backend typecheck OK, lint OK, build OK (422 kB initial, 316 kB lazy notes chunk por ngx-editor), tests 2/2 OK.

### Paso 10 completado: Dashboard — vista única unificada

- **DashboardComponent** (`features/dashboard/`): una sola página de scroll largo que **reúne las 4 secciones** reutilizando los componentes existentes (`<app-tasks/>`, `<app-calendar/>`, `<app-monitoring/>`, `<app-notes/>`) en `<section id="tasks|calendar|monitoring|notes">`, sin duplicar lógica.
- **Orden**: Tasks → Calendar → Monitoring → Notes. Cada sección en tarjeta `.dash-section` (borde + `--color-surface` + `--shadow-sm`, hover lift) replicando el estilo de la landing.
- **Fondo distinto propio**: degradado radial/lineal en paleta de marca (crema→morado claro; en dark `#1a1625`→`#2a2140`). Paneles con superficie semi-opaca para legibilidad.
- **GSAP**: entrada de secciones con `ScrollTrigger.batch` (`once`, fadeUp al entrar en viewport) + `prefers-reduced-motion` + cleanup `DestroyRef`.
- **Rutas** (`app.routes.ts`): las 4 rutas hijas de `/app` se reemplazan por **una** (`''` → Dashboard). Las antiguas `/app/tasks|calendar|monitoring|notes` redirigen a `''` por compatibilidad.
- **Shell**: los 4 tabs ahora son **anclas de scroll** (`data-scroll-target` + `scrollIntoView({behavior:'smooth'})`); la **tab activa se marca por ScrollTrigger** según la sección visible (sustituye `routerLinkActive`). Brand vuelve al top.
- **Presupuesto CSS**: `angular.json` → `anyComponentStyle` warning **12 kB** (error **14 kB**) por dashboard.scss.

### Paso 11 completado: Suite de tests integral (pre-despliegue)

- **Frontend** (`src/`): Vitest vía `@angular/build:unit-test`; `setupFiles: ["src/test-setup.ts"]` (mock de `matchMedia` para GSAP/ScrollTrigger) en `angular.json`; scripts `test` (watch) y `test:ci` (`ng test --watch=false`).
  - `dashboard.spec.ts` (smoke: se crea + renderiza los 4 anchors), `shell.spec.ts` (logout, scrollTo).
  - Services: `theme`, `i18n`, `task`, `note`, `ai` (HTTP con `provideHttpClientTesting`).
  - Componentes con services mockeados: `tasks` (CRUD, ciclo status, filtros, contadores, overdue, fallback IA con `vi.mock('gsap')`), `calendar` (grilla 42 días, navegación, filtro por día, resumen IA), `monitoring` (stat counts, tasa, trend 7 días, empty).
  - Resultado: **11 archivos / 57 tests**.
- **Backend** (`server/`): añadido **Vitest** (devDep) + `vitest.config.ts` (env `node`, `setupFiles: vitest.setup.ts` que define env mínima) + script `test` (`vitest run`). `.spec.ts` y archivos de config de vitest **excluidos** de `tsconfig.json` (no van al build `dist`).
  - `validation/schemas.ts` (nuevo): schemas Zod de tasks/notes/ai **extraídos** y reutilizados por las rutas (`tasks.ts`, `notes.ts`, `ai.ts` simplificados) → testeables sin DB.
  - `schemas.spec.ts` (validación tasks/notes/ai), `gemini.spec.ts` (`isGeminiAvailable` con/sin key vía `vi.stubEnv` + re-import), `auth.spec.ts` (`verifyToken`: 401 sin/Bearer/inválido, y set de `req.user` mockeando firebase). `app.spec.ts` (servidor HTTP real sobre `createApp()` + fetch: 404, health db up/down, 401 sin token, AI 503 sin key).
  - Resultado: **4 archivos / 27 tests**.
- **Verificado pre-despliegue** (todo OK): lint raíz, tests frontend (57), typecheck+build server, build producción raíz sin warnings de presupuesto.

## Plan por ejecutar (en orden)

1. ~~**Shell + navegación**~~ ✅ Completado (paso 5).
2. ~~**Tasks**~~ ✅ Completado (paso 6).
3. ~~**Calendar / Monitoring / Notes**~~ ✅ Completado (paso 7).
4. ~~**Integración IA (Gemini)**~~ ✅ Completado (paso 8).
5. ~~**Dashboard (vista única + fondo + GSAP)**~~ ✅ Completado (paso 10).
6. ~~**Suite de tests integral**~~ ✅ Completado (paso 11).

### Paso 8 completado: Integración IA (Gemini)

- **Backend** (`server/src/services/gemini.ts`): wrapper de `@google/generative-ai` con 4 funciones: `parseNaturalTask`, `prioritizeTasks`, `chatWithAI`, `generateDailySummary`. Prompt injection previene abusos. `isGeminiAvailable()` checkeable.
- **Backend rutas** (`server/src/routes/ai.ts`): `POST /api/ai/parse`, `POST /api/ai/prioritize`, `POST /api/ai/chat`, `POST /api/ai/summary`. Todas con `authenticate` + Zod + error 503 si `GEMINI_API_KEY` falta.
- **Frontend `AiService`** (`core/services/ai.service.ts`): `parseNatural`, `prioritize`, `chat`, `dailySummary` — HTTP calls a los endpoints AI.
- **Tasks**: toggle "Entrada inteligente" que activa parsing con IA (título + prioridad + fecha desde lenguaje natural). Botón "Priorizar" para re-priorizar tareas pendientes con IA. Fallback a creación directa si la IA falla. Spinner en input durante parsing.
- **Calendar**: botón "Generar resumen" en sidebar que llama `POST /api/ai/summary` con la fecha seleccionada. Muestra el resumen generado por Gemini.
- `GEMINI_API_KEY` sigue vacía en `server/.env` — solo falta añadirla para activar la IA.

### Paso 9 completado: Mejoras de legibilidad (Tasks / Calendar / Monitoring / Notes)

- **Tasks** (`features/tasks/`): tarjetas con acento lateral de prioridad (alta=rojo/media=naranja/baja=verde), badges de vencimiento (`due--overdue/today/tomorrow/future` vía `getDueDateInfo()`), fecha de creación, contador por filtro (`.task-filter__count`), header con total, input/acciones AI en tarjeta, empty states con icono, lista con estilo coloreado por prioridad y resaltado de atrasadas.
- **Calendar** (`features/calendar/`): celdas más altas con fondo sutil si tienen tareas + count badge, task cards en sidebar con prioridad badge, sidebar sticky, header de día con badge de count, empty states con icono, nav buttons más grandes, resumen IA con encabezado e icono.
- **Monitoring** (`features/monitoring/`): stat cards con iconos SVG de color (total/completadas/pendientes/en curso/tasa), tarjeta resumen semanal con datos de la semana (`trendTotal`), empty state con icono, chart con mejor espaciado.
- **Notes** (`features/notes/`): preview de contenido en la sidebar (`getChipPreview()`), word counter en la toolbar (`wordCount`), "Editada dd/MM/yy" con clave `notes.lastUpdated`, empty states con icono, active state con barra lateral, botón add con icono.
- **i18n**: nuevas claves `monitoring.weekSummary/weekCreated/weekCompleted`, `notes.words/lastUpdated/empty/emptyList` en `{es,en}.ts`.
- **Presupuesto CSS**: `anyComponentStyle` 6→**8 kB** warning (error 10 kB) por los styles enriquecidos.
- **Estilo landing replicado**: tarjetas (calendar/stat-cards/trend/tasks/notes) con `--color-surface` + borde + `--shadow-sm` y hover lift (`translateY(-4px)` + `--shadow-md` + borde primary), como las `feature-card` de la landing.
- **Corrección de tokens**: eliminados usos de `--space-5` (token inexistente) en calendar/monitoring → `--space-6`. Celdas de calendario con `min-height` y padding correctos.
- **Modo claro mejorado**: `--color-text` → `#5b2ab0` (más oscuro, mejor contraste) y `--color-text-muted` → `#8a75a8` (morado atenuado; antes era idéntico a `--color-text`, sin jerarquía) en `styles.scss`.
- **Modo oscuro**: overrides de contraste en tasks (filtro activo y checkbox done) y calendar (número del día "hoy") usando `var(--color-bg)` como texto sobre primary/success claros.
- Verificado: lint OK, build OK (sin warnings), tests 2/2 OK.

### Claves para los próximos pasos

- **Todas las funcionalidades principales están implementadas**: auth, landing, shell, dashboard unificado (tasks/calendar/monitoring/notes), notes rich-text, IA (Gemini).
- `GEMINI_API_KEY` en `server/.env` — añadirla para activar funcionalidad IA (los tests ya cubren el 503 "sin key").
- Opciones de mejora: chat widget integrado en shell, notificaciones push, tests E2E, PWA, despliegue.
- Auth login/register comparten SCSS/HTML casi idénticos: al pulir una, espejar los cambios en la otra.
- El shell ya no usa `routerLinkActive` (anclas de scroll + ScrollTrigger para marcar tab activa); si se reintroducen rutas hijas, restaurar el patrón anterior.

## Convenciones

- Componentes standalone: `*.ts` / `*.html` / `*.scss` (mismo nombre, sin sufijo `.component`).
- Texto siempre vía pipe `translate` (nunca strings hardcodeados).
- Rutas con lazy loading (`loadComponent` / `loadChildren`).
- Backend: TypeScript estricto, `zod` para validar bodies, queries con prepared statements, rutas protegidas con `verifyToken`.
- Verificación: lint antes de terminar (comando directo de `ng.js`).
