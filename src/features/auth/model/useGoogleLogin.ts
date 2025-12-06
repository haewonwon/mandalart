import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // 프로덕션 환경에서도 동작하도록 환경 변수가 없으면 현재 origin 사용
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Google 로그인 실패!');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};
