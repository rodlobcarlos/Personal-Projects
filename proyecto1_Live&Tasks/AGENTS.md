# Live&Tasks

Gestor de tareas con IA (Angular 21 standalone, SCSS, Firebase + Google Gemini + ngx-editor). Repo: `Personal-Projects` (rama `main`).

## Entorno

- Proyecto: `C:\Users\rodlo\Documents\GitHub\Personal-Projects\proyecto1_Live&Tasks\`
- **Bug Windows:** el `&` del nombre de la carpeta rompe los scripts de npm. NO usar `npm run <cmd>`; invocar Angular directo:
  ```bash
  node "node_modules\@angular\cli\bin\ng.js" serve
  node "node_modules\@angular\cli\bin\ng.js" build
  node "node_modules\@angular\cli\bin\ng.js" lint
  node "node_modules\@angular\cli\bin\ng.js" test
  ```
- Pendiente: renombrar la carpeta a `live-tasks` cuando ningún proceso la tenga abierta (dev server actual en `http://localhost:4200/`).

## Estado (paso 2 completado)

- `src/styles.scss`: design tokens globales. Tema claro: fondo `#FFEBAF`, texto `#4C9DB0`, superficies crema/teal. Tema oscuro vía `prefers-color-scheme`.
- `features/landing/` (`landing.ts/html/scss`): hero "Organiza tu vida con IA", CTAs (Empezar → `/auth/register`, login, Continuar con Google), 4 feature cards. Todo con pipe `translate`.
- Rutas lazy (`app.routes.ts`): `/` → Landing, `/auth` → `features/auth/auth.routes.ts` con stubs `login`/`register`.
- `app.html` limpio (solo `<router-outlet />`); `app.ts`/`app.spec.ts` actualizados.
- `core/services/i18n.service.ts` y `shared/pipes/translate.pipe.ts` funcionales (es/en). Los diccionarios `src/i18n/{es,en}.ts` son la spec completa de pantallas.
- Scaffold inicial commiteado y pusheado (commit `2006805d`).

## Plan por ejecutar (en orden)

1. **Auth (Firebase + guard)** — `features/auth`: login/register reales con `@angular/forms`, `auth.service` (email/password + Google), errores de `i18n/auth`, guard en `core/guards`.
2. **Shell + navegación** — layout con 4 pestañas (Tareas, Calendario, Monitoreo, Notas) y logout (`i18n/nav`).
3. **Tasks** — modelo en `models/`, `task.service` (Firestore), entrada en lenguaje natural, filtros, prioridades, estados (`i18n/tasks`).
4. **Calendar / Monitoring / Notes** — resumen IA del día, estadísticas + tendencia 7 días, notas rich-text con autosave (ngx-editor).
5. **Integración IA (Gemini)** — parsing de lenguaje natural, priorización, chat asistente (`i18n/ai`); usar `environments/environment.ts` (`aiProxy.url`) y `@google/generative-ai`.

## Convenciones

- Componentes standalone: `*.ts` / `*.html` / `*.scss` (mismo nombre, sin sufijo `.component`).
- Texto siempre vía pipe `translate` (nunca strings hardcodeados).
- Rutas con lazy loading (`loadComponent` / `loadChildren`).
- Verificación: lint antes de terminar (comando directo de `ng.js`).
