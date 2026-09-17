/** Convierte un objeto Date a 'YYYY-MM-DD' en la zona horaria indicada. */
export function dateStrInTz(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
  return parts;
}

/** Fecha local de 'hoy' en la zona horaria del usuario. */
export function todayStrInTz(timezone: string): string {
  return dateStrInTz(new Date(), timezone);
}

/** Resta n días a una cadena 'YYYY-MM-DD' tratándola como fecha UTC. */
export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Día de la semana ISO de una cadena 'YYYY-MM-DD': 0=Lunes ... 6=Domingo.
 * Se interpreta como fecha UTC para ser determinista.
 */
export function isoDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return (day + 6) % 7;
}

/** Genera todas las fechas 'YYYY-MM-DD' entre from y to (inclusive). */
export function enumerateDates(from: string, to: string): string[] {
  const dates: string[] = [];
  let cursor = from;
  if (from > to) return dates;
  for (let i = 0; i < 400; i++) {
    dates.push(cursor);
    if (cursor === to) break;
    cursor = addDays(cursor, 1);
  }
  return dates;
}

/** Normaliza un input a 'YYYY-MM-DD' usando la zona horaria del usuario. */
export function normalizeDate(input: string | undefined, timezone: string): string {
  if (input === undefined || input === '') {
    return todayStrInTz(timezone);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    throw new Error('Fecha inválida, use el formato YYYY-MM-DD');
  }
  return input;
}

/** Convierte 'HH:mm' o 'HH:mm:ss' a 'HH:mm:ss' para la columna TIME. */
export function normalizeTime(input: string): string {
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(input)) {
    const [h, m, s = '00'] = input.split(':');
    return `${h.padStart(2, '0')}:${m}:${s}`;
  }
  throw new Error('Hora inválida, use el formato HH:mm');
}