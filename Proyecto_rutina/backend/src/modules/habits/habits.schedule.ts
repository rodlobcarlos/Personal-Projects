import { addDays, enumerateDates, isoDayOfWeek } from '../../core/date';
import { Habit } from '../../entities/Habit';

const WEEKDAYS_ISO = [0, 1, 2, 3, 4, 5, 6];

/** Programación de hábitos: en qué fechas debe completarse un hábito. */
export class HabitSchedule {
  /** ¿El hábito aplica en la fecha dada? */
  static appliesOn(habit: Pick<Habit, 'frequency' | 'customDays'>, date: string): boolean {
    switch (habit.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return true;
      case 'custom':
        if (!habit.customDays || habit.customDays.length === 0) {
          return false;
        }
        return habit.customDays.includes(isoDayOfWeek(date));
      default:
        return false;
    }
  }

  /** Número de fechas, entre from y to inclusive, en las que el hábito aplica. */
  static expectedBetween(
    habit: Pick<Habit, 'frequency' | 'customDays'>,
    from: string,
    to: string
  ): number {
    if (habit.frequency === 'weekly') {
      const re = enumerateDates(from, to);
      return Math.ceil(re.length / 7) || 1;
    }
    return enumerateDates(from, to).filter((date) => this.appliesOn(habit, date)).length;
  }

  /** Próxiimos 7 días ISO (Lunes..Domingo) para validar customDays. */
  static validWeekday(): number[] {
    return WEEKDAYS_ISO;
  }

  /** Fecha 'hoy' menos n días, en formato YYYY-MM-DD (UTC). */
  static dayOffset(offsetDays: number, today: string = addDays(new Date().toISOString().slice(0, 10), 0)): string {
    return addDays(today, offsetDays);
  }
}