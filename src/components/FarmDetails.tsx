import type { Farm } from '@/lib/types';
import VerificationBadge from '@/components/VerificationBadge';

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

export default function FarmDetails({
  farm,
  showHeader = true,
}: {
  farm: Farm;
  showHeader?: boolean;
}) {
  return (
    <div>
      {/* 1. 頂部：名稱、地區、驗證等級徽章 */}
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{farm.name}</h1>
            <p className="text-sm text-muted">{farm.region}</p>
          </div>
          <VerificationBadge status={farm.verification_status} />
        </div>
      )}

      {/* 2. 基本資訊區 */}
      <dl
        className={`grid grid-cols-1 gap-x-6 gap-y-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 ${showHeader ? 'mt-6' : ''}`}
      >
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
        <div className="mt-6 rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-1 text-sm font-semibold text-foreground">難度指標</h2>
          <div className="text-lg tracking-wide text-amber-400">
            {'★'.repeat(farm.difficulty_rating)}
            {'☆'.repeat(5 - farm.difficulty_rating)}
          </div>
          <p className="mt-1 text-xs text-muted">
            此為站長主觀評分，非客觀難度指標
          </p>
        </div>
      )}

      {/* 4. 站長介紹：敘述性排版，非表格 */}
      {farm.founder_notes && (
        <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-5">
          <h2 className="mb-2 text-sm font-semibold text-accent">
            站長心得
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-foreground/90">
            {farm.founder_notes}
          </p>
        </div>
      )}

      {/* 5. 底部：最後確認時間 */}
      <p className="mt-6 text-xs text-muted">
        最後確認時間：{farm.last_confirmed_date ?? '未提供'}
      </p>
    </div>
  );
}
