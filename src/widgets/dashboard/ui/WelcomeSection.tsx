'use client';

import { formatRelativeTime } from '@/shared/lib/date';
import { useProfile } from '@/features/user/profile/model/useProfile';

type WelcomeSectionProps = {
  count?: number;
  statusMessage?: string;
  lastUpdatedAt?: string;
  lastUpdatedYear?: number;
};

export const WelcomeSection = ({ count = 0, statusMessage, lastUpdatedAt, lastUpdatedYear }: WelcomeSectionProps) => {
  // React Query에서 프로필 가져오기 (자동 갱신)
  const { profile, isLoading: isProfileLoading } = useProfile();
  
  // React Query의 데이터만 사용 (optimistic update가 즉시 반영되도록)
  const nickname = profile?.nickname || 'Guest';

  return (
    <div className="space-y-4 text-center sm:text-left">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">dashboard</p>
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        어서오세요, {isProfileLoading ? '...' : nickname}님.
      </h1>
      <p className="text-base text-slate-600">
        {statusMessage ||
          (count === 0
            ? '현재 진행 중인 만다라트가 없습니다.'
            : `총 ${count}개의 만다라트가 기록되었습니다.`)}
      </p>
      <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
        <div className="border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-400">진행 상황</p>
          <p className="text-lg font-semibold text-slate-900">
            {count > 0 ? `${count}개의 만다라트 진행 중` : '-'}
          </p>
        </div>
        <div className="border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-400">최근 업데이트</p>
          <p className="text-lg font-semibold text-slate-900">
            {lastUpdatedAt ? (
              <>
                {formatRelativeTime(lastUpdatedAt)}
                {lastUpdatedYear && 
                  <span className="text-slate-400 text-sm ml-1">({lastUpdatedYear})</span>
                }
              </>
            ) : (
              '-'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
