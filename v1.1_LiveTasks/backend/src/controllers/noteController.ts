import { Request, Response } from 'express';
import { Note } from '../models/Note';

interface NoteBody {
  title?: string;
  content?: string;
}

const getUserId = (req: Request): string => (req as any).user?.id;

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ userId: getUserId(req) }).sort({
      updatedAt: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notas' });
  }
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body as NoteBody;

    const note = await Note.create({
      userId: getUserId(req),
      title: title || 'Sin título',
      content: content || '',
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear nota' });
  }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body as NoteBody;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: getUserId(req) },
      { ...(title !== undefined && { title }), ...(content !== undefined && { content }) },
      { new: true }
    );

    if (!note) {
      res.status(404).json({ message: 'Nota no encontrada' });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar nota' });
  }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, userId: getUserId(req) });

    if (!note) {
      res.status(404).json({ message: 'Nota no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar nota' });
  }
};
