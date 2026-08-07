# Live&Tasks

SaaS de gestión de tareas personales con integración de IA en tiempo real (Google Gemini API).

## Stack

| Capa        | Tecnología                                              |
|-------------|---------------------------------------------------------|
| Frontend    | Angular (standalone, RxJS, Tailwind CSS)                |
| Backend     | Java 21 + Spring Boot 4.1 (Spring Security, Data JPA)   |
| Base de datos | PostgreSQL 17 (Flyway para migraciones)                |
| IA          | Google Gemini API                                       |
| Pagos       | Stripe API (webhooks + checkout)                        |

## Estructura del monorepo

```
MiApp/
├── backend-spring-boot/    # API REST (Spring Boot)
├── frontend-angular/       # SPA (Angular) — pendiente de inicializar (Fase 6)
├── docker-compose.yml      # PostgreSQL local
└── README.md
```

## Prerrequisitos

- JDK 21+ (el proyecto compila con `--release 21`)
- Docker Desktop (para PostgreSQL local vía docker-compose)
- Node.js 20+ (solo cuando se inicialice el frontend)

## Arranque rápido

1. Levantar PostgreSQL:

   ```bash
   docker compose up -d
   ```

2. Compilar y arrancar el backend:

   ```bash
   cd backend-spring-boot
   ./mvnw.cmd spring-boot:run
   ```

   La API queda disponible en `http://localhost:8080`.

## Configuración por variables de entorno

| Variable       | Default                  | Uso                                  |
|----------------|--------------------------|--------------------------------------|
| `DB_URL`       | `jdbc:postgresql://localhost:5432/miapp` | Cadena JDBC          |
| `DB_USER`      | `miapp`                  | Usuario de BD                        |
| `DB_PASSWORD`  | `miapp`                  | Contraseña de BD                     |
| `JWT_SECRET`   | *(valor de desarrollo)*  | Secreto HS256 para firmar JWT        |

## Roadmap

- [ ] Fase 0 — Infraestructura del monorepo (esta fase)
- [ ] Fase 1 — Auth JWT (registro, login, roles)
- [ ] Fase 2 — Dominio core (Task/Note CRUD, estados PENDIENTE/EN_CURSO/HECHO)
- [ ] Fase 3 — Dashboard (métricas agregadas)
- [ ] Fase 4 — Suscripciones Free/Pro con Stripe
- [ ] Fase 5 — Integración IA Gemini (sugerencias y resúmenes)
- [ ] Fase 6 — Frontend Angular base + auth
- [ ] Fase 7 — Gestor de tareas (lista + Kanban + IA)
- [ ] Fase 8 — Calendario con resumen IA
- [ ] Fase 9 — Dashboard visual
- [ ] Fase 10 — Notas
- [ ] Fase 11 — Landing page + pricing + checkout
- [ ] Fase 12 — Hardening: tests, OpenAPI, despliegue
