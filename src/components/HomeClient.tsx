'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import FarmMap from '@/components/FarmMap';
import FilterChips from '@/components/FilterChips';
import FarmBottomSheet from '@/components/FarmBottomSheet';
import VerificationBadge from '@/components/VerificationBadge';
import { splitTokens } from '@/lib/tokens';
import type { Farm } from '@/lib/types';

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function HomeClient({ farms }: { farms: Farm[] }) {
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  const crops = useMemo(
    () =>
      Array.from(new Set(farms.flatMap((f) => splitTokens(f.crop)))).sort(),
    [farms],
  );
  const jobTypes = useMemo(
    () =>
      Array.from(
        new Set(farms.flatMap((f) => splitTokens(f.job_type))),
      ).sort(),
    [farms],
  );

  const filteredFarms = useMemo(
    () =>
      farms.filter((f) => {
        const farmCrops = splitTokens(f.crop);
        const farmJobTypes = splitTokens(f.job_type);
        const cropMatch =
          selectedCrops.length === 0 ||
          farmCrops.some((c) => selectedCrops.includes(c));
        const jobMatch =
          selectedJobTypes.length === 0 ||
          farmJobTypes.some((j) => selectedJobTypes.includes(j));
        return cropMatch && jobMatch;
      }),
    [farms, selectedCrops, selectedJobTypes],
  );

  const selectedFarm =
    farms.find((f) => f.id === selectedFarmId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2 border-b border-border bg-surface px-4 py-3">
        <FilterChips
          label="作物"
          options={crops}
          selected={selectedCrops}
          onToggle={(v) => setSelectedCrops((prev) => toggleValue(prev, v))}
        />
        <FilterChips
          label="工作類型"
          options={jobTypes}
          selected={selectedJobTypes}
          onToggle={(v) => setSelectedJobTypes((prev) => toggleValue(prev, v))}
        />
        <span className="text-sm text-muted">
          共 {filteredFarms.length} 筆農場
        </span>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="h-80 w-full border-b border-border md:h-auto md:w-1/2 md:border-b-0 md:border-r">
          <FarmMap farms={filteredFarms} onSelectFarm={setSelectedFarmId} />
        </div>

        <ul className="w-full divide-y divide-border overflow-y-auto md:w-1/2">
          {filteredFarms.length === 0 && (
            <li className="p-6 text-center text-sm text-muted">
              沒有符合篩選條件的農場
            </li>
          )}
          {filteredFarms.map((farm) => (
            <li key={farm.id}>
              <Link
                href={`/farms/${farm.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFarmId(farm.id);
                }}
                className="block px-4 py-3 hover:bg-surface-hover"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {farm.name}
                  </span>
                  <VerificationBadge status={farm.verification_status} />
                </div>
                <div className="mt-1 text-sm text-muted">
                  {farm.region} · {farm.crop} · {farm.job_type}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <FarmBottomSheet
        farm={selectedFarm}
        onClose={() => setSelectedFarmId(null)}
      />
    </div>
  );
}
