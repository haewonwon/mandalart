import { GoogleLoginButton } from '@/features/auth/ui/GoogleLoginButton';

export const LoginPage = () => {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 sm:py-16">
      <section className="flex w-full max-w-5xl flex-col gap-10 border border-slate-200 bg-white px-6 py-10 sm:px-10 sm:py-12 lg:grid lg:grid-cols-[1.1fr,0.9fr] lg:gap-12">
        <div className="space-y-5 text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">login</p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            지금 바로 시작해 보세요.
          </h1>
          <p className="text-base text-slate-600">
            이것저것 입력할 필요 없이 Google 계정 하나로 바로 시작할 수 있어요.
          </p>
          <div className="flex justify-center lg:justify-start">
            <ul className="list-disc list-inside space-y-2 text-left text-sm text-slate-500">
              <li>언제 어디서나 이어지는 편집</li>
              <li>링크로 공유하는 나의 포부</li>
              <li>한눈에 들어오는 성취 현황</li>
            </ul>
          </div>
        </div>

        <div className="border border-slate-100 bg-slate-50/60 px-6 py-8 sm:px-8 sm:py-10">
          <GoogleLoginButton />

          <p className="mt-6 text-center text-xs text-slate-500">
            계속 진행하면 서비스 이용약관과 개인정보처리방침에 동의한 것으로 간주됩니다.
          </p>
        </div>
      </section>
    </main>
  );
};
