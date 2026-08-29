import { Request, Response } from 'express';
import { getTaskSuggestion, getDaySummary } from '../services/geminiService';
import { Task } from '../models/Task';

const getUserId = (req: Request): string => (req as any).user?.id;

export const taskSuggestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      res.status(400).json({ message: 'El ID de la tarea es obligatorio' });
      return;
    }

    const task = await Task.findOne({ _id: taskId, userId: getUserId(req) });

    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }

    const pendingTasksCount = await Task.countDocuments({
      userId: getUserId(req),
      status: { $ne: 'completed' },
    });

    const suggestion = await getTaskSuggestion({
      taskTitle: task.title,
      taskDescription: task.description,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      pendingTasksCount,
    });

    res.status(200).json({ suggestion });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar sugerencia de IA' });
  }
};

export const daySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.body;

    if (!date) {
      res.status(400).json({ message: 'La fecha es obligatoria' });
      return;
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: getUserId(req),
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const summary = await getDaySummary({
      date: new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      tasks: tasks.map((t) => ({
        title: t.title,
        description: t.description,
        status: t.status,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      })),
    });

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar resumen de día' });
  }
};
