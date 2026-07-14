const DAY_LABELS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
const DAY_FULLS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export interface WeekDay {
  dayIndex: number;
  dayLabel: string;
  dayFull: string;
  dayNum: number;
  date: Date;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** 0 = Lundi … 6 = Dimanche (contrairement à Date#getDay, où 0 = Dimanche). */
export function getIsoDayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getMonday(date: Date): Date {
  return addDays(startOfDay(date), -getIsoDayIndex(date));
}

export function getTodayDayIndex(reference: Date = new Date()): number {
  return getIsoDayIndex(reference);
}

export function buildCurrentWeekDays(reference: Date = new Date()): WeekDay[] {
  const monday = getMonday(reference);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    return {
      dayIndex: i,
      dayLabel: DAY_LABELS[i],
      dayFull: DAY_FULLS[i],
      dayNum: date.getDate(),
      date,
    };
  });
}

export function formatWeekRangeLabel(reference: Date = new Date()): string {
  const monday = getMonday(reference);
  const sunday = addDays(monday, 6);
  const monthLabel = MONTHS[sunday.getMonth()];
  return `Semaine du ${monday.getDate()} au ${sunday.getDate()} ${monthLabel}`;
}

export function formatFullDateLabel(reference: Date = new Date()): string {
  const dayFull = DAY_FULLS[getIsoDayIndex(reference)];
  const monthLabel = MONTHS[reference.getMonth()];
  return `${dayFull} ${reference.getDate()} ${monthLabel}`;
}

export function daysBetween(from: Date, to: Date): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / 86400000);
}
