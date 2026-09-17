-- =============================================================================
-- Proyecto Rutina - Esquema de base de datos (MySQL 8+)
-- Convenciones:
--   * Nombres de tablas y columnas en snake_case.
--   * Todas las tablas usan InnoDB + utf8mb4.
--   * `custom_days` usa días ISO: 0=Lunes ... 6=Domingo.
-- Ejecución:  mysql -u root -p < db/schema.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS habit_categories;
DROP TABLE IF EXISTS task_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS time_blocks;
DROP TABLE IF EXISTS completions;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schema_migrations;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- USUARIOS
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)     NOT NULL,
  password_hash VARCHAR(255)     NOT NULL,
  name          VARCHAR(120)     NOT NULL,
  google_id     VARCHAR(191)     NULL,
  timezone      VARCHAR(64)      NOT NULL DEFAULT 'UTC',
  preferences   JSON             NULL,
  theme         ENUM('light','dark','system') NOT NULL DEFAULT 'system',
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_google_id (google_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- REFRESH TOKENS (JWT refresh con rotación)
-- El token crudo se devuelve una sola vez; aquí solo se guarda su SHA-256.
-- -----------------------------------------------------------------------------
CREATE TABLE refresh_tokens (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  token_hash VARCHAR(64)     NOT NULL,
  expires_at DATETIME     NOT NULL,
  revoked_at DATETIME     NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_tokens_hash (token_hash),
  KEY idx_refresh_tokens_user (user_id),
  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- HÁBITOS (frecuencia: diaria, semanal o días específicos)
-- -----------------------------------------------------------------------------
CREATE TABLE habits (
  id             INT UNSIGNED            NOT NULL AUTO_INCREMENT,
  user_id        INT UNSIGNED            NOT NULL,
  name           VARCHAR(120)            NOT NULL,
  description    VARCHAR(500)            NULL,
  frequency      ENUM('daily','weekly','custom') NOT NULL DEFAULT 'daily',
  custom_days    JSON                    NULL,  -- ej. [0,2,4] (L,M,J)
  target_per_day SMALLINT UNSIGNED       NOT NULL DEFAULT 1,
  icon           VARCHAR(64)             NULL,
  color          VARCHAR(16)             NULL,
  is_active      TINYINT(1)              NOT NULL DEFAULT 1,
  created_at     DATETIME                NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_habits_user (user_id),
  CONSTRAINT fk_habits_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TAREAS PUNTUALES
-- -----------------------------------------------------------------------------
CREATE TABLE tasks (
  id           INT UNSIGNED            NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED            NOT NULL,
  title        VARCHAR(200)            NOT NULL,
  description  VARCHAR(1000)           NULL,
  due_date     DATE                    NULL,
  due_time     TIME                    NULL,
  priority     ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  status       ENUM('pending','completed') NOT NULL DEFAULT 'pending',
  completed_at DATETIME                NULL,
  sort_order   INT                     NOT NULL DEFAULT 0,
  created_at   DATETIME                NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_user (user_id),
  KEY idx_tasks_due_date (due_date),
  KEY idx_tasks_status (status),
  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- REGISTROS DE COMPLETADO (log diario usado para rachas y estadísticas)
-- Un registro referencia un hábito o una tarea (nunca ambos a la vez).
-- -----------------------------------------------------------------------------
CREATE TABLE completions (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED NOT NULL,
  habit_id        INT UNSIGNED NULL,
  task_id         INT UNSIGNED NULL,
  completion_date DATE         NOT NULL,
  note            VARCHAR(500) NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_completions_scope (user_id, habit_id, task_id, completion_date),
  KEY idx_completions_user (user_id),
  KEY idx_completions_date (completion_date),
  KEY idx_completions_chk (habit_id, task_id),
  CONSTRAINT fk_completions_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_completions_habit
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
  CONSTRAINT fk_completions_task
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
  CONSTRAINT chk_completions_one_target
    CHECK ((habit_id IS NOT NULL AND task_id IS NULL) OR (habit_id IS NULL AND task_id IS NOT NULL))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- BLOQUES DE TIEMPO (time blocking) en la vista diaria
-- -----------------------------------------------------------------------------
CREATE TABLE time_blocks (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  task_id    INT UNSIGNED NULL,
  habit_id   INT UNSIGNED NULL,
  title      VARCHAR(200) NOT NULL,
  block_date DATE         NOT NULL,
  start_time TIME         NOT NULL,
  end_time   TIME         NOT NULL,
  color      VARCHAR(16)  NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tb_user_date (user_id, block_date),
  CONSTRAINT fk_tb_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_tb_task
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE SET NULL,
  CONSTRAINT fk_tb_habit
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE SET NULL,
  CONSTRAINT chk_tb_time_range CHECK (start_time < end_time)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- CATEGORÍAS / ETIQUETAS
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  name       VARCHAR(80)  NOT NULL,
  color      VARCHAR(16)  NULL,
  icon       VARCHAR(64)  NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_user_name (user_id, name),
  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- RELACIÓN N:M TAREAS <-> CATEGORÍAS
-- -----------------------------------------------------------------------------
CREATE TABLE task_categories (
  task_id     INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (task_id, category_id),
  CONSTRAINT fk_tc_task
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
  CONSTRAINT fk_tc_category
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- RELACIÓN N:M HÁBITOS <-> CATEGORÍAS
-- -----------------------------------------------------------------------------
CREATE TABLE habit_categories (
  habit_id    INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (habit_id, category_id),
  CONSTRAINT fk_hc_habit
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
  CONSTRAINT fk_hc_category
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;