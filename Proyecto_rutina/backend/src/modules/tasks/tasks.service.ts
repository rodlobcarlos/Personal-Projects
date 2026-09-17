import { In } from 'typeorm';
import { AppDataSource } from '../../config/orm';
import { Task } from '../../entities/Task';
import { Category } from '../../entities/Category';
import { TaskRepository } from '../../repositories/TaskRepository';
import { CompletionRepository } from '../../repositories/CompletionRepository';
import { AppError } from '../../core/http-error';
import { normalizeDate, normalizeTime } from '../../core/date';
import { CreateTaskDto, TaskListQueryDto, UpdateTaskDto } from './tasks.dto';

export class TaskService {
  private readonly taskRepository: TaskRepository;
  private readonly completionRepository: CompletionRepository;
  private readonly categoryRepository = AppDataSource.getRepository(Category);

  constructor() {
    this.taskRepository = new TaskRepository(AppDataSource);
    this.completionRepository = new CompletionRepository(AppDataSource);
  }

  async list(userId: number, query: TaskListQueryDto): Promise<Task[]> {
    return this.taskRepository.listByUser(userId, {
      status: query.status,
      priority: query.priority,
      from: query.from,
      to: query.to,
      overdue: query.overdue === true
    });
  }

  async getById(userId: number, taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOwned(userId, taskId);
    if (!task) {
      throw new AppError(404, 'Tarea no encontrada');
    }
    return task;
  }

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      userId,
      title: dto.title,
      description: dto.description ?? null,
      dueDate: dto.dueDate ?? null,
      dueTime: dto.dueTime ? normalizeTime(dto.dueTime) : null,
      priority: dto.priority ?? 'medium',
      status: 'pending',
      completedAt: null,
      sortOrder: dto.sortOrder ?? 0
    });
    task.categories = await this.resolveCategories(userId, dto.categoryIds ?? []);
    return this.taskRepository.save(task);
  }

  async update(userId: number, taskId: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOwned(userId, taskId);
    if (!task) {
      throw new AppError(404, 'Tarea no encontrada');
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.dueDate !== undefined) task.dueDate = dto.dueDate;
    if (dto.dueTime !== undefined) task.dueTime = dto.dueTime ? normalizeTime(dto.dueTime) : null;
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.sortOrder !== undefined) task.sortOrder = dto.sortOrder;
    if (dto.status !== undefined) {
      task.status = dto.status;
      task.completedAt = dto.status === 'completed' ? new Date() : null;
    }
    if (dto.categoryIds !== undefined) {
      task.categories = await this.resolveCategories(userId, dto.categoryIds ?? []);
    }

    return this.taskRepository.save(task);
  }

  async remove(userId: number, taskId: number): Promise<void> {
    const task = await this.taskRepository.findOwned(userId, taskId);
    if (!task) {
      throw new AppError(404, 'Tarea no encontrada');
    }
    await this.taskRepository.remove(task);
  }

  async complete(userId: number, taskId: number, completionDate: string | undefined, timezone: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new AppError(404, 'Tarea no encontrada');
    }
    const date = normalizeDate(completionDate, timezone);

    const existing = await this.completionRepository.findOne({
      where: { userId, taskId, completionDate: date }
    });
    if (!existing) {
      await this.completionRepository.save(
        this.completionRepository.create({ userId, taskId, completionDate: date })
      );
    }

    task.status = 'completed';
    task.completedAt = new Date();
    return this.taskRepository.save(task);
  }

  async uncomplete(userId: number, taskId: number, completionDate: string | undefined, timezone: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new AppError(404, 'Tarea no encontrada');
    }
    const date = normalizeDate(completionDate, timezone);
    const record = await this.completionRepository.findOne({ where: { userId, taskId, completionDate: date } });
    if (record) {
      await this.completionRepository.remove(record);
    }
    task.status = 'pending';
    task.completedAt = null;
    return this.taskRepository.save(task);
  }

  private async resolveCategories(userId: number, categoryIds: Array<{ categoryId: number }>): Promise<Category[]> {
    if (categoryIds.length === 0) return [];
    const ids = categoryIds.map((link) => link.categoryId);
    const categories = await this.categoryRepository.find({ where: { id: In(ids), userId } });
    if (categories.length !== ids.length) {
      throw new AppError(404, 'Una o más categorías no existen');
    }
    return categories;
  }
}