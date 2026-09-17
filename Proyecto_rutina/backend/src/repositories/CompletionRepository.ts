import { DataSource, Repository } from 'typeorm';
import { Completion } from '../entities/Completion';

export class CompletionRepository extends Repository<Completion> {
  constructor(dataSource: DataSource) {
    super(Completion, dataSource.manager);
  }

  async findByHabitDates(userId: number, habitId: number): Promise<string[]> {
    const rows = await this.find({
      where: { userId, habitId },
      select: ['completionDate']
    });
    return rows.map((row) => row.completionDate);
  }

  async findBetween(userId: number, from: string, to: string): Promise<Completion[]> {
    return this.find({
      where: { userId },
      order: { completionDate: 'ASC' }
    }).then((rows) => rows.filter((row) => row.completionDate >= from && row.completionDate <= to));
  }
}