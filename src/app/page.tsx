import { getFarms } from '@/lib/farms';
import { isSupabaseConfigured } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';

// 每次請求即時抓取，Table Editor 新增資料才能不重新部署就反映
export const dynamic = 'force-dynamic';

export default async function Home() {
  const farms = await getFarms();

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">
          Backpacker Toolkit — Farm Map
        </h1>
        <p className="text-sm text-slate-500">
          昆士蘭 Caboolture / Stanthorpe 農場資訊（模糊定位，非精確地址）
        </p>
      </header>

      {!isSupabaseConfigured && (
        <div className="bg-amber-50 px-4 py-2 text-sm text-amber-800">
          尚未設定 Supabase 連線資訊，目前僅顯示程式骨架（無資料）。請於 .env.local
          補上 NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY。
        </div>
      )}

      <main className="min-h-0 flex-1">
        <HomeClient farms={farms} />
      </main>
    </div>
  );
}
