import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.NEXT_PUBLIC_BASE_URL + '/auth/callback',
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
