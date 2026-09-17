import { DataSource, Repository } from 'typeorm';
import { Habit } from '../entities/Habit';

export class HabitRepository extends Repository<Habit> {
  constructor(dataSource: DataSource) {
    super(Habit, dataSource.manager);
  }

  async listByUser(userId: number): Promise<Habit[]> {
    return this.find({
      where: { userId },
      relations: { categories: true },
      order: { createdAt: 'ASC' }
    });
  }

  async findOwned(userId: number, habitId: number): Promise<Habit | null> {
    return this.findOne({
      where: { id: habitId, userId },
      relations: { categories: true }
    });
  }

  async listActive(userId: number): Promise<Habit[]> {
    return this.find({ where: { userId, isActive: true } });
  }
}