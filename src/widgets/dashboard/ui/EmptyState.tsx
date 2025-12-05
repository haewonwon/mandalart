'use client';

import Link from 'next/link';

export const EmptyState = () => {
  return (
    <div className="border border-dashed border-slate-300 bg-white px-8 py-12 text-center">
      <h3 className="text-2xl font-semibold text-slate-900">새로운 만다라트를 시작해 보세요.</h3>
      <p className="mt-3 text-base text-slate-500">
        시작이 반입니다. 지금 바로 첫 번째 목표를 세워보세요.
      </p>
      <Link
        href="/mandalart/new"
        className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
      >
        + 새 만다라트 만들기
      </Link>
    </div>
  );
};
