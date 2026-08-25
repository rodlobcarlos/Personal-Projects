export interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotePayload {
  title?: string;
  content: string;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
}
