-- =============================================================================
-- Proyecto Rutina - Datos de prueba (seed)
-- Usuario demo:  demo@rutina.app  /  Demo1234!
-- (contraseña hasheada con bcrypt, cost 10)
-- =============================================================================

SET NAMES utf8mb4;

-- Usuario demo
INSERT INTO users (email, password_hash, name, timezone, preferences, theme) VALUES
(
  'demo@rutina.app',
  '$2b$10$dT4yMIlFMGMMTZ7qEIa/m.3aSzcJeuNlvnPgUm6PvQuGYsE1InH7i',
  'Usuario Demo',
  'America/Mexico_City',
  JSON_OBJECT('startOfWeek', 'monday', 'dailyGoal', 8),
  'system'
);

-- Second test account
INSERT INTO users (email, password_hash, name, timezone, theme) VALUES
('ana@rutina.app', '$2b$10$dT4yMIlFMGMMTZ7qEIa/m.3aSzcJeuNlvnPgUm6PvQuGYsE1InH7i', 'Ana García', 'Europe/Madrid', 'dark');

-- Hábitos del usuario demo
INSERT INTO habits (user_id, name, description, frequency, custom_days, target_per_day, icon, color, is_active) VALUES
(1, 'Lectura',        'Leer 20 páginas',            'daily',  NULL,                    1, 'book',     '#4F46E5', 1),
(1, 'Ejercicio',      'Entrenamiento de fuerza',     'weekly', NULL,                    1, 'dumbbell', '#16A34A', 1),
(1, 'Meditación',     'Meditar 10 minutos',         'daily',  NULL,                    1, 'brain',    '#9333EA', 1),
(1, 'Español',        'Practicar 30 min',           'custom', JSON_ARRAY(0,2,4),       1, 'language', '#DC2626', 1);

-- Hábitos de Ana
INSERT INTO habits (user_id, name, description, frequency, custom_days, target_per_day, icon, color, is_active) VALUES
(2, 'Correr', NULL, 'custom', JSON_ARRAY(1,3,5), 1, 'run', '#EA580C', 1);

-- Tareas del usuario demo
INSERT INTO tasks (user_id, title, description, due_date, due_time, priority, status, completed_at, sort_order) VALUES
(1, 'Preparar presentación', 'Slides para la reunión del jueves', CURDATE() + INTERVAL 2 DAY, '10:00:00', 'high',   'pending',   NULL,      0),
(1, 'Comprar despensa',      NULL,                                CURDATE(),                  '18:30:00', 'medium', 'pending',   NULL,      1),
(1, 'Revisar extracto bancario', NULL,                            CURDATE() - INTERVAL 1 DAY, NULL,       'medium', 'completed', NOW() - INTERVAL 1 DAY, 2),
(1, 'Llamar al dentista',    NULL,                                NULL,                       NULL,       'low',    'pending',   NULL,      3);

-- Tareas de Ana
INSERT INTO tasks (user_id, title, description, due_date, due_time, priority, status, completed_at, sort_order) VALUES
(2, 'Enviar informe', NULL, CURDATE() + INTERVAL 1 DAY, '09:00:00', 'high', 'pending', NULL, 0);

-- Completados del usuario demo (para rachas y estadísticas)
INSERT INTO completions (user_id, habit_id, task_id, completion_date, note) VALUES
(1, 1, NULL, CURDATE() - INTERVAL 5 DAY,          NULL),
(1, 3, NULL, CURDATE() - INTERVAL 5 DAY,          NULL),
(1, 1, NULL, CURDATE() - INTERVAL 4 DAY,          NULL),
(1, 3, NULL, CURDATE() - INTERVAL 4 DAY,          NULL),
(1, 2, NULL, CURDATE() - INTERVAL 4 DAY,          'Pecho y espalda'),
(1, 1, NULL, CURDATE() - INTERVAL 3 DAY,          NULL),
(1, 3, NULL, CURDATE() - INTERVAL 3 DAY,          NULL),
(1, 1, NULL, CURDATE() - INTERVAL 2 DAY,          NULL),
(1, 4, NULL, CURDATE() - INTERVAL 2 DAY,          NULL),
(1, 1, NULL, CURDATE() - INTERVAL 1 DAY,          NULL),
(1, 3, NULL, CURDATE() - INTERVAL 1 DAY,          NULL),
(1, NULL, 3, CURDATE() - INTERVAL 1 DAY,          'Listo');

-- Bloques de tiempo del usuario demo
INSERT INTO time_blocks (user_id, task_id, habit_id, title, block_date, start_time, end_time, color) VALUES
(1, NULL, 1, 'Lectura',       CURDATE(),                  '07:00:00', '08:00:00', '#4F46E5'),
(1, NULL, 3, 'Meditación',    CURDATE(),                  '08:00:00', '08:15:00', '#9333EA'),
(1, 1,   NULL, 'Preparar presentación', CURDATE() + INTERVAL 2 DAY, '10:00:00', '12:00:00', '#DC2626'),
(1, 2,   NULL, 'Comprar despensa',      CURDATE(),                  '18:30:00', '19:30:00', '#16A34A');

-- Categorías del usuario demo
INSERT INTO categories (user_id, name, color, icon) VALUES
(1, 'Salud',    '#16A34A', 'heart'),
(1, 'Trabajo',  '#4F46E5', 'briefcase'),
(1, 'Personal', '#9333EA', 'user');

-- Relaciones categoría <-> tarea / hábito
INSERT INTO task_categories (task_id, category_id) VALUES
(1, 2),  -- Preparar presentación -> Trabajo
(2, 3),  -- Comprar despensa      -> Personal
(4, 3);  -- Llamar al dentista    -> Personal

INSERT INTO habit_categories (habit_id, category_id) VALUES
(1, 1),  -- Lectura    -> Salud
(2, 1),  -- Ejercicio  -> Salud
(3, 1);  -- Meditación -> Salud