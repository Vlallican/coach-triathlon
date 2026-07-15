import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Session as AuthSession, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { ensureSeedData } from './seed';

interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  loading: boolean;
  seeding: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  seeding: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const seededUserId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const user = session?.user;
    if (!user || seededUserId.current === user.id) return;
    seededUserId.current = user.id;
    setSeeding(true);
    ensureSeedData(user.id, user.email).finally(() => setSeeding(false));
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, seeding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
