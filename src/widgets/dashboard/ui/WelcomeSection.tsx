'use client';

import { useMemo } from 'react';
import { formatRelativeTime } from '@/shared/lib/date';
import { useProfile } from '@/features/user/profile/model/useProfile';
import { useAllMandalarts } from '@/features/mandalart/view/model/useAllMandalarts';
import type { MandalartCenterGrid, MandalartSubGridKey } from '@/entities/mandalart/model/types';

type WelcomeSectionProps = {
  count?: number;
  statusMessage?: string;
  lastUpdatedAt?: string;
  lastUpdatedYear?: number;
};

export const WelcomeSection = ({ statusMessage, lastUpdatedAt, lastUpdatedYear }: WelcomeSectionProps) => {
  // React Query에서 프로필 가져오기 (자동 갱신)
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { data: mandalarts = [], isLoading: isMandalartsLoading } = useAllMandalarts();
  
  // React Query의 데이터만 사용 (optimistic update가 즉시 반영되도록)
  const nickname = profile?.nickname || 'Guest';

  // 연도별 진행 중인 만다라트 개수 계산
  const progressByYear = useMemo(() => {
    const result: Record<number, number> = {};

    mandalarts.forEach((mandalart) => {
      const content = mandalart.current_version?.content as any;
      const centerGrid = content?.center as MandalartCenterGrid;
      const subGrids = content?.sub_grids || content?.subGrids || {};

      // 인덱스 -> 위치 Key 매핑
      const indexToKey: Record<number, MandalartSubGridKey> = {
        0: 'northWest',
        1: 'north',
        2: 'northEast',
        3: 'west',
        5: 'east',
        6: 'southWest',
        7: 'south',
        8: 'southEast',
      };

      let inProgressCount = 0;

      // 4번(중심)을 제외한 0~8번 셀 순회
      for (let i = 0; i < 9; i++) {
        if (i === 4) continue;

        const posKey = indexToKey[i];
        const subGrid = subGrids[posKey];
        const cell = centerGrid?.[i];

        if (!cell) continue;

        // 실천 과제 8개가 모두 작성되었는지 확인하는 함수 (인덱스 0-3, 5-8)
        const isAllTasksCompleted = (grid: MandalartCenterGrid): boolean => {
          const taskIndices = [0, 1, 2, 3, 5, 6, 7, 8]; // 4번(중심) 제외
          return taskIndices.every((idx) => grid[idx]?.label && grid[idx].label.trim() !== '');
        };

        // 진행 중인 경우만 카운트
        if (subGrid && isAllTasksCompleted(subGrid)) {
          inProgressCount++;
        }
      }

      if (inProgressCount > 0) {
        result[mandalart.year] = (result[mandalart.year] || 0) + inProgressCount;
      }
    });

    return result;
  }, [mandalarts]);

  const totalInProgress = Object.values(progressByYear).reduce((sum, count) => sum + count, 0);
  const years = Object.keys(progressByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-4 text-center sm:text-left">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">dashboard</p>
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        어서오세요, {isProfileLoading ? '...' : nickname}님.
      </h1>
      <p className="text-base text-slate-600">
        {statusMessage ||
          (totalInProgress === 0
            ? '현재 진행 중인 만다라트가 없습니다.'
            : `총 ${totalInProgress}개의 만다라트가 진행 중입니다.`)}
      </p>
      <div className="grid gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 sm:grid-cols-2">
        <div className="border border-slate-200 px-3 sm:px-4 py-2 sm:py-3">
          <p className="text-[10px] sm:text-xs text-slate-400">진행 상황</p>
          {isMandalartsLoading ? (
            <p className="text-lg font-semibold text-slate-900">-</p>
          ) : totalInProgress > 0 ? (
            <div className="space-y-1">
              {years.map((year) => (
                <p key={year} className="text-lg font-semibold text-slate-900">
                  {progressByYear[year]}개 진행 중
                  <span className="text-slate-400 text-sm ml-1">({year})</span>
                </p>
              ))}
            </div>
          ) : (
            <p className="text-lg font-semibold text-slate-900">-</p>
          )}
        </div>
        <div className="border border-slate-200 px-3 sm:px-4 py-2 sm:py-3">
          <p className="text-[10px] sm:text-xs text-slate-400">최근 업데이트</p>
            <p className="text-base sm:text-lg font-semibold text-slate-900">
              {lastUpdatedAt ? (
                <>
                  {formatRelativeTime(lastUpdatedAt)}
                  {lastUpdatedYear && 
                    <span className="text-slate-400 text-xs sm:text-sm ml-1">({lastUpdatedYear})</span>
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
