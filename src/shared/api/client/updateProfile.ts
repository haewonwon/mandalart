import { createClient } from '@/shared/lib/supabase/client';

/**
 * 프로필 닉네임 업데이트
 * @param newNickname - 새로운 닉네임
 * @param userId - 업데이트할 사용자 ID
 * @returns Promise<string> - 업데이트된 닉네임
 * @throws 프로필 업데이트 실패 시 예외 발생
 * @description 프로필 닉네임 업데이트
 */
export const updateProfile = async (newNickname: string, userId: string): Promise<string> => {
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
