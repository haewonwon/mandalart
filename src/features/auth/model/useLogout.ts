import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
      // 에러가 발생하더라도 로그인 페이지로 이동하여 세션 종료 효과를 냄
      window.location.href = '/login';
    }
  };

  return {
    logout,
    isLoading,
  };
};
