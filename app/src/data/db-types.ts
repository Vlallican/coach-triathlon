import type { Sport } from './types';

export interface ProfileRow {
  id: string;
  first_name: string | null;
  initials: string | null;
}

export interface SessionRow {
  id: string;
  user_id: string;
  week_start: string;
  day_index: number;
  sport: Sport;
  is_rest: boolean;
  title: string | null;
  duration_label: string | null;
  distance_label: string | null;
  pace_label: string | null;
  intensity_label: string | null;
  hr_label: string | null;
  has_power: boolean | null;
  power_label: string | null;
  tss: number | null;
  rpe_label: string | null;
  feedback: string | null;
  zones: { widthPct: number; color: string }[] | null;
  intervals: { label: string; detail: string }[] | null;
}

export interface ChatMessageRow {
  id: string;
  user_id: string;
  from_role: 'ai' | 'user';
  text: string;
  created_at: string;
}
