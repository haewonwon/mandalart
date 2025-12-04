import { AuthButtonToggle } from '@/features/auth/ui/AuthButtonToggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-10 text-slate-900">
      <h1 className="text-3xl font-semibold">만달아트</h1>
      <p className="mt-4 text-base text-slate-600">
        필요한 컴포넌트를 자유롭게 추가해 홈 화면을 구성해 주세요.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4">
        <AuthButtonToggle />
      </div>
    </main>
  );
}
