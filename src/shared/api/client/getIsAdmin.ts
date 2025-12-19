import { createClient } from '@/shared/lib/supabase/client';

/**
 * 현재 사용자의 관리자 여부 확인
 * @returns 관리자 여부 (true: 관리자, false: 일반 사용자)
 * @description 사용자 프로필의 is_admin 필드 확인
 */
export async function getIsAdmin(): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('관리자 권한 확인 실패:', profileError);
    return false;
  }

  return profile?.is_admin === true;
}

