'use client';

import { createClient } from '@/shared/lib';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Ban } from 'lucide-react';

export default function BannedPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Ban size={32} className="text-red-600" />
        </div>

        <h1 className="mb-3 text-center text-2xl font-bold text-slate-900">
          접속이 차단되었습니다
        </h1>

        <p className="mb-8 text-center text-slate-600 leading-relaxed">
          운영 정책 위반으로 인해 서비스 이용이 제한되었습니다.
          <br />
          문의사항이 있다면 관리자에게 연락해 주세요.
        </p>

        <div className="space-y-3">
          <Link
            href="/feedback"
            className="block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-white font-medium transition hover:bg-slate-800"
          >
            관리자에게 문의하기
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 font-medium transition hover:bg-slate-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </main>
  );
}
