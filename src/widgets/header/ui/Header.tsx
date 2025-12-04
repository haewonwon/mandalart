'use client';

import { useAuthSession } from '@/features/auth/model/useAuthSession';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const { session, isLoading } = useAuthSession();
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/mandalart_logo.svg" alt="08.MANDALART 로고" width={40} height={40} priority />
      </Link>
      <div className="flex items-center">
        {isLoading ? (
          <span className="text-sm text-slate-500">인증 상태를 확인하고 있습니다...</span>
        ) : session ? (
          <LogoutButton />
        ) : pathname === '/login' ? null : (
          <Link
            href="/login"
            className="rounded border border-gray-300 bg-white px-4 py-2 font-normal text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            LOGIN
          </Link>
        )}
      </div>
    </header>
  );
};
