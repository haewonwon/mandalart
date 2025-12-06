import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // localhost에서는 window.location.origin을 사용 (포트 번호 포함)
      // 프로덕션에서는 환경 변수 사용
      let redirectUrl: string;
      if (typeof window !== 'undefined') {
        // 클라이언트 사이드에서는 항상 현재 origin 사용 (localhost 포함)
        redirectUrl = `${window.location.origin}/auth/callback`;
      } else {
        // 서버 사이드에서는 환경 변수 사용
        redirectUrl = process.env.NEXT_PUBLIC_BASE_URL 
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
          : '/auth/callback';
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      // 에러는 상위 컴포넌트에서 Modal로 처리
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};
