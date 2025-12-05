'use client';

import { useProfile } from '@/features/user/profile/model/useProfile';

type WelcomeSectionProps = {
  statusMessage: string;
};

export const WelcomeSection = ({ statusMessage }: WelcomeSectionProps) => {
  const { profile } = useProfile();

  return (
    <div className="space-y-4 text-center sm:text-left">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">dashboard</p>
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        어서오세요, {profile?.nickname}님.
      </h1>
      <p className="text-base text-slate-600">{statusMessage}</p>
      <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
        <div className="border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-400">진행 상황</p>
          <p className="text-lg font-semibold text-slate-900">-</p>
        </div>
        <div className="border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-400">최근 업데이트</p>
          <p className="text-lg font-semibold text-slate-900">-</p>
        </div>
      </div>
    </div>
  );
};
