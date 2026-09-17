# AGENTS.md --- Proyecto_rutina

## 1. Objetivo del proyecto

`Proyecto_rutina` es una aplicación de escritorio desarrollada con
Python para ayudar al usuario a organizar y seguir su rutina diaria.

El objetivo de la primera versión (V1) es crear una aplicación sencilla
pero completa que permita:

-   Crear actividades de una rutina diaria.
-   Asignar fecha y horario a cada actividad.
-   Consultar las actividades del día.
-   Marcar actividades como completadas.
-   Editar actividades.
-   Eliminar actividades.
-   Mostrar el progreso diario.
-   Guardar los datos para que no se pierdan al cerrar la aplicación.

La aplicación debe desarrollarse de forma progresiva. No se deben
introducir funcionalidades avanzadas antes de que las funcionalidades
básicas estén funcionando correctamente.

------------------------------------------------------------------------

## 2. Principios de desarrollo

-   Mantener el código sencillo y fácil de entender.
-   Priorizar código limpio y organizado.
-   Evitar añadir dependencias innecesarias.
-   Desarrollar y probar cada funcionalidad antes de pasar a la
    siguiente.
-   Separar la interfaz gráfica, la lógica de negocio y el acceso a
    datos.
-   Utilizar nombres de variables, funciones y clases descriptivos.
-   Escribir comentarios únicamente cuando aporten información útil.
-   No introducir arquitectura compleja si el proyecto todavía no la
    necesita.
-   Mantener el proyecto preparado para futuras ampliaciones.
-   Utilizar Git para registrar los avances de forma progresiva.

------------------------------------------------------------------------

## 3. Tecnologías previstas

### V1

-   Python
-   PySide6
-   SQLite
-   Git
-   GitHub
-   pytest

### Futuras versiones

Se podrán incorporar progresivamente:

-   Docker
-   GitHub Actions
-   API REST
-   Servicios en la nube
-   Azure
-   Funcionalidades inteligentes/IA

Estas tecnologías no forman parte del alcance inicial de la V1.

------------------------------------------------------------------------

# 4. Estructura inicial del proyecto

La estructura inicial debe ser sencilla:

``` text
Proyecto_rutina/
│
├── app/
│   ├── __init__.py
│   └── main.py
│
├── tests/
│
├── requirements.txt
├── .gitignore
└── README.md
```

No crear carpetas adicionales hasta que sean necesarias.

------------------------------------------------------------------------

# 5. Estructura objetivo de la V1

A medida que el proyecto crezca, la estructura podrá evolucionar hacia:

``` text
Proyecto_rutina/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── tarea.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── tareas_service.py
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   └── database.py
│   │
│   └── ui/
│       ├── __init__.py
│       ├── ventana_principal.py
│       └── ventana_tarea.py
│
├── tests/
│   ├── test_tarea.py
│   └── test_tareas_service.py
│
├── data/
│   └── rutina.db
│
├── requirements.txt
├── .gitignore
└── README.md
```

La estructura final debe mantenerse organizada, pero sin crear archivos
o capas que no tengan una responsabilidad real.

------------------------------------------------------------------------

# 6. Arquitectura básica

La aplicación debe seguir una separación sencilla entre interfaz, lógica
y datos:

``` text
┌─────────────────────────────┐
│          PySide6            │
│      Interfaz gráfica       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           Python            │
│       Lógica de negocio     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           SQLite            │
│       Persistencia datos    │
└─────────────────────────────┘
```

### `ui/`

Responsabilidad:

-   Mostrar información.
-   Recoger acciones del usuario.
-   Actualizar la interfaz.

La interfaz no debe contener toda la lógica de negocio.

### `services/`

Responsabilidad:

-   Crear tareas.
-   Obtener tareas.
-   Modificar tareas.
-   Completar tareas.
-   Eliminar tareas.
-   Calcular información relacionada con las tareas.

### `models/`

Responsabilidad:

-   Representar los datos de una tarea.

### `database/`

Responsabilidad:

-   Crear/conectar con SQLite.
-   Crear tablas.
-   Ejecutar operaciones sobre la base de datos.

### `tests/`

Responsabilidad:

-   Comprobar automáticamente que las funcionalidades funcionan
    correctamente.

------------------------------------------------------------------------

# 7. Modelo de datos

La V1 utilizará una tabla principal llamada `tareas`.

``` text
tareas
--------------------------------
id
nombre
fecha
hora_inicio
hora_fin
completada
```

### Campos

#### `id`

Identificador único de la tarea.

#### `nombre`

Nombre o descripción breve de la actividad.

Ejemplo:

``` text
Estudiar Python
```

#### `fecha`

Fecha en la que se realizará la actividad.

Ejemplo:

``` text
2026-09-17
```

#### `hora_inicio`

Hora de comienzo.

Ejemplo:

``` text
09:00
```

#### `hora_fin`

Hora de finalización.

Ejemplo:

``` text
11:00
```

#### `completada`

Indica si la actividad ha sido completada.

``` text
0 = pendiente
1 = completada
```

------------------------------------------------------------------------

# 8. Funcionalidades de la V1

## 8.1 Crear actividad

El usuario podrá crear una actividad indicando:

-   Nombre.
-   Fecha.
-   Hora de inicio.
-   Hora de finalización.

Ejemplo:

``` text
Nombre: Estudiar Python
Fecha: 17/09/2026
Inicio: 09:00
Fin: 11:00
```

Al guardar, la actividad debe almacenarse en SQLite.

------------------------------------------------------------------------

## 8.2 Mostrar actividades

La pantalla principal debe mostrar las actividades correspondientes al
día seleccionado.

Ejemplo:

``` text
07:30  ☐ Despertarse
08:00  ☑ Desayunar
09:00  ☑ Estudiar Python
11:00  ☐ Descanso
11:30  ☐ Estudiar Azure
14:00  ☐ Comer
16:00  ☐ Proyecto personal
19:00  ☐ Ejercicio
```

Las tareas deberían aparecer ordenadas cronológicamente por hora de
inicio.

------------------------------------------------------------------------

## 8.3 Completar actividad

Una tarea pendiente podrá marcarse como completada.

``` text
☐ Estudiar Python
```

debe pasar a:

``` text
☑ Estudiar Python
```

El cambio debe persistirse en SQLite.

------------------------------------------------------------------------

## 8.4 Editar actividad

El usuario podrá modificar:

-   Nombre.
-   Fecha.
-   Hora de inicio.
-   Hora de finalización.

Los cambios deben guardarse en SQLite.

------------------------------------------------------------------------

## 8.5 Eliminar actividad

El usuario podrá eliminar una actividad.

Antes de eliminarla, se recomienda solicitar confirmación para evitar
eliminaciones accidentales.

------------------------------------------------------------------------

## 8.6 Progreso diario

La aplicación calculará el porcentaje de tareas completadas.

Fórmula:

``` text
tareas completadas / tareas totales × 100
```

Ejemplo:

``` text
Tareas completadas: 6
Tareas totales: 10

Progreso: 60%
```

La interfaz podrá mostrarlo como:

``` text
Progreso: ██████░░░░ 60%
```

------------------------------------------------------------------------

# 9. Interfaz principal

La ventana principal deberá incluir como mínimo:

-   Fecha seleccionada.
-   Lista de actividades.
-   Estado de cada actividad.
-   Botón para añadir actividad.
-   Botón para editar actividad.
-   Botón para eliminar actividad.
-   Acción para completar una actividad.
-   Indicador de progreso.

Diseño conceptual:

``` text
╔════════════════════════════════════════════╗
║                 MI RUTINA                  ║
║             17/09/2026                    ║
╠════════════════════════════════════════════╣
║                                            ║
║ 07:30  ☐ Despertarse                       ║
║ 08:00  ☑ Desayunar                         ║
║ 09:00  ☑ Estudiar Python                   ║
║ 11:00  ☐ Descanso                          ║
║ 11:30  ☐ Estudiar Azure                    ║
║                                            ║
╠════════════════════════════════════════════╣
║ Progreso: ███████░░░ 60%                   ║
╠════════════════════════════════════════════╣
║ [Añadir] [Editar] [Eliminar]               ║
╚════════════════════════════════════════════╝
```

No es obligatorio reproducir exactamente este diseño. Lo importante es
mantener la funcionalidad y una interfaz clara.

------------------------------------------------------------------------

# 10. Ventana para crear/editar tareas

La ventana de creación/edición deberá contener:

``` text
┌─────────────────────────────┐
│       Nueva actividad       │
├─────────────────────────────┤
│ Nombre:                     │
│ [Estudiar Python          ] │
│                             │
│ Hora inicio:                │
│ [09:00]                     │
│                             │
│ Hora fin:                   │
│ [11:00]                     │
│                             │
│ Fecha:                      │
│ [17/09/2026]                │
│                             │
│ [Cancelar]      [Guardar]   │
└─────────────────────────────┘
```

Debe validarse que:

-   El nombre no esté vacío.
-   La fecha sea válida.
-   La hora de inicio sea válida.
-   La hora de finalización sea válida.
-   La hora de finalización no sea anterior a la hora de inicio.

------------------------------------------------------------------------

# 11. Fases de desarrollo

El proyecto debe desarrollarse en fases.

## Fase 1 --- Python básico

Antes de crear la interfaz gráfica, implementar la lógica fundamental.

Objetivos:

1.  Crear una tarea.
2.  Mostrar tareas.
3.  Completar una tarea.
4.  Eliminar una tarea.
5.  Editar una tarea.

Inicialmente se puede trabajar en consola para entender la lógica.

Flujo:

``` text
Python
  ↓
Crear tarea
  ↓
Mostrar tarea
  ↓
Completar tarea
  ↓
Editar tarea
  ↓
Eliminar tarea
```

No pasar a la siguiente fase hasta comprender y probar la lógica básica.

------------------------------------------------------------------------

# 12. Fase 2 --- SQLite

Introducir persistencia de datos.

Objetivos:

1.  Crear la base de datos.
2.  Crear la tabla `tareas`.
3.  Insertar tareas.
4.  Consultar tareas.
5.  Actualizar tareas.
6.  Eliminar tareas.
7.  Guardar el estado de completada.

La aplicación deberá seguir funcionando después de cerrarla y volverla a
abrir.

Flujo:

``` text
Aplicación
    ↓
SQLite
    ↓
Guardar datos
    ↓
Cerrar aplicación
    ↓
Volver a abrir
    ↓
Recuperar datos
```

------------------------------------------------------------------------

# 13. Fase 3 --- PySide6

Crear la interfaz gráfica.

Objetivos:

-   Crear la ventana principal.
-   Mostrar las tareas.
-   Crear formulario de tareas.
-   Conectar botones con la lógica.
-   Mostrar el progreso.
-   Actualizar la interfaz después de cada operación.

La interfaz deberá utilizar los servicios existentes en lugar de
duplicar la lógica de negocio.

------------------------------------------------------------------------

# 14. Fase 4 --- Funcionalidades completas

Integrar todas las funcionalidades:

-   Crear.
-   Leer/mostrar.
-   Actualizar.
-   Eliminar.
-   Completar.
-   Filtrar por fecha.
-   Ordenar por hora.
-   Calcular progreso.

Esta fase representa el núcleo funcional de la V1.

------------------------------------------------------------------------

# 15. Fase 5 --- Tests

Utilizar `pytest`.

Crear tests para las operaciones principales.

Ejemplos:

``` text
test_crear_tarea()
test_obtener_tareas()
test_completar_tarea()
test_editar_tarea()
test_eliminar_tarea()
```

También se deben probar casos incorrectos:

-   Nombre vacío.
-   Horas inválidas.
-   Hora final anterior a hora inicial.
-   Tarea inexistente.
-   Fecha inválida.

Los tests no deben depender de la base de datos real utilizada por la
aplicación.

------------------------------------------------------------------------

# 16. Git y GitHub

Utilizar Git durante todo el desarrollo.

Los commits deben representar cambios concretos.

Ejemplos:

``` text
Initial project structure
Add task model
Add SQLite database
Implement task creation
Implement task listing
Implement task completion
Add PySide6 main window
Add task editing
Add task deletion
Add task progress
Add tests
Update README
```

Evitar commits genéricos como:

``` text
changes
update
cosas
final
```

------------------------------------------------------------------------

# 17. `requirements.txt`

Las dependencias externas deben mantenerse en `requirements.txt`.

Inicialmente:

``` text
PySide6
pytest
```

No añadir paquetes que no sean necesarios.

Las librerías incluidas en la biblioteca estándar de Python no necesitan
aparecer en `requirements.txt`.

------------------------------------------------------------------------

# 18. `.gitignore`

Como mínimo, ignorar:

``` text
__pycache__/
*.pyc
.venv/
.pytest_cache/
```

Si la base de datos local se considera un archivo generado, se podrá
añadir:

``` text
*.db
```

No subir datos personales o información privada al repositorio.

------------------------------------------------------------------------

# 19. README.md

El README debe explicar:

## Nombre

`Proyecto_rutina`

## Descripción

Qué problema resuelve la aplicación.

## Tecnologías

-   Python
-   PySide6
-   SQLite
-   pytest

## Instalación

Cómo crear el entorno virtual e instalar dependencias.

Ejemplo conceptual:

``` text
Crear entorno virtual
↓
Activarlo
↓
Instalar requirements.txt
↓
Ejecutar aplicación
```

## Uso

Explicar cómo:

-   Crear una tarea.
-   Completarla.
-   Editarla.
-   Eliminarla.
-   Consultar el progreso.

## Estructura

Explicar brevemente las carpetas principales.

## Futuras mejoras

Documentar posibles funcionalidades de versiones posteriores.

------------------------------------------------------------------------

# 20. Funcionalidades fuera de la V1

No implementar inicialmente:

-   IA.
-   Login.
-   Sistema de usuarios.
-   API REST.
-   Aplicación móvil.
-   Sincronización en la nube.
-   Calendario avanzado.
-   Notificaciones avanzadas.
-   Docker.
-   Azure.
-   CI/CD.

Estas funcionalidades pueden formar parte de futuras versiones.

------------------------------------------------------------------------

# 21. Evolución prevista

## V2 --- Funcionalidades avanzadas

Posibles características:

-   Categorías.
-   Prioridades.
-   Estadísticas semanales.
-   Historial.
-   Rutinas repetitivas.
-   Recordatorios.
-   Mejoras de interfaz.
-   Diferentes tipos de actividad.

------------------------------------------------------------------------

## V3 --- Orientación técnica/DevOps

Posibles incorporaciones:

``` text
API REST
    ↓
Docker
    ↓
Tests automatizados
    ↓
GitHub Actions
    ↓
CI/CD
    ↓
Azure
```

El objetivo será utilizar el mismo proyecto para practicar tecnologías
relacionadas con DevOps sin convertir la V1 en un proyecto excesivamente
complejo.

------------------------------------------------------------------------

# 22. Posibles funcionalidades inteligentes futuras

Una vez que existan suficientes datos, se podrá estudiar la
incorporación de funcionalidades inteligentes.

Ejemplos:

``` text
"Esta semana has dedicado 8 horas a estudiar Python."
```

``` text
"Tienes tres actividades programadas entre las 16:00 y las 17:00."
```

``` text
"Tu duración media de estudio es de 90 minutos."
```

Estas funcionalidades no deben formar parte de la V1.

------------------------------------------------------------------------

# 23. Criterios para considerar terminada la V1

La V1 se considerará terminada cuando:

-   La aplicación se pueda ejecutar correctamente.
-   Se puedan crear tareas.
-   Se puedan consultar las tareas.
-   Se puedan editar tareas.
-   Se puedan eliminar tareas.
-   Se puedan completar tareas.
-   Las tareas se guarden en SQLite.
-   Los datos permanezcan después de cerrar la aplicación.
-   Las tareas puedan consultarse por fecha.
-   Las tareas aparezcan ordenadas por hora.
-   El progreso diario se calcule correctamente.
-   Existan tests para la lógica principal.
-   Los tests pasen correctamente.
-   El proyecto tenga un README funcional.
-   El repositorio tenga una estructura limpia.
-   No existan datos personales o archivos innecesarios en Git.

------------------------------------------------------------------------

# 24. Regla principal para agentes de desarrollo

Al trabajar en este proyecto:

1.  Revisar primero la estructura existente.
2.  No modificar archivos sin necesidad.
3.  No añadir dependencias sin justificar su utilidad.
4.  Mantener la implementación sencilla.
5.  Completar una funcionalidad antes de comenzar otra.
6.  Ejecutar los tests después de cambios relevantes.
7.  No introducir funcionalidades de V2/V3 durante la implementación de
    V1 salvo que sean necesarias para preparar la arquitectura.
8.  Explicar cualquier cambio estructural importante.
9.  Mantener la separación entre UI, lógica y persistencia.
10. Priorizar que el proyecto sea comprensible para una persona que está
    aprendiendo Python.

------------------------------------------------------------------------

# 25. Objetivo final de aprendizaje

`Proyecto_rutina` no debe ser únicamente una aplicación funcional.

Debe servir como proyecto práctico para aprender y demostrar
progresivamente:

``` text
Python
  ↓
Programación estructurada
  ↓
POO
  ↓
SQLite / SQL
  ↓
PySide6
  ↓
Testing
  ↓
Git / GitHub
  ↓
Docker
  ↓
GitHub Actions / CI-CD
  ↓
Azure
```

La prioridad inicial es **aprender y construir una V1 funcional**, y
posteriormente utilizar el mismo proyecto como base para adquirir
conocimientos de desarrollo y DevOps.
