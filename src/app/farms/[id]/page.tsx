import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFarmById } from '@/lib/farms';
import { isSupabaseConfigured } from '@/lib/supabase';
import FarmDetails from '@/components/FarmDetails';

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm text-amber-400">
        尚未設定 Supabase 連線資訊，無法讀取農場資料。請於 .env.local 補上
        NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY。
      </div>
    );
  }

  const farm = await getFarmById(id);
  if (!farm) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-accent hover:underline">
        ← 回地圖
      </Link>

      <div className="mt-4">
        <FarmDetails farm={farm} />
      </div>
    </div>
  );
}
