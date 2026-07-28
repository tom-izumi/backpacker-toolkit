import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFarmById } from '@/lib/farms';
import { isSupabaseConfigured } from '@/lib/supabase';
import VerificationBadge from '@/components/VerificationBadge';

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm text-amber-800">
        尚未設定 Supabase 連線資訊，無法讀取農場資料。請於 .env.local 補上
        NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY。
      </div>
    );
  }

  const farm = await getFarmById(id);
  if (!farm) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← 回地圖
      </Link>

      {/* 1. 頂部：名稱、地區、驗證等級徽章 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{farm.name}</h1>
          <p className="text-sm text-slate-500">{farm.region}</p>
        </div>
        <VerificationBadge status={farm.verification_status} />
      </div>

      {/* 2. 基本資訊區 */}
      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <Field label="工作類型" value={farm.job_type} />
        <Field label="作物" value={farm.crop} />
        <Field label="產季時間範圍" value={farm.season_range} />
        <Field
          label="建議入職/抵達時間點"
          value={farm.suggested_entry_timing}
        />
        <Field label="計薪方式" value={farm.pay_method} />
        <Field label="參考金額範圍" value={farm.pay_range} />
        <Field label="住宿" value={farm.accommodation} />
        <Field label="交通" value={farm.transport} />
        <Field label="英文需求程度" value={farm.english_requirement} />
        <Field label="是否可集簽" value={farm.can_collect_stamp ? '可集簽' : '不可集簽'} />
        <Field label="提供者" value={farm.provider} />
      </dl>

      {/* 3. 難度評估：明確標註為站長主觀評分 */}
      {farm.difficulty_rating != null && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">難度指標</h2>
          <div className="text-lg tracking-wide text-amber-500">
            {'★'.repeat(farm.difficulty_rating)}
            {'☆'.repeat(5 - farm.difficulty_rating)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            此為站長主觀評分，非客觀難度指標
          </p>
        </div>
      )}

      {/* 4. 站長介紹：敘述性排版，非表格 */}
      {farm.founder_notes && (
        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/60 p-5">
          <h2 className="mb-2 text-sm font-semibold text-blue-900">
            站長心得
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-slate-700">
            {farm.founder_notes}
          </p>
        </div>
      )}

      {/* 5. 底部：最後確認時間 */}
      <p className="mt-6 text-xs text-slate-400">
        最後確認時間：{farm.last_confirmed_date ?? '未提供'}
      </p>
    </div>
  );
}
