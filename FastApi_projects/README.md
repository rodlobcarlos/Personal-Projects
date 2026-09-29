# 🚀 API de Gestión de Proyectos

API REST desarrollada con **Python y FastAPI** para gestionar proyectos de
desarrollo y las tareas asociadas a cada proyecto.

Nace como una API CRUD sencilla y evoluciona de forma progresiva hacia una
aplicación **Full-Stack, contenerizada, automatizada y desplegada en cloud**
(Docker, GitHub Actions, JWT, Angular y Azure).

```text
Cliente
   │
   │  HTTP / JSON
   ▼
┌──────────────────────────────┐
│  FastAPI                     │
│  ├── Autenticación JWT       │
│  ├── Proyectos (CRUD)        │
│  └── Tareas                  │
└──────────────┬───────────────┘
               │  SQLAlchemy 2.0
               ▼
┌──────────────────────────────┐
│  PostgreSQL 16               │
└──────────────────────────────┘
```

---

## 📑 Índice

- [Estado del proyecto](#-estado-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Modelo de datos](#-modelo-de-datos)
- [Endpoints](#-endpoints)
- [Ejemplo de uso](#-ejemplo-de-uso)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Docker](#-docker)
- [Variables de entorno](#-variables-de-entorno)
- [Tests](#-tests)
- [Migraciones](#-migraciones)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [CI/CD](#-cicd)
- [Evolución por fases](#-evolución-por-fases)

---

## 🟢 Estado del proyecto

| Fase | Contenido | Estado |
| ---- | --------- | ------ |
| 🟢 **V1** | API básica: FastAPI, Pydantic, SQLAlchemy, PostgreSQL, CRUD | ✅ Completada |
| 🟡 **V2** | Calidad: validación, errores, paginación, filtros, búsqueda, tests | ✅ Completada |
| 🟠 **V3** | Seguridad: usuarios, login, JWT, roles y permisos | ✅ Completada |
| 🔵 **V4** | DevOps: Docker, Docker Compose, GitHub Actions, Alembic | ✅ Completada |
| 🟣 **V5** | Frontend Angular consumiendo la API | 🔜 Pendiente |
| ☁️ **V6** | Despliegue en Azure con pipeline automatizado | 🔜 Pendiente |

---

## ✨ Funcionalidades

**Proyectos**

- CRUD completo (`GET`, `POST`, `GET /{id}`, `PUT`, `PATCH`, `DELETE`).
- Estados: `planned`, `in_progress`, `paused`, `completed`, `cancelled`.
- Tecnologías y repositorio asociado.
- Fechas de inicio y entrega, con `completed_at` automático al completar.
- Progreso (`0-100`) calculado a partir de las tareas.
- Borrado en cascada de las tareas al eliminar un proyecto.

**Tareas**

- Anidadas en un proyecto: `GET/POST /projects/{id}/tasks`.
- Globales por id: `GET/PUT/PATCH/DELETE /tasks/{id}`.
- Estados: `todo`, `in_progress`, `done`, `blocked`.
- Prioridades: `low`, `medium`, `high`, `urgent`.
- Horas estimadas y fecha de vencimiento.
- Cálculo automático de `is_completed`, `completed_at` y del progreso del proyecto.
- Detección de tareas vencidas (`is_overdue`).

**Transversal**

- Paginación (`page`, `page_size`) con metadatos de navegación.
- Filtros por estado, prioridad, tecnología, propietario y vencimiento.
- Búsqueda por texto (`search`).
- Ordenación configurable (`order_by`, `order`) con lista blanca de campos.
- Autenticación JWT (access token + refresh token).
- Roles `admin` y `user` con permisos diferenciados.
- OpenAPI + Swagger UI en `/docs` y ReDoc en `/redoc`.
- Manejo centralizado de errores de validación y de base de datos.
- Health checks: `/health` y `/health/ready`.

---

## 🗄️ Modelo de datos

```text
users                          projects
┌──────────────────────┐       ┌──────────────────────────┐
│ id            PK     │───┐   │ id              PK        │
│ email         UQ     │   └──►│ owner_id        FK        │
│ full_name           │       │ name                     │
│ hashed_password      │       │ description              │
│ role                 │       │ technologies             │
│ is_active            │       │ repository_url           │
│ created_at           │       │ status                   │
│ updated_at           │       │ start_date / due_date    │
└──────────────────────┘       │ completed_at             │
                               │ progress                 │
                               │ created_at / updated_at  │
tasks                          └────────────┬─────────────┘
┌──────────────────────┐                    │
│ id            PK     │◄───────────────────┘
│ project_id    FK     │  (ON DELETE CASCADE)
│ title                │
│ description          │
│ status               │
│ priority             │
│ estimated_hours      │
│ due_date             │
│ is_completed         │
│ completed_at         │
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

---

## 🔌 Endpoints

Base de la API: `http://localhost:8000/api/v1`

### Salud

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/health` | Estado del servicio (público) |
| `GET` | `/health/ready` | Comprueba la conexión con la base de datos |

### Autenticación 🔒

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `POST` | `/auth/register` | Crear usuario |
| `POST` | `/auth/login` | Obtener tokens (JSON) |
| `POST` | `/auth/token` | Obtener tokens (formulario OAuth2) |
| `POST` | `/auth/refresh` | Renovar el access token |
| `GET` | `/auth/me` | Usuario autenticado |

### Usuarios 🔒

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/users` | Listar usuarios *(admin)* |
| `POST` | `/users` | Crear usuario *(admin)* |
| `GET` | `/users/me` | Mi perfil |
| `PATCH` | `/users/me` | Actualizar mi perfil |
| `GET` | `/users/{id}` | Consultar usuario |
| `PATCH` | `/users/{id}` | Actualizar usuario |
| `DELETE` | `/users/{id}` | Eliminar usuario *(admin)* |
| `POST` | `/users/{id}/deactivate` | Desactivar usuario *(admin)* |

### Proyectos 🔒

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/projects` | Listar con filtros y ordenación |
| `POST` | `/projects` | Crear proyecto |
| `GET` | `/projects/{id}` | Obtener proyecto |
| `PUT` | `/projects/{id}` | Actualizar proyecto |
| `PATCH` | `/projects/{id}` | Actualizar parcialmente |
| `DELETE` | `/projects/{id}` | Eliminar proyecto |
| `GET` | `/projects/{id}/stats` | Estadísticas agregadas |

**Parámetros de `GET /projects`**

| Parámetro | Tipo | Por defecto | Descripción |
| --------- | ---- | ----------- | ----------- |
| `page` | int ≥ 1 | `1` | Número de página |
| `page_size` | int 1-100 | `20` | Elementos por página |
| `status` | enum | — | Filtro por estado |
| `technology` | str | — | Filtro por tecnología |
| `search` | str | — | Búsqueda en nombre y descripción |
| `owner_id` | int | — | Filtro por propietario *(admin)* |
| `only_mine` | bool | `false` | Solo mis proyectos |
| `order_by` | str | `created_at` | Campo de ordenación (lista blanca) |
| `order` | `asc` \| `desc` | `desc` | Dirección de ordenación |

### Tareas 🔒

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/projects/{id}/tasks` | Listar tareas del proyecto |
| `POST` | `/projects/{id}/tasks` | Crear tarea en el proyecto |
| `GET` | `/tasks/{id}` | Obtener tarea |
| `PUT` | `/tasks/{id}` | Actualizar tarea |
| `PATCH` | `/tasks/{id}` | Actualizar parcialmente |
| `DELETE` | `/tasks/{id}` | Eliminar tarea |

`GET /projects/{id}/tasks` admite `page`, `page_size`, `status`, `priority`,
`is_completed`, `overdue`, `search`, `order_by` y `order`.

### Formato de las respuestas paginadas

```json
{
  "items": [ { "id": 1, "name": "Portfolio Personal", "...": "..." } ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 4,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  }
}
```

### Formato de los errores

```json
{
  "error": {
    "code": "validation_error",
    "message": "Los datos enviados no son validos",
    "context": { "errors": [ { "location": ["body", "name"], "message": "...", "type": "..." } ] }
  }
}
```

---

## 🚀 Ejemplo de uso

```bash
# 1. Registrarse
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","full_name":"Desarrollador","password":"Test1234"}'

# 2. Iniciar sesión y guardar el token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"Test1234"}' | python -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# 3. Crear un proyecto
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
        "name": "Portfolio Personal",
        "description": "Portfolio web personal",
        "technologies": ["Angular", "Java", "Docker"],
        "status": "in_progress",
        "due_date": "2026-12-31"
      }'

# 4. Añadir una tarea
curl -X POST http://localhost:8000/api/v1/projects/1/tasks \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Crear frontend","priority":"high","estimated_hours":8}'

# 5. Completar la tarea y ver el progreso del proyecto
curl -X PUT http://localhost:8000/api/v1/tasks/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"done"}'

curl "http://localhost:8000/api/v1/projects?search=portfolio&order_by=name" \
  -H "Authorization: Bearer $TOKEN"
```

> También puedes probarlo todo desde `http://localhost:8000/docs`.

---

## 🛠️ Instalación y ejecución

### Requisitos

- Python **3.11+**
- PostgreSQL **14+** (o Docker)

### Opción 1 — Con Python local

```bash
# 1. Clonar y crear el entorno virtual
python -m venv .venv

# 2. Activar el entorno
#    Windows (PowerShell):
.venv\Scripts\Activate.ps1
#    Linux / macOS:
source .venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements-dev.txt

# 4. Configurar las variables de entorno
cp .env.example .env        # Linux / macOS
copy .env.example .env      # Windows

# 5. Crear la base de datos y aplicar las migraciones
alembic upgrade head

# 6. (Opcional) Cargar datos de ejemplo
python -m scripts.seed

# 7. Arrancar la API
uvicorn app.main:app --reload
```

La documentación queda disponible en:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

### Opción 2 — Con Make (Linux / macOS / Git Bash)

```bash
make install-dev   # crea el entorno e instala dependencias
make dev           # arranca la API con recarga
make test          # ejecuta los tests
```

### Base de datos PostgreSQL local

```sql
CREATE DATABASE projects_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE projects_db TO postgres;
```

---

## 🐳 Docker

```bash
# Levantar API + PostgreSQL
docker compose up --build

# Arrancar en segundo plano
docker compose up -d

# Ver los logs
docker compose logs -f api

# Detener y borrar los volúmenes
docker compose down -v
```

Variables obligatorias: define `SECRET_KEY` en el fichero `.env`
(usa `python -c "import secrets; print(secrets.token_urlsafe(48))"`).

```text
┌─────────────────┐        ┌────────────────────┐
│  projects-api   │───────►│  projects-db       │
│  uvicorn:8000   │  SQLAlchemy (psycopg)  │  PostgreSQL 16   │
└─────────────────┘        └────────────────────┘
       │                              │
   puerto 8000                  volumen postgres_data
```

La imagen usa una construcción en dos fases y se ejecuta como usuario **no
root**, incluye un `HEALTHCHECK` y aplica las migraciones de Alembic antes de
arrancar el servidor.

---

## 🔐 Variables de entorno

| Variable | Por defecto | Descripción |
| -------- | ----------- | ----------- |
| `PROJECT_NAME` | `Projects API` | Nombre mostrado en la documentación |
| `ENVIRONMENT` | `development` | `development`, `test` o `production` |
| `DEBUG` | `true` | Nivel de detalle de los logs |
| `API_PREFIX` | `/api/v1` | Prefijo de las rutas de la API |
| `POSTGRES_USER` | `postgres` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | Contraseña de PostgreSQL |
| `POSTGRES_HOST` | `localhost` | Servidor de PostgreSQL |
| `POSTGRES_PORT` | `5432` | Puerto de PostgreSQL |
| `POSTGRES_DB` | `projects_db` | Nombre de la base de datos |
| `DATABASE_URL` | *(derivada)* | Tiene prioridad sobre las anteriores |
| `SQL_ECHO` | `false` | Muestra el SQL generado |
| `SECRET_KEY` | *(cambiar)* | Clave de firma de los JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Duración del access token |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Duración del refresh token |
| `BCRYPT_ROUNDS` | `12` | Coste del hash de contraseñas |
| `ADMIN_EMAIL` | `admin@example.com` | Administrador creado en el arranque |
| `ADMIN_PASSWORD` | `Admin123!` | Contraseña de ese administrador |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Orígenes permitidos (separados por `,`) |

> 🔒 **Nunca subas el fichero `.env` al repositorio**: está en `.gitignore`
> y solo se versiona `.env.example`.

---

## 🧪 Tests

```bash
# Suite completa
pytest -q

# Con informe de cobertura
pytest --cov=app --cov-report=term-missing --cov-report=html
```

Los tests usan un **SQLite temporal en modo WAL** (no tocan la base de datos
de desarrollo ni la de producción) y cubren:

| Fichero | Cobertura |
| ------- | --------- |
| `tests/test_health.py` | Health checks, `/docs`, `/redoc` y esquema OpenAPI |
| `tests/test_auth.py` | Registro, login, refresh, tokens expirados, roles |
| `tests/test_projects.py` | CRUD, paginación, filtros, búsqueda, orden, permisos |
| `tests/test_tasks.py` | CRUD de tareas, progreso, filtros, cascadas, stats |
| `tests/test_users.py` | Perfiles, administración y desactivación de usuarios |

```text
88 passed
```

---

## 🗂️ Migraciones

```bash
# Aplicar las migraciones
alembic upgrade head

# Crear una nueva migración tras modificar los modelos
alembic revision --autogenerate -m "descripcion del cambio"

# Ver el historial
alembic history

# Revertir
alembic downgrade -1
```

La URL de la base de datos se toma siempre de `app.core.config`, de modo que
las migraciones y la API comparten una única fuente de verdad.

---

## 📁 Estructura del proyecto

```text
api-projects/
│
├── app/
│   ├── main.py                 # Creación de la app, middlewares y routers
│   │
│   ├── core/
│   │   ├── config.py           # Configuración con pydantic-settings
│   │   ├── security.py         # Hash de contraseñas y creación de JWT
│   │   └── deps.py             # Dependencias de autenticación y permisos
│   │
│   ├── database/
│   │   ├── session.py          # Engine, SessionLocal y Base
│   │   └── init_db.py          # Creación de tablas y admin inicial
│   │
│   ├── models/                 # Modelos SQLAlchemy
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   │
│   ├── schemas/                # Esquemas Pydantic (entrada/salida)
│   │   ├── common.py           # Paginación y respuestas de error
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   │
│   ├── services/               # Lógica de negocio
│   │   ├── user_service.py
│   │   ├── project_service.py
│   │   └── task_service.py
│   │
│   └── routers/                # Endpoints
│       ├── health.py
│       ├── auth.py
│       ├── users.py
│       ├── projects.py
│       └── tasks.py
│
├── migrations/                 # Migraciones de Alembic
├── scripts/seed.py             # Datos de ejemplo
├── tests/                      # Suite de pytest
│
├── .github/workflows/
│   ├── ci.yml                  # Lint + tests + build Docker
│   └── docker-publish.yml      # Publicación en GHCR
│
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
├── pyproject.toml              # Dependencias, pytest, coverage y ruff
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── .gitignore
└── README.md
```

La API sigue una separación clara de responsabilidades:

```text
Router  →  Service  →  Model (SQLAlchemy)  →  Database
( HTTP )   ( reglas )     ( persistencia )      ( PostgreSQL )
```

---

## ⚙️ CI/CD

```text
       Push / Pull Request
               │
               ▼
        GitHub Actions (ci.yml)
               │
        ┌──────┴───────┐
        │              │
   Ruff lint     Pytest (3.11/3.12/3.13)
        │              │
        └──────┬───────┘
               │
               ▼
         Docker build
               │
               ▼
    Arranque + /health check
               │
               ▼
  Publicación en GHCR (docker-publish.yml)
               │
               ▼
        Despliegue en Azure
```

- **`.github/workflows/ci.yml`** — lint, formato, tests con cobertura en tres
  versiones de Python (con PostgreSQL como servicio) y construcción de la
  imagen Docker con verificación de arranque.
- **`.github/workflows/docker-publish.yml`** — publica la imagen en
  *GitHub Container Registry* con etiquetas `latest`, semver y SHA.

---

## 🔄 Evolución por fases

### 🟢 V1 — API básica ✅

Configuración de FastAPI, endpoints REST, Pydantic, SQLAlchemy, PostgreSQL,
operaciones CRUD y documentación automática.

### 🟡 V2 — Backend profesional ✅

Validación de datos, manejo de errores, paginación, filtros, búsqueda,
documentación interactiva y tests con Pytest.

### 🟠 V3 — Seguridad ✅

Registro de usuarios, login, JWT (access + refresh), roles y permisos por
recurso.

### 🔵 V4 — Docker y CI/CD ✅

Docker multietapa, Docker Compose, GitHub Actions, ejecución automática de
tests, construcción de imágenes y Alembic para las migraciones.

### 🟣 V5 — Aplicación Full-Stack 🔜

Frontend en Angular consumiendo esta API: gestión visual de proyectos,
tareas, usuarios, estados y tecnologías.

### ☁️ V6 — Despliegue en Azure 🔜

```text
             GitHub
                │
                ▼
         GitHub Actions
                │
                ▼
             Docker
                │
                ▼
              Azure
             /     \
            /       \
       FastAPI    PostgreSQL
```

---

## 🎓 Objetivos de aprendizaje

**Backend:** Python, FastAPI, APIs REST, Pydantic, SQLAlchemy, PostgreSQL,
Alembic, arquitectura por capas y testing.

**Desarrollo:** validación de datos, manejo de errores, paginación, filtros,
autenticación, autorización y control de concurrencia.

**DevOps:** Docker, Docker Compose, GitHub Actions, CI/CD, linting, cobertura
de tests y automatización.

**Cloud:** despliegue en Azure, gestión de secretos y variables de entorno.

**Full-Stack:** comunicación entre frontend y backend, Angular y consumo de
APIs REST.

---

## 👨‍💻 Proyecto personal

Proyecto desarrollado como parte de un portfolio personal orientado al
desarrollo **Full-Stack y DevOps**.

## 📄 Licencia

MIT
