import { initialChatMessages, sessions as mockSessions } from '../data/mockData';
import { getMonday, toISODateString } from '../utils/date';
import { supabase } from './supabase';

function firstNameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'Athlète';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function initialsFromName(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

async function ensureProfile(userId: string, email: string | undefined) {
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle();
  if (profile) return;

  const firstName = firstNameFromEmail(email ?? 'athlete');
  await supabase.from('profiles').insert({
    id: userId,
    first_name: firstName,
    initials: initialsFromName(firstName),
  });
}

async function ensureSessions(userId: string) {
  const { count } = await supabase
    .from('sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (count) return;

  const weekStart = toISODateString(getMonday(new Date()));
  const rows = mockSessions.map((s) => ({
    user_id: userId,
    week_start: weekStart,
    day_index: s.dayIndex,
    sport: s.sport,
    is_rest: s.isRest,
    title: s.title ?? null,
    duration_label: s.durationLabel ?? null,
    distance_label: s.distanceLabel ?? null,
    pace_label: s.paceLabel ?? null,
    intensity_label: s.intensityLabel ?? null,
    hr_label: s.hrLabel ?? null,
    has_power: s.hasPower ?? null,
    power_label: s.powerLabel ?? null,
    tss: s.tss ?? null,
    rpe_label: s.rpeLabel ?? null,
    feedback: s.feedback ?? null,
    zones: s.zones ?? null,
    intervals: s.intervals ?? null,
  }));
  await supabase.from('sessions').insert(rows);
}

async function ensureChatMessages(userId: string) {
  const { count } = await supabase
    .from('chat_messages')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (count) return;

  const now = Date.now();
  const rows = initialChatMessages.map((m, i) => ({
    user_id: userId,
    from_role: m.from,
    text: m.text,
    created_at: new Date(now + i * 1000).toISOString(),
  }));
  await supabase.from('chat_messages').insert(rows);
}

/** Migration de démarrage : peuple le compte d'un nouvel utilisateur avec les données de départ (ex mockData). */
export async function ensureSeedData(userId: string, email: string | undefined): Promise<void> {
  await ensureProfile(userId, email);
  await Promise.all([ensureSessions(userId), ensureChatMessages(userId)]);
}
