export type Sport = 'swim' | 'bike' | 'run' | 'rest';

export interface HRZone {
  widthPct: number;
  color: string;
}

export interface SessionInterval {
  label: string;
  detail: string;
}

export interface Session {
  id: string;
  dayIndex: number;
  dayLabel: string;
  dayFull: string;
  dayNum: number;
  sport: Sport;
  isRest: boolean;
  sportLabel?: string;
  sportInitial?: string;
  sportColor?: string;
  title?: string;
  durationLabel?: string;
  distanceLabel?: string;
  paceLabel?: string;
  intensityLabel?: string;
  hrLabel?: string;
  hasPower?: boolean;
  powerLabel?: string;
  tss?: number;
  rpeLabel?: string;
  zones?: HRZone[];
  intervals?: SessionInterval[];
  feedback?: string;
}

export interface WeekVolumeEntry {
  sport: Sport;
  label: string;
  color: string;
  hours: number;
  target: number;
}

export interface HistoryWeekEntry {
  label: string;
  swimPx: number;
  bikePx: number;
  runPx: number;
}

export interface ChargeWeekEntry {
  label: string;
  value: number;
  px: number;
  color: string;
}

export type ChatSender = 'ai' | 'user';

export interface ChatMessage {
  id: string;
  from: ChatSender;
  text: string;
}
