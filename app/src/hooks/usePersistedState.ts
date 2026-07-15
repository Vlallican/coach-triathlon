import { useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON } from '../storage/storage';

/**
 * État React sauvegardé dans AsyncStorage sous `key`, rechargé au montage.
 * `isLoading` reste `true` tant que la lecture initiale n'est pas terminée
 * (utile pour retarder un rendu qui dépend de la valeur restaurée).
 */
export function usePersistedState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const hydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    hydrated.current = false;
    setIsLoading(true);
    (async () => {
      const saved = await loadJSON<T>(key);
      if (cancelled) return;
      if (saved !== null) setValue(saved);
      hydrated.current = true;
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (hydrated.current) saveJSON(key, value);
  }, [key, value]);

  return [value, setValue, isLoading] as const;
}
