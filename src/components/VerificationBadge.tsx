import type { VerificationStatus } from '@/lib/types';

const STYLES: Record<VerificationStatus, { icon: string; className: string }> = {
  已驗證: {
    icon: '✅',
    className: 'bg-green-500/10 text-green-400 border-green-500/30',
  },
  未驗證: {
    icon: '⬜',
    className: 'bg-surface text-muted border-border',
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
