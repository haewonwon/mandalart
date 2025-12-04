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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:max-w-8xl sm:flex-nowrap sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/mandalart_logo.svg"
            alt="08.MANDALART 로고"
            width={36}
            height={36}
            priority
            className="h-10 w-10"
          />
        </Link>

        <div className="flex shrink-0 items-center justify-end">
          {isLoading ? (
            <span className="text-sm text-slate-500">LOADING</span>
          ) : session ? (
            <LogoutButton />
          ) : pathname === '/login' ? null : (
            <Link
              href="/login"
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
