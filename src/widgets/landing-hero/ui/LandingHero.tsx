'use client';

import { useAuthSession } from '@/features/auth/model/useAuthSession';
import { DynamicMandalartDemo } from '@/features/landing/dynamic-demo/ui/DynamicMandalartDemo';
import { MandalartBoard } from '@/widgets/mandalart-board/ui/MandalartBoard';
import Link from 'next/link';

export const LandingHero = () => {
  const { session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center py-16 text-sm text-slate-500">
        인증 상태를 확인하고 있습니다...
      </div>
    );
  }

  if (!session) {
    return (
      <section className="w-full py-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 md:flex-row md:items-center">
          <div className="flex-1 text-center md:text-left">
            <div className="mb-6">
              <p className="text-lg text-slate-500">WITH 08.MANDALART</p>
              <h1 className="mb-4 text-4xl font-semibold text-gray-900 md:text-5xl">
                당신의 가능성을 <br /> 무한으로 확장하세요.
              </h1>
            </div>
            <div className="flex justify-center md:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-gray-800 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
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
  }

  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center px-6 py-6">
      <div className="mx-auto w-full max-w-xl">
        <MandalartBoard />
      </div>
    </section>
  );
};
