/* Tipos que reflejan los esquemas de la API (app/schemas). */

export type ProjectStatus =
  | 'planned'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  technologies: string[];
  technology_list: string;
  repository_url: string | null;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  progress: number;
  owner_id: number;
  task_count: number;
  completed_task_count: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_hours: number | null;
  due_date: string | null;
  is_completed: boolean;
  is_overdue: boolean;
  completed_at: string | null;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  completion_percentage: number;
  estimated_hours: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
}

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface Page<T> {
  items: T[];
  pagination: Pagination;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ProjectPayload {
  name: string;
  description?: string | null;
  technologies?: string[];
  repository_url?: string | null;
  status?: ProjectStatus;
  start_date?: string | null;
  due_date?: string | null;
}

/** ProjectUpdate: todos los campos son opcionales (coincide con la API). */
export type ProjectUpdatePayload = Partial<ProjectPayload>;

export interface TaskPayload {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimated_hours?: number | null;
  due_date?: string | null;
  is_completed?: boolean;
}

export interface ProjectQuery {
  page?: number;
  page_size?: number;
  status?: ProjectStatus | null;
  technology?: string | null;
  search?: string | null;
  only_mine?: boolean;
  order_by?: string;
  order?: 'asc' | 'desc';
}

export interface TaskQuery {
  page?: number;
  page_size?: number;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  is_completed?: boolean | null;
  overdue?: boolean;
  search?: string | null;
  order_by?: string;
  order?: 'asc' | 'desc';
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: 'Planificado',
  in_progress: 'En desarrollo',
  paused: 'En pausa',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Pendiente',
  in_progress: 'En curso',
  done: 'Hecha',
  blocked: 'Bloqueada',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
};
