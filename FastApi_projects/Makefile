# =============================================================================
# Comandos habituales del proyecto
# Ejecutar con:  make <objetivo>   (en Windows: mingw32-make <objetivo>)
# =============================================================================

VENV      ?= .venv
PY        := $(VENV)/Scripts/python.exe
PIP       := $(VENV)/Scripts/pip.exe
PYTEST    := $(VENV)/Scripts/pytest.exe
RUFF      := $(VENV)/Scripts/ruff.exe
ALEMBIC   := $(VENV)/Scripts/alembic.exe

.DEFAULT_GOAL := help
.PHONY: help install install-dev run dev test test-cov lint format check migrate seed docker-up docker-down

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Crea el entorno virtual e instala las dependencias
	python -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

install-dev: ## Instala tambien las dependencias de desarrollo
	$(PIP) install -r requirements-dev.txt

run: ## Arranca la API en modo produccion
	$(VENV)/Scripts/uvicorn.exe app.main:app --host 0.0.0.0 --port 8000

dev: ## Arranca la API con recarga automatica
	$(VENV)/Scripts/uvicorn.exe app.main:app --reload --host 0.0.0.0 --port 8000

test: ## Ejecuta los tests
	$(PYTEST) -q

test-cov: ## Ejecuta los tests con informe de cobertura
	$(PYTEST) --cov=app --cov-report=term-missing --cov-report=html

lint: ## Comprueba el estilo y la calidad del codigo
	$(RUFF) check .
	$(RUFF) format --check .

format: ## Formatea el codigo automaticamente
	$(RUFF) format .
	$(RUFF) check . --fix

check: lint test ## Lint + tests

migrate: ## Aplica las migraciones de Alembic
	$(ALEMBIC) upgrade head

seed: ## Carga datos de ejemplo
	$(PY) -m scripts.seed

docker-up: ## Levanta la API y PostgreSQL con Docker Compose
	docker compose up --build

docker-down: ## Detiene los contenedores
	docker compose down -v
