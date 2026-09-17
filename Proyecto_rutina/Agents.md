# Prompt para generar una app profesional de Rutina Diaria (Angular + Node.js + MySQL)

```
Quiero que actúes como un arquitecto de software full-stack senior y me ayudes a
construir una aplicación profesional de gestión de rutina diaria (hábitos, tareas
y horarios) usando el siguiente stack:

- Frontend: Angular (última versión estable), con TypeScript estricto
- Backend: Node.js con Express (o NestJS si lo consideras mejor para escalabilidad)
- Base de datos: MySQL
- Autenticación: JWT con refresh tokens
- Arquitectura: API REST, separación clara frontend/backend

## 1. Objetivo de la app
Una aplicación donde el usuario pueda planificar, seguir y analizar su rutina
diaria: hábitos recurrentes, tareas puntuales, bloques de tiempo (time blocking)
y recordatorios, con estadísticas de cumplimiento.

## 2. Funcionalidades principales
- Registro e inicio de sesión de usuarios (email/contraseña + opción OAuth Google)
- CRUD de hábitos (frecuencia: diaria, semanal, días específicos)
- CRUD de tareas puntuales con fecha/hora y prioridad
- Calendario/vista diaria con bloques de tiempo asignados a cada actividad
- Marcar hábitos/tareas como completados y llevar un historial (streaks)
- Notificaciones o recordatorios (al menos a nivel de backend, preparado para
  integrarse con push notifications o email)
- Dashboard con estadísticas: porcentaje de cumplimiento, rachas, gráficos por
  semana/mes
- Perfil de usuario con configuración de zona horaria y preferencias
- Modo claro/oscuro en el frontend

## 3. Requisitos técnicos de Backend (Node.js)
- Estructura en capas: rutas -> controladores -> servicios -> repositorios/modelos
- ORM: Sequelize o TypeORM para MySQL (indica cuál recomiendas y por qué)
- Validación de datos de entrada (Joi o class-validator)
- Manejo centralizado de errores y logging (Winston o similar)
- Documentación de la API con Swagger/OpenAPI
- Variables de entorno con dotenv (.env.example incluido)
- Tests unitarios básicos (Jest) para servicios críticos

## 4. Requisitos técnicos de Frontend (Angular)
- Arquitectura modular (feature modules o standalone components)
- Gestión de estado con Signals o NgRx (justifica la elección)
- Servicios para consumo de la API con interceptores HTTP (auth, manejo de errores)
- Formularios reactivos con validaciones
- Rutas protegidas con guards según autenticación
- Diseño responsive (mobile-first) usando Angular Material o Tailwind CSS
- Componentes reutilizables (inputs, modales, tarjetas de hábito/tarea)

## 5. Base de datos (MySQL)
- Diseña el esquema relacional con al menos estas entidades: usuarios, hábitos,
  tareas, registros_completado (log diario), categorías/etiquetas
- Define claves primarias, foráneas, índices necesarios y relaciones
  (1:N, N:M donde aplique, por ejemplo tareas-etiquetas)
- Incluye el script SQL de creación de tablas y datos de prueba (seed)

## 6. Seguridad
- Hash de contraseñas con bcrypt
- Protección contra inyección SQL (uso de queries parametrizadas/ORM)
- CORS configurado correctamente
- Rate limiting básico en endpoints sensibles (login, registro)

## 7. Entregables esperados
1. Estructura de carpetas completa para frontend y backend
2. Script SQL del esquema de base de datos
3. Endpoints de la API documentados (con ejemplos de request/response)
4. Componentes principales del frontend con su lógica
5. Instrucciones de instalación y ejecución local (README)
6. Sugerencias de despliegue (por ejemplo: backend en un VPS/Render/Railway,
   frontend en Vercel/Netlify, MySQL en un servicio gestionado)

## 8. Estilo de trabajo
- Ve construyendo la aplicación por partes: primero la base de datos y el
  backend (autenticación y CRUD de hábitos/tareas), luego el frontend
  conectado a esos endpoints, y al final el dashboard de estadísticas
- Explica brevemente las decisiones técnicas importantes que tomes
- Si algo no está especificado (ej. nombre exacto de campos), propón una
  opción razonable y sigue adelante, en lugar de detenerte a preguntar
```

---

### Cómo usar este prompt
- Puedes copiarlo tal cual en una nueva conversación con Claude (u otra IA) para que empiece a construir la app paso a paso.
- Si quieres una primera fase más acotada (por ejemplo, solo backend + base de datos), dímelo y te preparo una versión reducida centrada solo en esa parte.
- También puedo empezar a construir la app ahora mismo siguiendo este prompt, si quieres que avancemos directamente con el código.
