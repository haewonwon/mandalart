import { createClient } from '@/shared/lib/supabase/client';
import { getAuthRedirectUrl } from '@/shared/lib/environment';

/**
 * Google OAuth 로그인
 * @description Google 계정으로 로그인 시작
 */
export async function googleLogin(): Promise<void> {
  const supabase = createClient();
  const redirectUrl = getAuthRedirectUrl();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error('Login error:', error);
    throw error;
  }
}

