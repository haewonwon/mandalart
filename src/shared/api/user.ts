import { createClient } from '@/shared/lib/supabase/client';
import type { Profile } from '@/entities/user/model/types';

/**
 * 현재 사용자의 프로필 조회
 */
export const fetchProfile = async (): Promise<{ user: any; profile: Profile | null }> => {
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

/**
 * 프로필 닉네임 업데이트
 */
export const updateProfileNickname = async (newNickname: string, userId: string): Promise<string> => {
  const supabase = createClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: newNickname,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
  return newNickname;
};

