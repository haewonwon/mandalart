'use client';

import { useLogout } from '@/features/auth/model/useLogout';

export const LogoutButton = () => {
  const { logout, isLoading } = useLogout();

  return (
    <button
      onClick={logout}
      disabled={isLoading}
      className="rounded border border-red-200 bg-white px-4 py-2 font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
};
