import { createClient } from '@/shared/lib';

/**
 * 공유용 만다라트 조회 (인증 불필요, 작성자 프로필 포함)
 * @param mandalartId - 조회할 만다라트 ID
 * @returns Promise<{ id: string; year: number; user_id: string; current_version: any; author: { nickname: string } } | null> - 만다라트 정보 및 작성자 닉네임. 데이터가 없으면 null 반환
 * @throws 만다라트 조회 실패 또는 버전 정보 없음 시 예외 발생
 * @description 공유 페이지용 만다라트 조회. 인증 불필요. 작성자 닉네임 포함
 */
export const getMandalartForShare = async (
  mandalartId: string
): Promise<{
  id: string;
  year: number;
  user_id: string;
  current_version: any;
  author: { nickname: string };
} | null> => {
  const supabase = createClient();

  // 만다라트 조회 (maybeSingle 사용하여 결과가 없어도 에러 발생하지 않음)
  const { data: mandalartData, error: mandalartError } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('id', mandalartId)
    .maybeSingle();

  if (mandalartError) {
    console.error('Mandalart fetch error:', mandalartError);
    throw mandalartError;
  }

  if (!mandalartData) {
    return null;
  }

  // current_version이 없으면 에러
  if (!mandalartData.current_version) {
    throw new Error('만다라트 버전 정보를 찾을 수 없습니다.');
  }

  // 작성자 프로필 정보 조회 (maybeSingle 사용)
  let authorNickname = '익명';
  if (mandalartData?.user_id) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', mandalartData.user_id)
      .maybeSingle();

    // 프로필이 없어도 에러가 아니므로 계속 진행
    if (!profileError && profileData) {
      authorNickname = profileData.nickname || '익명';
    }
  }

  return {
    ...mandalartData,
    author: { nickname: authorNickname },
  } as any;
};
