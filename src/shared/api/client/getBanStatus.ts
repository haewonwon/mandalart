import { createClient } from '@/shared/lib';

/**
 * 현재 사용자의 차단 상태 확인
 * @returns 차단 여부 (true: 차단됨, false: 정상)
 * @description 사용자 프로필의 is_banned 필드 확인
 */
export async function getBanStatus(): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('is_banned')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('차단 상태 확인 실패:', error);
    return false;
  }

  return data?.is_banned === true;
}

