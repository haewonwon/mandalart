'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/shared/api';
import type { AdminStats } from '@/shared/api/client/getAdminStats';

/**
 * 관리자 대시보드 통계 조회 훅
 * @returns 관리자 통계 데이터 및 로딩 상태
 * @description React Query를 사용하여 관리자 통계 조회
 */
export const useAdminStats = () => {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    // 관리자 페이지는 자주 열리지 않으므로 넉넉하게 캐시하고 자동 재조회는 사용하지 않음
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    refetchOnWindowFocus: false,
  });

  return {
    stats: stats ?? {
      userCount: 0,
      mandalartCount: 0,
      todaySignups: 0,
      pendingTickets: 0,
    },
    isLoading,
  };
};
