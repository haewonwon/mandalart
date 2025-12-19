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
    staleTime: 1000 * 60, // 1분간 캐시 유지
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
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
