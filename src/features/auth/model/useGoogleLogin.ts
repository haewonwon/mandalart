import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { getAuthRedirectUrl } from '@/shared/lib/environment';

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const redirectUrl = getAuthRedirectUrl();
      
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
