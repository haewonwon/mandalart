'use client';

import { MiniGridPreview } from './MiniGridPreview';

export type MandalartCardProps = {
  id: string;
  title: string;
  status: string;
  gridPreview: Array<{ id: string; label: string }>;
};

export const MandalartCard = ({ title, status, gridPreview }: MandalartCardProps) => {
  return (
    <article className="flex h-full flex-col justify-between border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]">
      <header className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full border border-slate-200 px-3 py-2 text-slate-600">
          {status}
        </span>
      </header>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
        <MiniGridPreview cells={gridPreview} />
        <div className="flex w-full flex-col items-center gap-2 text-sm sm:w-auto sm:items-end">
          <button
            className="rounded-full border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
            type="button"
          >
            열어보기
          </button>
        </div>
      </div>
    </article>
  );
};
