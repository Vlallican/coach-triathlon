import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Profile {
  firstName: string;
  initials: string;
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, initials')
        .eq('id', userId)
        .maybeSingle();
      if (cancelled) return;
      setProfile(data ? { firstName: data.first_name ?? '', initials: data.initials ?? '' } : null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { profile, loading };
}
