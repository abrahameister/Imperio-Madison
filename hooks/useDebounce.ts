import { useState, useEffect } from 'react';

/**
 * Delays updating the returned value until `delay` ms after
 * the last change to `value`. Protects Supabase from rapid queries.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
