import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SessionRow } from '../data/db-types';
import { mapSessionRow } from '../data/mappers';
import type { Session } from '../data/types';
import { supabase } from '../lib/supabase';
import { buildCurrentWeekDays, getTodayDayIndex, parseISODate } from '../utils/date';

/** Séances de la semaine la plus récente de l'utilisateur (jours/sport dérivés côté client). */
export function useSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weekStartDate, setWeekStartDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setSessions([]);
      setWeekStartDate(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })
      .order('day_index', { ascending: true });

    const rows = (data ?? []) as SessionRow[];
    if (rows.length === 0) {
      setSessions([]);
      setWeekStartDate(null);
      setLoading(false);
      return;
    }

    const latestWeekStart = rows[0].week_start;
    const weekRows = rows.filter((r) => r.week_start === latestWeekStart);
    const monday = parseISODate(latestWeekStart);
    const weekDays = buildCurrentWeekDays(monday);

    setSessions(weekRows.map((r) => mapSessionRow(r, weekDays)));
    setWeekStartDate(monday);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const todaySessionId = useMemo(() => {
    if (sessions.length === 0) return undefined;
    const todayIdx = getTodayDayIndex();
    return sessions.find((s) => s.dayIndex === todayIdx)?.id ?? sessions[0].id;
  }, [sessions]);

  return { sessions, weekStartDate, todaySessionId, loading, refresh: load };
}

/** Une séance précise par id (utilisé par l'écran de détail, indépendamment de la semaine affichée). */
export function useSessionById(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase.from('sessions').select('*').eq('id', sessionId).maybeSingle();
      if (cancelled) return;
      if (data) {
        const row = data as SessionRow;
        const monday = parseISODate(row.week_start);
        const weekDays = buildCurrentWeekDays(monday);
        setSession(mapSessionRow(row, weekDays));
      } else {
        setSession(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return { session, loading };
}
