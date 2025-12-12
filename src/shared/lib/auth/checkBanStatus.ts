import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * 유저의 차단 상태를 확인하는 공통 함수
 * @param supabase Supabase 클라이언트 (서버 또는 클라이언트)
 * @param userId 확인할 유저 ID
 * @returns 차단 여부 (true: 차단됨, false: 정상)
 */
export async function checkBanStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('차단 상태 확인 실패:', error);
      return false; // 에러 시 차단되지 않은 것으로 처리 (안전한 기본값)
    }

    return data?.is_banned === true;
  } catch (error) {
    console.error('차단 상태 확인 중 오류:', error);
    return false;
  }
}

