'use client';

type WelcomeSectionProps = {
  nickname: string;
  statusMessage: string;
};

export const WelcomeSection = ({ nickname, statusMessage }: WelcomeSectionProps) => {
  return (
    <div className="space-y-4 text-center sm:text-left">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">dashboard</p>
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        어서오세요, {nickname}님.
      </h1>
      <p className="text-base text-slate-600">{statusMessage}</p>
      <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
        <div className="border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-400">진행 상황</p>
          <p className="text-lg font-semibold text-slate-900">3개의 만다라트가 진행 중</p>
        </div>
        <div className="border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-400">최근 업데이트</p>
          <p className="text-lg font-semibold text-slate-900">어제 · 오후 9시 12분</p>
        </div>
      </div>
    </div>
  );
};
