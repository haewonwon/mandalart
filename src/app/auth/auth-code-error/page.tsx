'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">인증 오류</h1>
          <p className="mt-2 text-sm text-slate-600">
            로그인 처리 중 문제가 발생했습니다.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-700">오류 코드: {error}</p>
            {errorDescription && (
              <p className="mt-1 text-xs text-red-500">{errorDescription}</p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-800"
          >
            로그인 페이지로 돌아가기
          </Link>
          <Link
            href="/"
            className="block w-full rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            홈으로 가기
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            문제가 계속되면 관리자에게 문의해주세요.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">인증 오류</h1>
            <p className="mt-2 text-sm text-slate-600">
              로그인 처리 중 문제가 발생했습니다.
            </p>
          </div>
        </div>
      </main>
    }>
      <ErrorContent />
    </Suspense>
  );
}

