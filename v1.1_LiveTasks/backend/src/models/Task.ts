import { Schema, model, Document, Types } from 'mongoose';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  aiSuggestion?: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    dueDate: { type: Date, default: null },
    aiSuggestion: { type: String, default: '' },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1 });

export const Task = model<ITask>('Task', taskSchema);
