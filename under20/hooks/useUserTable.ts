import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function useUserTable<T extends { id: string }>(table: string, select: string) {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const [rows, setRows] = useState<T[]>([]);

  useEffect(() => {
    if (!userId) {
      setRows([]);
      return;
    }
    let cancelled = false;
    supabase
      .from(table)
      .select(select)
      .eq('user_id', userId)
      .order('created_at')
      .then(({ data }) => { if (!cancelled) setRows((data as unknown as T[]) ?? []); });
    return () => { cancelled = true; };
  }, [userId, table, select]);

  return { userId, rows, setRows };
}
