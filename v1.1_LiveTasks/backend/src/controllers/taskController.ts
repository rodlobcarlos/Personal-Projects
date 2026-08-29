import { Request, Response } from 'express';
import { Task, TaskStatus } from '../models/Task';

interface TaskBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string | Date | null;
  aiSuggestion?: string;
}

const getUserId = (req: Request): string => (req as any).user?.id;

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: getUserId(req) }).sort({
      dueDate: 1,
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status, dueDate } = req.body as TaskBody;

    if (!title) {
      res.status(400).json({ message: 'El título es obligatorio' });
      return;
    }

    const due = dueDate ? new Date(dueDate) : null;

    const task = await Task.create({
      userId: getUserId(req),
      title,
      description: description || '',
      status: status || 'pending',
      dueDate: due,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, aiSuggestion } = req.body as TaskBody;

    const update: Record<string, unknown> = {};

    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (status !== undefined) update.status = status;
    if (dueDate !== undefined) update.dueDate = dueDate === null ? null : new Date(dueDate);
    if (aiSuggestion !== undefined) update.aiSuggestion = aiSuggestion;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: getUserId(req) },
      update,
      { new: true }
    );

    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: getUserId(req) });

    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};
