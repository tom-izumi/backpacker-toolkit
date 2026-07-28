'use client';

import { Drawer } from 'vaul';
import Link from 'next/link';
import type { Farm } from '@/lib/types';
import FarmDetails from '@/components/FarmDetails';

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
      snapPoints={['180px', 0.5, 1]}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96vh] flex-col rounded-t-2xl border-t border-border bg-surface outline-none">
          <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border" />
          <Drawer.Title className="sr-only">
            {farm?.name ?? '農場詳情'}
          </Drawer.Title>
          <div className="overflow-y-auto px-5 pt-4 pb-8">
            {farm && (
              <>
                <FarmDetails farm={farm} />
                <Link
                  href={`/farms/${farm.id}`}
                  className="mt-6 inline-block text-sm text-accent hover:underline"
                >
                  查看完整頁面 →
                </Link>
              </>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
