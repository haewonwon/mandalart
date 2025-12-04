'use client';

import { useAuthSession } from '@/features/auth/model/useAuthSession';
import { LoginButton } from '@/features/auth/ui/LoginButton';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
  const { session, isLoading } = useAuthSession();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/mandalart_logo.png" alt="08.MANDALART 로고" width={40} height={40} priority />
      </Link>
      <div className="flex items-center">
        {isLoading ? (
          <span className="text-sm text-slate-500">인증 상태를 확인하고 있습니다...</span>
        ) : session ? (
          <LogoutButton />
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
};
