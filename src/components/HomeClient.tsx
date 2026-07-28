'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import FarmMap from '@/components/FarmMap';
import VerificationBadge from '@/components/VerificationBadge';
import type { Farm } from '@/lib/types';

const ALL = '全部';

export default function HomeClient({ farms }: { farms: Farm[] }) {
  const [crop, setCrop] = useState(ALL);
  const [jobType, setJobType] = useState(ALL);

  const crops = useMemo(
    () => [ALL, ...Array.from(new Set(farms.map((f) => f.crop)))],
    [farms],
  );
  const jobTypes = useMemo(
    () => [ALL, ...Array.from(new Set(farms.map((f) => f.job_type)))],
    [farms],
  );

  const filteredFarms = useMemo(
    () =>
      farms.filter(
        (f) =>
          (crop === ALL || f.crop === crop) &&
          (jobType === ALL || f.job_type === jobType),
      ),
    [farms, crop, jobType],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">作物</span>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">工作類型</span>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {jobTypes.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </label>

        <span className="ml-auto text-sm text-slate-500">
          共 {filteredFarms.length} 筆農場
        </span>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="h-80 w-full border-b border-slate-200 md:h-auto md:w-1/2 md:border-b-0 md:border-r">
          <FarmMap farms={filteredFarms} />
        </div>

        <ul className="w-full divide-y divide-slate-200 overflow-y-auto md:w-1/2">
          {filteredFarms.length === 0 && (
            <li className="p-6 text-center text-sm text-slate-500">
              沒有符合篩選條件的農場
            </li>
          )}
          {filteredFarms.map((farm) => (
            <li key={farm.id}>
              <Link
                href={`/farms/${farm.id}`}
                className="block px-4 py-3 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">
                    {farm.name}
                  </span>
                  <VerificationBadge status={farm.verification_status} />
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {farm.region} · {farm.crop} · {farm.job_type}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
