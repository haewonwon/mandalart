'use client';

import { useQuery } from '@tanstack/react-query';
import { getIsAdmin } from '@/shared/api';

/**
 * 현재 사용자의 관리자 여부 확인 훅
 * @returns 관리자 여부 및 로딩 상태
 * @description React Query를 사용하여 관리자 권한 확인
 */
export const useIsAdmin = () => {
  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: getIsAdmin,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: false, // 실패 시 재시도 안 함
  });

  return { isAdmin, isLoading };
};
