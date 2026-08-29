import { Request, Response } from 'express';
import { Task } from '../models/Task';

const getUserId = (req: Request): string => (req as any).user?.id;

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);

    const tasks = await Task.find({ userId });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const tasksByStatus = {
      pending,
      in_progress: inProgress,
      completed,
    };

    res.status(200).json({
      total,
      completed,
      inProgress,
      pending,
      completionRate,
      byStatus: tasksByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};
