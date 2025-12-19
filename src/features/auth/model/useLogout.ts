'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '@/shared/api';

/**
 * 사용자 로그아웃 훅
 * @returns 로그아웃 함수 및 로딩 상태
 * @description React Query를 사용하여 로그아웃 처리 및 세션 캐시 무효화
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // 모든 쿼리 캐시 무효화
      queryClient.clear();
      // 로그인 페이지로 이동
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // 에러가 발생하더라도 로그인 페이지로 이동하여 세션 종료 효과를 냄
      queryClient.clear();
      window.location.href = '/login';
    },
  });

  return {
    logout,
    isLoading,
  };
};
