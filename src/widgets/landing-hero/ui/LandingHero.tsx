'use client';

import { DynamicMandalartDemo } from '@/features/landing/dynamic-demo/ui/DynamicMandalartDemo';
import Link from 'next/link';

export const LandingHero = () => {
  return (
    <section className="w-full py-10 sm:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">with MANDA</p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl md:text-5xl">
            당신의 가능성을 <br className="hidden md:block" />
            무한으로 확장하세요.
          </h1>
          <p className="text-base text-slate-500">
            목표를 큐브처럼 쌓아 올리고, 기록을 언제든 불러와 연결해 보세요.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              지금 시작하기
            </Link>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-6">
          <DynamicMandalartDemo />
        </div>
      </div>
    </section>
  );
};
