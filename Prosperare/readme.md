# Prosperare

Prosperare es una aplicación web para organizar tareas y proyectos. Permite crear tareas, consultar su estado y prioridad, indicar una fecha límite y eliminar tareas.

## Tecnologías

- **Frontend:** Python y Reflex.
- **API:** Python, FastAPI y Uvicorn. La documentación interactiva de la API se genera con Swagger UI.
- **Base de datos:** MongoDB 8, conectada desde la API mediante PyMongo.
- **Contenedores:** Docker y Docker Compose.

## Requisitos

- Docker.
- Docker Compose (incluido en las versiones actuales de Docker como `docker compose`).

## Configuración

Desde el directorio `Prosperare`, copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

La variable `MONGODB_DATABASE` permite definir el nombre de la base de datos. Si se deja vacía, se utiliza `prosperaredb`.

## Inicio

Construye las imágenes e inicia los servicios en segundo plano:

```bash
docker compose up -d --build
```

La primera ejecución puede tardar mientras Docker construye las imágenes.

## Acceso

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Documentación interactiva de la API:** [http://localhost:8000/docs](http://localhost:8000/docs)

## Comprobación del estado

Comprueba que los contenedores están en ejecución y revisa su estado:

```bash
docker compose ps
```

## Parada

Para detener los servicios sin eliminar los contenedores ni los datos:

```bash
docker compose stop
```

Para volver a iniciarlos, ejecuta `docker compose start`.

## Persistencia de datos

MongoDB guarda sus datos en el volumen de Docker `prosperare_mongo_data`, montado en `/data/db` dentro del contenedor. El volumen permite conservar la base de datos al detener o recrear los contenedores; por tanto, `docker compose stop` no borra las tareas almacenadas.

Si ejecutas `docker compose down -v`, Docker también elimina los volúmenes del proyecto y se perderán los datos de MongoDB. No uses esa opción si quieres conservarlos.

## Solución de problemas

Consulta los registros de todos los servicios:

```bash
docker compose logs
```

Para seguir los registros en tiempo real:

```bash
docker compose logs -f
```

También puedes consultar un servicio concreto, por ejemplo:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb
```
