# 🧠 LiveTasks — Gestor de Tareas Personales con IA

Aplicación web de gestión de tareas personales potenciada con Inteligencia Artificial. Permite organizar tareas, visualizar calendarios, monitorear productividad, tomar notas y recibir recomendaciones personalizadas de la IA.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Angular 17+ (standalone components, signals), Tailwind CSS |
| **3D** | Three.js + Angular Three (`angular-three/dom`) + Drei |
| **Animaciones** | GSAP + ScrollTrigger + SplitText (100% gratuitos desde 2025) |
| **Backend** | Node.js + Express |
| **Base de datos** | MongoDB (Mongoose) |
| **Autenticación** | JWT (15min acceso + 7d refresh) + Google OAuth 2.0 |
| **IA** | Google Gemini API |
| **Repo** | Monorepo (frontend + backend en una carpeta) |
| **Responsive** | Móvil + tablet + desktop |

---

## 🎨 Paleta de Colores

La app soporta dos modos (oscuro y claro) usando CSS variables.

### Dark Mode
| Color | Hex | Uso |
|-------|-----|-----|
| Verde oscuro | `#202D21` | Fondo principal |
| Verde medio | `#4A6048` | Sidebar, cards |
| Verde acento | `#6F856E` | Botones, links |
| Verde claro | `#98BA98` | Texto secundario |
| Verde profundo | `#414D40` | Bordes, inputs |

### Light Mode
| Color | Hex | Uso |
|-------|-----|-----|
| Beige | `#D9C7B2` | Fondo principal |
| Marrón suave | `#A08069` | Sidebar, cards |
| Marrón medio | `#664E37` | Acentos |
| Marrón oscuro | `#403022` | Texto principal |
| Marrón claro | `#967F67` | Bordes, inputs |

---

## 📐 Arquitectura del Proyecto

```
v1.1_LiveTasks/
├── 📁 frontend/                  # Angular 17+ app
│   └── src/
│       ├── app/
│       │   ├── core/
│       │   │   ├── services/         # Auth, tasks, notes, AI
│       │   │   ├── guards/           # Auth guard
│       │   │   ├── interceptors/     # Token interceptor
│       │   │   └── animations/       # GSAP service central + helpers
│       │   ├── features/
│       │   │   ├── landing/          # Hero 3D, features, updates, footer
│       │   │   ├── auth/             # Login + Register
│       │   │   └── app-shell/        # Dashboard layout
│       │   │       ├── tasks/        # CRUD tareas + AI suggestions
│       │   │       ├── calendar/     # Calendario + resumen IA
│       │   │       ├── monitor/      # Estadísticas
│       │   │       └── notes/        # Bloc de notas
│       │   ├── shared/               # Components compartidos
│       │   └── layouts/              # Landing layout, App layout
│       └── styles/
│           └── themes.css            # Dark/Light CSS variables
│
├── 📁 backend/                   # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/                # DB, JWT, Gemini, Google OAuth
│   │   ├── controllers/           # Lógica de cada ruta
│   │   ├── middleware/            # Auth, validation, errors
│   │   ├── models/                # User, Task, Note (Mongoose)
│   │   ├── routes/                # API endpoints
│   │   └── services/              # Gemini AI service
│   ├── .env
│   └── package.json
│
├── 📁 shared/                     # Tipos TypeScript compartidos
├── package.json                   # Root scripts (dev, build)
└── README.md
```

---

## 🗄️ Modelos de Base de Datos (MongoDB)

**User**
```javascript
{
  _id, name, email, password (hash),
  avatar, authProvider: 'local' | 'google',
  googleId, theme: 'dark' | 'light',
  createdAt, updatedAt
}
```

**Task**
```javascript
{
  _id, userId (ref: User),
  title, description,
  status: 'pending' | 'in_progress' | 'completed',
  dueDate,
  aiSuggestion: String,
  createdAt, updatedAt
}
```

**Note**
```javascript
{
  _id, userId (ref: User),
  title, content,
  createdAt, updatedAt
}
```

---

## 🔌 Endpoints API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro con email/password |
| POST | `/api/auth/login` | Login con credenciales |
| POST | `/api/auth/google` | Login/registro con Google OAuth |
| GET | `/api/auth/me` | Obtener usuario actual |
| PUT | `/api/auth/profile` | Actualizar perfil |
| GET | `/api/tasks` | Listar tareas del usuario |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |
| POST | `/api/ai/task-suggestion` | Obtener sugerencia IA para tarea |
| POST | `/api/ai/day-summary` | Resumen IA del día (calendario) |
| GET | `/api/notes` | Listar notas |
| POST | `/api/notes` | Crear nota |
| PUT | `/api/notes/:id` | Actualizar nota |
| DELETE | `/api/notes/:id` | Eliminar nota |
| GET | `/api/monitor/stats` | Estadísticas de tareas |

---

## 🤖 Integración Google Gemini

**Sugerencia de tarea**
```
Prompt: "Eres un asistente de productividad. El usuario tiene {n} tareas pendientes
con fecha límite próxima. Dale consejos concretos para organizar su día priorizando
por urgencia e importancia. Tarea actual: {título} - {descripción} - Vence: {fecha}"
```

**Resumen del día (calendario)**
```
Prompt: "Genera un resumen personalizado del día {fecha} para el usuario.
Tiene {n} tareas programadas: {lista de tareas}.
Incluye motivación y consejos de productividad."
```

---

## 🎬 Animaciones 3D (Landing)

La landing usa **Three.js + Angular Three + GSAP** para efectos 3D profesionales:

1. **Esfera/cubo metálico rotando** — Loop 360° continuo con GSAP
2. **Campo de partículas flotantes** — 500-1000 partículas verdes en 3D
3. **Mouse parallax** — La cámara sigue el cursor (solo desktop)
4. **Camera travel con ScrollTrigger** — Sensación de profundidad al hacer scroll
5. **Tilt 3D cards** — Las cards de features rotan siguiendo el cursor (perspectiva 900px)
6. **Fallback estático** — Si `prefers-reduced-motion` o no hay WebGL

### GSAP Service Central
```typescript
// core/animations/gsap.service.ts
export class GsapService {
  staggerCards(selector, container)  // Entrada escalonada de cards
  openModal(backdrop, content)       // Modal con back effets
  countUp(element, target)           // Conteo animado de stats
  reducedMotion()                    // Detecta prefers-reduced-motion
}
```

### Patrón Angular + GSAP
```typescript
ngAfterViewInit() {
  this.context = gsap.context(() => {
    // Animaciones aquí
  });
}

ngOnDestroy() {
  this.context.revert(); // Limpieza de memoria
}
```

---

## ✨ Animaciones GSAP 2D (Dashboard)

| Elemento | Efecto |
|----------|--------|
| Sidebar mobile | Slide in/out desde la izquierda |
| Task cards | Stagger entrance + hover scale |
| Modales | Backdrop fade + content scale |
| Stats numbers | Count-up on load |
| Notifications | Slide desde top-right |
| Calendar cells | Pop-in al cambiar de mes |

---

## 📅 Cronograma de Implementación

| # | Fase | Descripción | Tiempo |
|---|------|-------------|--------|
| 1 | **Setup** | Monorepo Angular + Express + MongoDB + deps | 3h |
| 2 | **Auth** | Register, Login, Google OAuth, JWT, Guards | 4h |
| 3 | **GSAP Service** | Servicio central + helpers | 2h |
| 4 | **Hero 3D** | Angular Three: esfera + partículas + parallax | 6h |
| 5 | **Features (tilt)** | Tilt 3D cards + ScrollTrigger | 4h |
| 6 | **Updates + Footer** | Icons 3D + parallax + footer | 3h |
| 7 | **Dashboard Layout** | Sidebar, header, routing, theme switch | 3h |
| 8 | **Tasks** | CRUD + AI suggestions | 5h |
| 9 | **Calendar** | Grid + resumen IA diario | 3.5h |
| 10 | **Monitor** | Stats + charts | 2.5h |
| 11 | **Notes** | CRUD + grid masonry | 2.5h |
| 12 | **Performance** | WebGL cleanup, mobile, reduced-motion | 3h |
| 13 | **Testing** | Pruebas + bug fixes | 2h |
| | **Total** | | **~43h** |

---

## ⚡ Rendimiento y Consideraciones

1. **Lazy loading** de Three.js — solo cuando el canvas 3D es visible
2. **DPR cap** en móvil — `Math.min(devicePixelRatio, 2)`
3. **Respetar `prefers-reduced-motion`** — animaciones se reducen o desactivan
4. **Siempre usar `gsap.context()`** + `revert()` en `ngOnDestroy` para evitar memory leaks
5. **Animar solo `transform` y `opacity`** — máximo rendimiento (60fps)
6. **Dispose de GPU** — `renderer.dispose()`, `geometry.dispose()`, `material.dispose()`
7. **WebGL fallback** — imagen estática si el navegador no lo soporta

---

## 📦 Dependencias Principales

### Frontend
```bash
npm install gsap three
npm install angular-three @angular-three/core @angular-three/soba
npm install tailwindcss @tailwindcss/postcss
```

### Backend
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install passport passport-google-oauth20 @google/generative-ai
```

---

## 🔧 Variables de Entorno (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/livetasks
JWT_SECRET=tu_secreto_super_seguro
JWT_REFRESH_SECRET=tu_secreto_refresh
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4200/auth/google/callback
GEMINI_API_KEY=tu_gemini_api_key
```

---

## 🚀 Cómo Ejecutar Localmente

```bash
# 1. Instalar dependencias
npm install
cd frontend && npm install
cd ../backend && npm install

# 2. Configurar backend/.env (ver arriba)

# 3. Ejecutar backend (MongoDB debe estar corriendo)
cd backend && npm run dev

# 4. Ejecutar frontend
cd frontend && npm start

# App en http://localhost:4200
# API en http://localhost:5000
```

---

## 🧭 Funcionalidades

### Landing Page
- Hero 3D interactivo con animaciones GSAP
- Características de la app (tilt 3D cards)
- Sección "Próximamente" (roadmap de updates)
- Footer profesional

### Dashboard (App interna)
- **Tareas**: CRUD completo, estados (Pendiente/En curso/Hecha), fechas, sugerencias IA
- **Calendario**: Selector de día con resumen IA personalizado
- **Monitor**: Total de tareas, % completadas, conteo por estado
- **Notas**: Bloc de notas libre, crear/editar/eliminar

---

## 📝 Licencia

Proyecto personal.
