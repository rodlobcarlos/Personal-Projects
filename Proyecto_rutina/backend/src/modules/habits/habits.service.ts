import { In } from 'typeorm';
import { AppDataSource } from '../../config/orm';
import { Habit } from '../../entities/Habit';
import { Category } from '../../entities/Category';
import { Completion } from '../../entities/Completion';
import { HabitRepository } from '../../repositories/HabitRepository';
import { CompletionRepository } from '../../repositories/CompletionRepository';
import { AppError, conflict, notFound } from '../../core/http-error';
import { addDays, normalizeDate, todayStrInTz } from '../../core/date';
import { CreateHabitDto, UpdateHabitDto } from './habits.dto';

export interface StreakResult {
  current: number;
  longest: number;
  bestStart: string | null;
}

export class HabitService {
  private readonly habitRepository: HabitRepository;
  private readonly completionRepository: CompletionRepository;
  private readonly categoryRepository = AppDataSource.getRepository(Category);

  constructor() {
    this.habitRepository = new HabitRepository(AppDataSource);
    this.completionRepository = new CompletionRepository(AppDataSource);
  }

  async list(userId: number): Promise<Habit[]> {
    return this.habitRepository.listByUser(userId);
  }

  async getById(userId: number, habitId: number): Promise<Habit> {
    const habit = await this.habitRepository.findOwned(userId, habitId);
    if (!habit) {
      throw notFound('Hábito no encontrado');
    }
    return habit;
  }

  async create(userId: number, dto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitRepository.create({
      userId,
      name: dto.name,
      description: dto.description ?? null,
      frequency: dto.frequency ?? 'daily',
      customDays: dto.frequency === 'custom' ? (dto.customDays ?? []) : null,
      targetPerDay: dto.targetPerDay ?? 1,
      icon: dto.icon ?? null,
      color: dto.color ?? null,
      isActive: dto.isActive ?? true
    });
    habit.categories = await this.resolveCategories(userId, dto.categoryIds ?? []);
    return this.habitRepository.save(habit);
  }

  async update(userId: number, habitId: number, dto: UpdateHabitDto): Promise<Habit> {
    const habit = await this.habitRepository.findOwned(userId, habitId);
    if (!habit) {
      throw notFound('Hábito no encontrado');
    }

    if (dto.name !== undefined) habit.name = dto.name;
    if (dto.description !== undefined) habit.description = dto.description;
    if (dto.frequency !== undefined) habit.frequency = dto.frequency;
    if (dto.customDays !== undefined) habit.customDays = dto.frequency === 'custom' ? dto.customDays : null;
    if (dto.targetPerDay !== undefined) habit.targetPerDay = dto.targetPerDay;
    if (dto.icon !== undefined) habit.icon = dto.icon;
    if (dto.color !== undefined) habit.color = dto.color;
    if (dto.isActive !== undefined) habit.isActive = dto.isActive;
    if (dto.categoryIds !== undefined) {
      habit.categories = await this.resolveCategories(userId, dto.categoryIds ?? []);
    }

    return this.habitRepository.save(habit);
  }

  async remove(userId: number, habitId: number): Promise<void> {
    const habit = await this.habitRepository.findOwned(userId, habitId);
    if (!habit) {
      throw notFound('Hábito no encontrado');
    }
    await this.habitRepository.remove(habit);
  }

  async complete(
    userId: number,
    habitId: number,
    completionDateInput: string | undefined,
    note: string | undefined,
    timezone: string
  ): Promise<Completion> {
    const habit = await this.habitRepository.findOwned(userId, habitId);
    if (!habit) {
      throw notFound('Hábito no encontrado');
    }
    const date = normalizeDate(completionDateInput, timezone);

    const existing = await this.completionRepository.findOne({
      where: { userId, habitId, completionDate: date }
    });
    if (existing) {
      return existing;
    }

    const countToday = await this.completionRepository.count({ where: { userId, habitId, completionDate: date } });
    if (countToday >= habit.targetPerDay) {
      throw conflict(`Ya se completó el objetivo diario (${habit.targetPerDay}) para este hábito`);
    }

    return this.completionRepository.save(
      this.completionRepository.create({
        userId,
        habitId,
        completionDate: date,
        note: note ?? null
      })
    );
  }

  async uncomplete(userId: number, habitId: number, completionDateInput: string | undefined, timezone: string): Promise<void> {
    const date = normalizeDate(completionDateInput, timezone);
    const record = await this.completionRepository.findOne({ where: { userId, habitId, completionDate: date } });
    if (record) {
      await this.completionRepository.remove(record);
    }
  }

  async streak(userId: number, habitId: number, timezone: string): Promise<StreakResult> {
    const habit = await this.habitRepository.findOne({ where: { id: habitId, userId } });
    if (!habit) {
      throw notFound('Hábito no encontrado');
    }
    const dates = await this.completionRepository.findByHabitDates(userId, habitId);
    return computeStreak(new Set(dates), timezone);
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

/** Calcula racha actual (hoy o ayer) y la mayor racha histórica. */
export function computeStreak(completedDates: Set<string>, timezone: string): StreakResult {
  const startToday = todayStrInTz(timezone);

  let current = 0;
  let cursor = startToday;
  if (!completedDates.has(cursor)) {
    cursor = addDays(cursor, -1);
    if (!completedDates.has(cursor)) {
      current = 0;
    } else {
      current = 1;
    }
  } else {
    current = 1;
  }
  while (completedDates.has(addDays(cursor, -1))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...completedDates].sort();
  let longest = 0;
  let run = 0;
  let bestStart: string | null = null;
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0 || addDays(sorted[i - 1], 1) === sorted[i]) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longest) {
      longest = run;
      bestStart = sorted[i - (run - 1)];
    }
  }

  return { current, longest, bestStart };
}