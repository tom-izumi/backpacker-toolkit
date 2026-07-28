import { isSupabaseConfigured, supabase } from './supabase';
import type { Farm } from './types';

export async function getFarms(): Promise<Farm[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`讀取農場資料失敗：${error.message}`);
  }

  return data ?? [];
}

export async function getFarmById(id: string): Promise<Farm | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`讀取農場資料失敗：${error.message}`);
  }

  return data;
}
