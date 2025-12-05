'use client';

import { useAuthSession } from '@/features/auth/model/useAuthSession';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { ProfileModal } from '@/features/user/profile/ui/ProfileModal';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { User as UserIcon } from 'lucide-react';

export const Header = () => {
  const { session, isLoading } = useAuthSession();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-nowrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/mandalart_logo.svg"
              alt="08.MANDALART 로고"
              width={36}
              height={36}
              priority
              className="h-10 w-10 shrink-0"
            />
          </Link>

          <div className="flex shrink-0 items-center justify-end gap-2">
            {isLoading ? (
              <span className="text-sm text-slate-500">LOADING</span>
            ) : session ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
                  title="내 프로필"
                >
                  <UserIcon size={20} />
                </button>
                <LogoutButton />
              </>
            ) : pathname === '/login' ? null : (
              <Link
                href="/login"
                className="whitespace-nowrap rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 프로필 모달 */}
      {session && <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />}
    </>
  );
};
