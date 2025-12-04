'use client';

import { useGoogleLogin } from '@/features/auth/model/useGoogleLogin';

export const LoginButton = () => {
  const { login, isLoading } = useGoogleLogin();

  return (
    <button
      onClick={login}
      disabled={isLoading}
      className="rounded border border-gray-300 bg-white px-4 py-2 font-normal text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? '로그인 중...' : 'Google로 계속하기'}
    </button>
  );
};
