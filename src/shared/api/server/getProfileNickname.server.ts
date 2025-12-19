import { createServerClient } from '@/shared/lib';

/**
 * 서버 사이드: 프로필 닉네임 조회
 * @param userId - 조회할 사용자 ID
 * @returns Promise<string | null> - 프로필 닉네임. 데이터가 없거나 에러 발생 시 null 반환
 * @description 서버 컴포넌트용 프로필 닉네임 조회
 */
export const getProfileNickname = async (userId: string): Promise<string | null> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data?.nickname || null;
};
