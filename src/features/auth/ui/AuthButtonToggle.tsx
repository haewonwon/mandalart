'use client';

import { LoginButton } from '@/features/auth/ui/LoginButton';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { useAuthSession } from '@/features/auth/model/useAuthSession';

export const AuthButtonToggle = () => {
  const { session, isLoading } = useAuthSession();

  if (isLoading) {
    return <div className="text-sm text-slate-500">인증 상태를 확인하고 있습니다...</div>;
  }

  return session ? <LogoutButton /> : <LoginButton />;
};
