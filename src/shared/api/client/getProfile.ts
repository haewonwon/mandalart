import { createClient } from '@/shared/lib';
import type { Profile } from '@/entities/user';

/**
 * 현재 사용자의 프로필 조회
 * @returns Promise<{ user: any; profile: Profile | null }> - 사용자 및 프로필 정보. 로그인하지 않았으면 { user: null, profile: null } 반환
 * @description 현재 로그인한 사용자의 프로필 조회. DB에 없으면 Auth 정보로 임시 프로필 구성
 */
export const getProfile = async (): Promise<{ user: any; profile: Profile | null }> => {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, profile: null };
  }

  const { data: profileData, error: dbError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (dbError) {
    // Fallback: DB에 없으면 Auth 정보로 임시 구성
    return {
      user,
      profile: {
        id: user.id,
        email: user.email || '',
        nickname: user.user_metadata.full_name || '',
      } as Profile,
    };
  }

  return { user, profile: profileData as Profile };
};

