export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  theme: 'dark' | 'light';
  authProvider: 'local' | 'google';
}

export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  aiSuggestion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Note {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonitorStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
  byStatus: {
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface StatusLabels {
  [key: string]: string;
}
