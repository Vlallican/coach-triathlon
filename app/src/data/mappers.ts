import type { WeekDay } from '../utils/date';
import { SPORT_INFO } from './sportInfo';
import type { ChatMessageRow, SessionRow } from './db-types';
import type { ChatMessage, Session } from './types';

export function mapSessionRow(row: SessionRow, weekDays: WeekDay[]): Session {
  const wd = weekDays[row.day_index];
  const sportInfo = SPORT_INFO[row.sport];
  return {
    id: row.id,
    dayIndex: row.day_index,
    dayLabel: wd.dayLabel,
    dayFull: wd.dayFull,
    dayNum: wd.dayNum,
    sport: row.sport,
    isRest: row.is_rest,
    sportLabel: sportInfo?.label,
    sportInitial: sportInfo?.initial,
    sportColor: sportInfo?.color,
    title: row.title ?? undefined,
    durationLabel: row.duration_label ?? undefined,
    distanceLabel: row.distance_label ?? undefined,
    paceLabel: row.pace_label ?? undefined,
    intensityLabel: row.intensity_label ?? undefined,
    hrLabel: row.hr_label ?? undefined,
    hasPower: row.has_power ?? undefined,
    powerLabel: row.power_label ?? undefined,
    tss: row.tss ?? undefined,
    rpeLabel: row.rpe_label ?? undefined,
    zones: row.zones ?? undefined,
    intervals: row.intervals ?? undefined,
    feedback: row.feedback ?? undefined,
  };
}

export function mapChatMessageRow(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    from: row.from_role,
    text: row.text,
  };
}
