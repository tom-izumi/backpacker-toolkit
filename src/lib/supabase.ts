import { createClient } from '@supabase/supabase-js';
import type { Farm } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 尚未設定 Supabase 連線資訊時，仍允許頁面渲染（僅骨架，無資料）
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient<{
  public: { Tables: { farms: { Row: Farm } } };
}>(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-anon-key');
