'use client';

import { useGoogleLogin } from '@/features/auth/model/useGoogleLogin';
import { useModal } from '@/shared/hooks/useModal';
import { AlertModal } from '@/shared/ui/AlertModal';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
    <path
      fill="#EA4335"
      d="M24 9.5c3.18 0 5.37 1.38 6.6 2.53l4.82-4.71C32.7 4.04 28.83 2.5 24 2.5 14.94 2.5 7.14 7.98 4 16l5.93 4.61C11.13 13.94 17.03 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9.01h12.7c-.55 2.87-2.23 5.31-4.77 6.94l6.73 5.23C43.94 36.79 46.5 31.16 46.5 24.5z"
    />
    <path
      fill="#FBBC05"
      d="M9.93 28.39c-.45-1.34-.7-2.77-.7-4.24s.25-2.9.7-4.24L4 15.3C2.73 18.28 2 21.41 2 24.75s.73 6.47 2 9.45l5.93-4.81z"
    />
    <path
      fill="#34A853"
      d="M24 47c6.48 0 11.9-2.13 15.87-5.8l-6.73-5.23c-1.87 1.26-4.27 2-7.14 2-6.97 0-12.87-4.45-15.07-10.61L4 34.2C7.14 42.22 14.94 47 24 47z"
    />
  </svg>
);

export const GoogleLoginButton = () => {
  const modal = useModal();
  const { login, isLoading } = useGoogleLogin();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      modal.alert.show({
        type: 'error',
        message: 'Google 로그인에 실패했습니다.',
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
        aria-label="Google 계정으로 계속하기"
      >
        <GoogleIcon />
        {isLoading ? '계정 확인 중...' : 'Google 계정으로 시작하기'}
      </button>

      {/* Alert Modal */}
      <AlertModal
        isOpen={modal.alert.isOpen}
        onClose={modal.alert.hide}
        title={modal.alert.title}
        message={modal.alert.message}
        type={modal.alert.type}
      />
    </>
  );
};
