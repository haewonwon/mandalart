import { useQuery } from '@tanstack/react-query';
import { getAllMandalarts } from '@/shared/api';

/**
 * 전체 만다라트 목록 조회 훅
 * @description 상세 페이지(전체 보기, 핵심 편집 등)에서만 사용되는 무거운 쿼리
 */
export const useAllMandalarts = () => {
  return useQuery({
    queryKey: ['allMandalarts'],
    queryFn: getAllMandalarts,
    // 무거운 쿼리이므로 자주 재조회하지 않고, 포커스 전환 시에도 재요청하지 않음
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
