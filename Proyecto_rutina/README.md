# Proyecto Rutina — Rutina Diaria

Aplicación de gestión de rutina diaria: **hábitos**, **tareas**, **bloques de tiempo**
(time blocking), **recordatorios** y **estadísticas de cumplimiento** (rachas, % de
cumplimiento semanal/mensual).

> Estado actual: **Base de datos + Backend** (entrega 1). El frontend Angular se
> construirá en la siguiente fase.

## Stack

| Capa       | Tecnología                                           |
|------------|------------------------------------------------------|
| Frontend   | Angular 21 (en desarrollo — siguiente fase)          |
| Backend    | Node.js + Express + TypeScript (strict)              |
| ORM        | TypeORM                                              |
| Base datos | MySQL 8                                             |
| Auth       | JWT (access 15 min) + refresh tokens rotatorios      |
| Validación | class-validator / class-transformer                  |
| Docs       | Swagger/OpenAPI (UI en `/api-docs`)                 |

### Decisiones técnicas

- **Express en vez de NestJS**: suficiente para esta escala, menos acoplamiento y arranque
  más simple. La estructura en capas (rutas → controladores → servicios → repositorios)
  compensa la falta de "magia" de Nest.
- **TypeORM en vez de Sequelize**: integración nativa con TypeScript (decoradores),
  compatible con `class-validator`, migraciones y `DataSource`. `simple-enum` se usa en
  lugar de `ENUM` nativo para que el mismo esquema funcione en MySQL y en SQLite (tests).
- **Estado del frontend con Signals** (a decidir en la fase frontend): suficiente para
  esta app; NgRx aportaría complejidad innecesaria.

## Estructura

```
backend/
├── db/
│   ├── schema.sql          # Esquema completo + índices + FKs + CHECKs
│   └── seed.sql            # Datos demo (usuario, hábitos, tareas, completados)
├── src/
│   ├── app.ts              # Configuración de Express (helmet, cors, rate-limit, swagger)
│   ├── server.ts           # Arranque + graceful shutdown
│   ├── config/             # env (dotenv), orm (DataSource), logger (Winston)
│   ├── core/               # AppError, helpers de respuesta, fechas/zona horaria, validadores
│   ├── entities/           # Usuario, RefreshToken, Habit, Task, Completion, TimeBlock, Category
│   ├── repositories/       # Capa de acceso a datos (User, Habit, Task, Completion)
│   ├── middleware/         # error handler, auth JWT, rate-limit, validación DTO
│   ├── docs/openapi.json   # Especificación OpenAPI 3 con ejemplos request/response
│   ├── modules/            # auth, habits, tasks, timeblocks, categories, profile, stats
│   └── db/                 # Scripts node: create-db.ts, run-sql.ts
└── tests/                  # Jest: auth service + rachas (SQLite en memoria)
```

## Base de datos

9 tablas relacionales:

- `users` — credenciales, zona horaria, tema claro/oscuro y preferencias (JSON).
- `refresh_tokens` — refresh tokens con **hash SHA-256** y rotación/revocación.
- `habits` — frecuencia `daily` / `weekly` / `custom` (días ISO 0=Lunes…6=Domingo en `custom_days`).
- `tasks` — tareas puntuales con fecha/hora, prioridad y estado.
- `completions` — log diario (habit **o** task), base para rachas y estadísticas (CHECK garantiza uno de los dos).
- `time_blocks` — bloques de tiempo por fecha/hora (con CHECK `start < end`).
- `categories` + `task_categories` + `habit_categories` — categorías y relaciones N:M.

Cada registro incluye índices en `user_id`, fechas y estados para consultas rápidas.

## Puesta en marcha

Requisitos: **Node 18+** y **MySQL 8** local.

### 1. Configurar el backend

```bash
cd backend
npm install
```

Copia la configuración y completa tus credenciales de MySQL:

```bash
Copy-Item .env.example .env     # Windows
# edita backend/.env, en especial: DB_USER, DB_PASS, JWT_SECRET
```

> Usuario demo del seed: `demo@rutina.app` / `Demo1234!`

### 2. Crear la base de datos

Opción A — con los scripts del proyecto (necesita `.env` correctamente configurado):

```bash
npm run db:create     # crea la base de datos si no existe
npm run db:schema     # ejecuta db/schema.sql
npm run db:seed       # ejecuta db/seed.sql (datos de prueba)
```

Opciones más simples:
- MySQL Workbench / CLI: ejecuta directamente `db/schema.sql` y luego `db/seed.sql`.
- Sólo desarrollo: deja `DB_SYNCHRONIZE=true` en `.env`; al arrancar el servidor
  TypeORM crea el esquema automáticamente desde las entidades (la BD debe existir,
  usa `npm run db:create`).

### 3. Ejecutar

```bash
npm run dev      # desarrollo con recarga (ts-node-dev)
npm run build    # compilación a dist/
npm start        # producción (node dist/server.js)
npm test         # tests Jest (auth + rachas)
```

Servidor: http://localhost:3000 · Documentación: http://localhost:3000/api-docs

## Endpoints principales

> Formato respuesta éxito: `{ "success": true, "data": ... }`
> Formato error: `{ "success": false, "error": { "code", "message", "details" } }`

| Método | Ruta                           | Acción                                  |
|--------|--------------------------------|-----------------------------------------|
| POST   | `/api/auth/register`           | Registrar usuario (email, password, name, timezone) |
| POST   | `/api/auth/login`              | Login → `{ accessToken, refreshToken }` |
| POST   | `/api/auth/refresh`            | Rotar tokens con `refreshToken`         |
| POST   | `/api/auth/logout`             | Revocar refresh token                   |
| GET    | `/api/auth/me`                 | Usuario autenticado                     |
| GET/POST    | `/api/habits`            | Listar / crear hábitos                  |
| GET/PUT/DELETE | `/api/habits/:id`     | Obtener / actualizar / eliminar         |
| POST   | `/api/habits/:id/complete`     | Marcar completado del día (idempotente) |
| DELETE | `/api/habits/:id/completion`   | Desmarcar del día                       |
| GET    | `/api/habits/:id/streak`       | Racha actual + máxima                   |
| GET/POST    | `/api/tasks`             | Listar (filtros) / crear tareas         |
| GET/PUT/DELETE | `/api/tasks/:id`       | CRUD de tarea                           |
| POST   | `/api/tasks/:id/complete`      | Completar tarea                         |
| GET/POST    | `/api/time-blocks`       | Bloques de tiempo (con filtro from/to)  |
| PUT/DELETE  | `/api/time-blocks/:id`   | Actualizar / eliminar bloque            |
| GET/POST    | `/api/categories`        | Categorías                              |
| GET/PUT/DELETE | `/api/categories/:id` | CRUD de categoría                       |
| GET/PUT | `/api/profile`                 | Perfil: zona horaria, tema (light/dark/system), preferencias |
| GET    | `/api/stats/summary?range=week\|month&from&to` | % cumplimiento, por hábito y por día |
| GET    | `/api/stats/streaks`           | Rachas de todos los hábitos             |

Se requiere `Authorization: Bearer <accessToken>` en todos los endpoints excepto
`/api/auth/register`, `/api/auth/login` y `/api/auth/refresh`.

Ejemplos completos de request/response están en Swagger (`/api-docs`) y en
`src/docs/openapi.json`.

## Seguridad

- Contraseñas con **bcrypt** (cost 10).
- **JWT** access (15 min) + refresh guardado en BD como SHA-256, con **rotación** en cada
  renovación y revocación al cerrar sesión.
- **Rate limiting** en `/api/auth/*` (20 req / 15 min) y global (300 req / 15 min) vía
  `express-rate-limit`.
- **Helmet** + **CORS** restringido a orígenes de `CORS_ORIGINS`.
- **Datos validados** con `class-validator` (DTOs) y consultas parametrizadas por TypeORM.

## Despliegue (sugerencias)

| Componente | Opciones                                                       |
|------------|----------------------------------------------------------------|
| Backend    | VPS (Node + PM2 + Nginx), **Railway** o **Render**             |
| Frontend   | **Vercel** o **Netlify** (fase siguiente)                      |
| MySQL      | Servicio gestionado (Railway, PlanetScale, DigitalOcean Managed, AWS RDS) |
| Variables  | Configurar las del `.env.example` en la plataforma             |

En producción: `DB_SYNCHRONIZE=false`, ejecutar `db/schema.sql` y `db/seed.sql`
de forma controlada, usar `JWT_SECRET` largo y aleatorio.

## Próximos pasos (fase 2)

- Frontend Angular 21 (standalone, Signals, Angular Material, tema claro/oscuro,
  formularios reactivos y guards de autenticación).
- OAuth Google.
- Recordatorios/notificaciones.
- Dashboard interactivo con gráficos.

---

**No subir secrets**: el `.env` y `node_modules/` están en `.gitignore`.