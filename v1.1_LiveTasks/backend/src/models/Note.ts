import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Sin título' },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1 });

export const Note = model<INote>('Note', noteSchema);
