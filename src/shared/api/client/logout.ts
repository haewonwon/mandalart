import { createClient } from '@/shared/lib/supabase/client';

/**
 * 사용자 로그아웃
 * @description Supabase 세션 종료
 */
export async function logout(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

