/**
 * Tests para computeStreak — lógica pura sin dependencia de base de datos.
 * Las fechas se calculan de forma relativa a HOY para ser deterministas.
 */
let _testDs: unknown;

jest.mock('../src/config/orm', () => ({
  get AppDataSource() { return _testDs; },
  initDataSource: jest.fn()
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { computeStreak } = require('../src/modules/habits/habits.service') as typeof import('../src/modules/habits/habits.service');

/** Devuelve 'YYYY-MM-DD' del día actual menos n días (UTC). */
function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

const today = daysAgo(0);
const yesterday = daysAgo(1);
const twoDaysAgo = daysAgo(2);
const threeDaysAgo = daysAgo(3);
const fourDaysAgo = daysAgo(4);
const fiveDaysAgo = daysAgo(5);

describe('computeStreak', () => {
  const TZ = 'America/Mexico_City';
  const days = (...dates: string[]) => new Set(dates);

  it('devuelve 0 si no hay completados', () => {
    const result = computeStreak(days(), TZ);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(0);
    expect(result.bestStart).toBeNull();
  });

  it('computa racha actual de 1 día (completado hoy)', () => {
    expect(computeStreak(days(today), TZ).current).toBe(1);
  });

  it('computa racha actual de varios días consecutivos', () => {
    const result = computeStreak(days(today, yesterday, twoDaysAgo, threeDaysAgo), TZ);
    expect(result.current).toBe(4);
  });

  it('racha actual baja a 1 si faltó ayer', () => {
    const result = computeStreak(days(today, twoDaysAgo), TZ);
    expect(result.current).toBe(1);
  });

  it('mantiene la racha si el último completado es ayer y hoy aún no se hace', () => {
    const result = computeStreak(days(yesterday, twoDaysAgo, threeDaysAgo), TZ);
    expect(result.current).toBe(3);
  });

  it('longest registra la racha máxima histórica', () => {
    const result = computeStreak(days(fiveDaysAgo, fourDaysAgo, threeDaysAgo, twoDaysAgo, yesterday), TZ);
    expect(result.longest).toBe(5);
    expect(result.bestStart).toBe(fiveDaysAgo);
  });
});