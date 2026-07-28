'use client';

import { Drawer } from 'vaul';
import Link from 'next/link';
import type { Farm } from '@/lib/types';
import FarmDetails from '@/components/FarmDetails';
import VerificationBadge from '@/components/VerificationBadge';

const PEEK_SNAP_POINT = '176px';
const FULL_SNAP_POINT = 0.94;

export default function FarmBottomSheet({
  farm,
  onClose,
}: {
  farm: Farm | null;
  onClose: () => void;
}) {
  return (
    <Drawer.Root
      open={farm != null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      snapPoints={[PEEK_SNAP_POINT, FULL_SNAP_POINT]}
      handleOnly
      shouldScaleBackground
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/70" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 flex h-full max-h-[97vh] flex-col rounded-t-2xl border-t border-border bg-surface outline-none">
          <Drawer.Title className="sr-only">
            {farm?.name ?? '農場詳情'}
          </Drawer.Title>

          {farm && (
            <>
              <div className="shrink-0 rounded-t-2xl bg-surface">
                <Drawer.Handle
                  style={{ backgroundColor: 'var(--border)', opacity: 1 }}
                  className="mt-3"
                />
                <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-bold text-foreground">
                        {farm.name}
                      </h2>
                      <VerificationBadge status={farm.verification_status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">
                      {farm.region} · {farm.crop} · {farm.job_type}
                    </p>
                  </div>
                  <Drawer.Close asChild>
                    <button
                      type="button"
                      aria-label="關閉"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted hover:text-foreground"
                    >
                      ✕
                    </button>
                  </Drawer.Close>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10">
                <FarmDetails farm={farm} showHeader={false} />
                <Link
                  href={`/farms/${farm.id}`}
                  className="mt-6 inline-block text-sm text-accent hover:underline"
                >
                  查看完整頁面 →
                </Link>
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
