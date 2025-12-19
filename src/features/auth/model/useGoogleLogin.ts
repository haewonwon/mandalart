'use client';

import { useMutation } from '@tanstack/react-query';
import { googleLogin as googleLoginApi } from '@/shared/api';

/**
 * Google OAuth 로그인 훅
 * @returns 로그인 함수 및 로딩 상태
 * @description React Query를 사용하여 Google 로그인 처리
 */
export const useGoogleLogin = () => {
  const { mutateAsync: login, isPending: isLoading } = useMutation({
    mutationFn: googleLoginApi,
    onError: (error) => {
      console.error('Login error:', error);
      // 에러는 상위 컴포넌트에서 Modal로 처리
    },
  });

  return {
    login,
    isLoading,
  };
};
