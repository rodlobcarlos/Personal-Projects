import { Brackets, DataSource, Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from '../entities/Task';

export interface TaskListQuery {
  status?: TaskStatus;
  priority?: TaskPriority;
  from?: string;
  to?: string;
  overdue?: boolean;
}

export class TaskRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.manager);
  }

  async listByUser(userId: number, query: TaskListQuery = {}): Promise<Task[]> {
    const qb = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.categories', 'category')
      .where('task.userId = :userId', { userId });

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }
    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }
    if (query.from) {
      qb.andWhere('task.dueDate >= :from', { from: query.from });
    }
    if (query.to) {
      qb.andWhere('task.dueDate <= :to', { to: query.to });
    }
    if (query.overdue) {
      qb.andWhere(
        new Brackets((sub) => {
          sub.where('task.status = :statusPending', { statusPending: 'pending' });
          sub.andWhere('task.dueDate IS NOT NULL');
          sub.andWhere('task.dueDate < :today', { today: new Date().toISOString().slice(0, 10) });
        })
      );
    }

    return qb.orderBy('task.dueDate', 'ASC').addOrderBy('task.priority', 'DESC').getMany();
  }

  async findOwned(userId: number, taskId: number): Promise<Task | null> {
    return this.findOne({ where: { id: taskId, userId }, relations: { categories: true } });
  }
}