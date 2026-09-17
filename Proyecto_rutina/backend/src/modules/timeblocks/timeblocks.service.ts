import { AppDataSource } from '../../config/orm';
import { TimeBlock } from '../../entities/TimeBlock';
import { Habit } from '../../entities/Habit';
import { Task } from '../../entities/Task';
import { conflict, notFound } from '../../core/http-error';
import { normalizeTime } from '../../core/date';
import { CreateTimeBlockDto, UpdateTimeBlockDto } from './timeblocks.dto';

export class TimeBlockService {
  private readonly repository = AppDataSource.getRepository(TimeBlock);

  async list(userId: number, from?: string, to?: string): Promise<TimeBlock[]> {
    const qb = this.repository.createQueryBuilder('tb')
      .leftJoinAndSelect('tb.task', 'task')
      .leftJoinAndSelect('tb.habit', 'habit')
      .where('tb.userId = :userId', { userId })
      .orderBy('tb.blockDate', 'ASC')
      .addOrderBy('tb.startTime', 'ASC');

    if (from) qb.andWhere('tb.blockDate >= :from', { from });
    if (to) qb.andWhere('tb.blockDate <= :to', { to });
    return qb.getMany();
  }

  async getById(userId: number, tbId: number): Promise<TimeBlock> {
    const tb = await this.repository.findOne({ where: { id: tbId, userId } });
    if (!tb) {
      throw notFound('Bloque de tiempo no encontrado');
    }
    return tb;
  }

  async create(userId: number, dto: CreateTimeBlockDto): Promise<TimeBlock> {
    const start = normalizeTime(dto.startTime);
    const end = normalizeTime(dto.endTime);
    if (start >= end) {
      throw conflict('startTime debe ser anterior a endTime');
    }
    await this.ensureReferences(userId, dto.taskId, dto.habitId);
    await this.assertNoOverlap(userId, dto.blockDate, start, end);

    return this.repository.save(
      this.repository.create({
        userId,
        title: dto.title,
        blockDate: dto.blockDate,
        startTime: start,
        endTime: end,
        taskId: dto.taskId ?? null,
        habitId: dto.habitId ?? null,
        color: dto.color ?? null
      })
    );
  }

  async update(userId: number, tbId: number, dto: UpdateTimeBlockDto): Promise<TimeBlock> {
    const tb = await this.getById(userId, tbId);
    const start = dto.startTime ? normalizeTime(dto.startTime) : tb.startTime;
    const end = dto.endTime ? normalizeTime(dto.endTime) : tb.endTime;
    const date = dto.blockDate ?? tb.blockDate;
    if (start >= end) {
      throw conflict('startTime debe ser anterior a endTime');
    }

    let taskId = tb.taskId;
    let habitId = tb.habitId;
    if (dto.taskId !== undefined || dto.habitId !== undefined) {
      taskId = dto.taskId ?? null;
      habitId = dto.habitId ?? null;
      await this.ensureReferences(userId, taskId, habitId);
    }

    await this.assertNoOverlap(userId, date, start, end, tbId);

    Object.assign(tb, {
      title: dto.title ?? tb.title,
      blockDate: date,
      startTime: start,
      endTime: end,
      taskId,
      habitId,
      color: dto.color ?? tb.color
    });
    return this.repository.save(tb);
  }

  async remove(userId: number, tbId: number): Promise<void> {
    const tb = await this.getById(userId, tbId);
    await this.repository.remove(tb);
  }

  private async ensureReferences(userId: number, taskId?: number | null, habitId?: number | null): Promise<void> {
    if (taskId !== undefined && taskId !== null) {
      const task = await AppDataSource.getRepository(Task).findOne({ where: { id: taskId, userId } });
      if (!task) throw notFound('Tarea referenciada no encontrada');
    }
    if (habitId !== undefined && habitId !== null) {
      const habit = await AppDataSource.getRepository(Habit).findOne({ where: { id: habitId, userId } });
      if (!habit) throw notFound('Hábito referenciado no encontrado');
    }
  }

  private async assertNoOverlap(
    userId: number,
    date: string,
    start: string,
    end: string,
    excludeId?: number
  ): Promise<void> {
    const qb = this.repository
      .createQueryBuilder('tb')
      .where('tb.userId = :userId', { userId })
      .andWhere('tb.blockDate = :date', { date })
      .andWhere('tb.startTime < :end', { end })
      .andWhere('tb.endTime > :start', { start });
    if (excludeId !== undefined) {
      qb.andWhere('tb.id != :excludeId', { excludeId });
    }
    const overlapping = await qb.getCount();
    if (overlapping > 0) {
      throw conflict('El bloque de tiempo se solapa con otro existente');
    }
  }
}