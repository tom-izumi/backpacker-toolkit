'use client';

import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import Link from 'next/link';
import type { Farm } from '@/lib/types';
import FarmDetails from '@/components/FarmDetails';
import VerificationBadge from '@/components/VerificationBadge';

const PEEK_SNAP_POINT = '176px';
const FULL_SNAP_POINT = 0.94;
const MAX_BLUR_PX = 14;

function getWrapper(): HTMLElement | null {
  return document.querySelector('[data-vaul-drawer-wrapper]');
}

export default function FarmBottomSheet({
  farm,
  onClose,
}: {
  farm: Farm | null;
  onClose: () => void;
}) {
  const [snap, setSnap] = useState<number | string | null>(PEEK_SNAP_POINT);
  const [lastFarmId, setLastFarmId] = useState(farm?.id);

  // 每次開啟新的農場都從收合預覽開始（render 期間依 prop 變化調整 state，而非在 effect 內）
  if (farm?.id !== lastFarmId) {
    setLastFarmId(farm?.id);
    setSnap(PEEK_SNAP_POINT);
  }

  // 停在某個 snap point 時，把背景模糊收斂到該狀態對應的最終值（帶過場動畫）
  useEffect(() => {
    const wrapper = getWrapper();
    if (!wrapper) return;
    wrapper.style.transition = '';
    wrapper.style.filter = snap === FULL_SNAP_POINT ? `blur(${MAX_BLUR_PX}px)` : 'blur(0px)';
  }, [snap]);

  // 完全關閉時立刻讓背景模糊淡出
  useEffect(() => {
    if (farm != null) return;
    const wrapper = getWrapper();
    if (!wrapper) return;
    wrapper.style.transition = '';
    wrapper.style.filter = 'blur(0px)';
  }, [farm]);

  return (
    <Drawer.Root
      open={farm != null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      snapPoints={[PEEK_SNAP_POINT, FULL_SNAP_POINT]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      shouldScaleBackground
      onDrag={(_event, percentageDragged) => {
        const wrapper = getWrapper();
        if (!wrapper) return;
        wrapper.style.transition = 'none';
        wrapper.style.filter = `blur(${percentageDragged * MAX_BLUR_PX}px)`;
      }}
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
                      data-vaul-no-drag
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
                  data-vaul-no-drag
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
