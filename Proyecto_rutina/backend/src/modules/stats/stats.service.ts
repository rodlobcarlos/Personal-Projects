import { AppDataSource } from '../../config/orm';
import { HabitRepository } from '../../repositories/HabitRepository';
import { CompletionRepository } from '../../repositories/CompletionRepository';
import { TaskRepository } from '../../repositories/TaskRepository';
import { addDays, enumerateDates, todayStrInTz } from '../../core/date';
import { HabitSchedule } from '../habits/habits.schedule';
import { computeStreak } from '../habits/habits.service';

export interface SummaryQuery {
  range?: 'week' | 'month';
  from?: string;
  to?: string;
}

export interface SummaryResult {
  range: { from: string; to: string; days: number };
  overview: {
    activeHabits: number;
    expectedCompletions: number;
    actualCompletions: number;
    completionRate: number;
    tasksTotal: number;
    tasksCompleted: number;
    tasksOverdue: number;
  };
  perHabit: Array<{
    habitId: number;
    name: string;
    icon: string | null;
    color: string | null;
    expected: number;
    completed: number;
    completionRate: number;
    currentStreak: number;
  }>;
  daily: Array<{ date: string; expected: number; completed: number; rate: number; tasksDone: number }>;
}

export class StatsService {
  private readonly habitRepository: HabitRepository;
  private readonly completionRepository: CompletionRepository;
  private readonly taskRepository: TaskRepository;

  constructor() {
    this.habitRepository = new HabitRepository(AppDataSource);
    this.completionRepository = new CompletionRepository(AppDataSource);
    this.taskRepository = new TaskRepository(AppDataSource);
  }

  async summary(userId: number, query: SummaryQuery, timezone: string): Promise<SummaryResult> {
    const today = todayStrInTz(timezone);
    let from: string;
    let to = query.to ?? today;

    if (query.from) {
      from = query.from;
    } else if (query.range === 'week') {
      from = addDays(today, -6);
    } else if (query.range === 'month') {
      const [y, m] = today.split('-').map(Number);
      from = `${y}-${String(m).padStart(2, '0')}-01`;
    } else {
      from = addDays(today, -6);
    }

    if (from > to) {
      [from, to] = [to, from];
    }

    const days = enumerateDates(from, to);
    const habits = await this.habitRepository.listActive(userId);
    const completions = await this.completionRepository.findBetween(userId, from, to);
    const tasks = await this.taskRepository.listByUser(userId);
    const tasksCompleted = tasks.filter((task) => task.status === 'completed').length;
    const tasksOverdue = tasks.filter(
      (task) => task.status === 'pending' && task.dueDate !== null && task.dueDate < today
    ).length;

    const habitCompletions = completions.filter((completion) => completion.habitId !== null);
    const taskCompletions = completions.filter((completion) => completion.taskId !== null);

    const completionsByHabit = new Map<number, number>();
    for (const completion of habitCompletions) {
      if (completion.habitId !== null) {
        completionsByHabit.set(completion.habitId, (completionsByHabit.get(completion.habitId) ?? 0) + 1);
      }
    }

    const perHabit = await Promise.all(
      habits.map(async (habit) => {
        const expected = HabitSchedule.expectedBetween(habit, from, to);
        const completed = Math.min(completionsByHabit.get(habit.id) ?? 0, expected);
        const habitDates = await this.completionRepository.findByHabitDates(userId, habit.id);
        const streak = computeStreak(new Set(habitDates), timezone);
        return {
          habitId: habit.id,
          name: habit.name,
          icon: habit.icon,
          color: habit.color,
          expected,
          completed,
          completionRate: expected === 0 ? 1 : completed / expected,
          currentStreak: streak.current
        };
      })
    );

    let totalExpected = 0;
    let totalCompleted = 0;
    for (const habit of habits) {
      const expected = HabitSchedule.expectedBetween(habit, from, to);
      totalExpected += expected;
      totalCompleted += Math.min(completionsByHabit.get(habit.id) ?? 0, expected);
    }

    const completionsByDate = new Map<string, number>();
    for (const completion of taskCompletions) {
      completionsByDate.set(completion.completionDate, (completionsByDate.get(completion.completionDate) ?? 0) + 1);
    }

    const habitsCompleteByDate = new Map<string, number>();
    for (const completion of habitCompletions) {
      habitsCompleteByDate.set(completion.completionDate, (habitsCompleteByDate.get(completion.completionDate) ?? 0) + 1);
    }

    const daily = days.map((date) => {
      const expected = habits.filter((habit) => HabitSchedule.appliesOn(habit, date)).length;
      const completed = Math.min(habitsCompleteByDate.get(date) ?? 0, expected);
      return {
        date,
        expected,
        completed,
        rate: expected === 0 ? 0 : completed / expected,
        tasksDone: completionsByDate.get(date) ?? 0
      };
    });

    return {
      range: { from, to, days: days.length },
      overview: {
        activeHabits: habits.length,
        expectedCompletions: totalExpected,
        actualCompletions: totalCompleted,
        completionRate: totalExpected === 0 ? 0 : totalCompleted / totalExpected,
        tasksTotal: tasks.length,
        tasksCompleted,
        tasksOverdue
      },
      perHabit,
      daily
    };
  }

  async streaks(userId: number, timezone: string): Promise<Array<{ habitId: number; name: string; current: number; longest: number }>> {
    const habits = await this.habitRepository.listByUser(userId);
    const result = [];
    for (const habit of habits) {
      const dates = await this.completionRepository.findByHabitDates(userId, habit.id);
      const streak = computeStreak(new Set(dates), timezone);
      result.push({ habitId: habit.id, name: habit.name, current: streak.current, longest: streak.longest });
    }
    return result;
  }
}