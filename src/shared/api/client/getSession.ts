import { createClient } from '@/shared/lib';
import type { Session } from '@supabase/supabase-js';

/**
 * 현재 사용자 세션 조회
 * @returns 현재 세션 또는 null
 * @description Supabase 인증 세션 조회
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('세션 조회 실패:', error);
    throw error;
  }

  return data.session;
}

