import type { VerificationStatus } from '@/lib/types';

const STYLES: Record<VerificationStatus, { icon: string; className: string }> = {
  已驗證: {
    icon: '✅',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  未驗證: {
    icon: '⬜',
    className: 'bg-slate-100 text-slate-600 border-slate-300',
  },
};

export default function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  const style = STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${style.className}`}
    >
      <span aria-hidden>{style.icon}</span>
      {status}
    </span>
  );
}
