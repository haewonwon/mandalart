import { createServerClient } from '@/shared/lib';
import type { Mandalart } from '@/entities/mandalart';

/**
 * 서버 사이드: 사용자의 모든 만다라트 조회
 * @param userId - 조회할 사용자 ID
 * @returns Promise<Mandalart[]> - 사용자의 모든 만다라트 목록. 에러 발생 시 빈 배열 반환
 * @description 서버 컴포넌트용 만다라트 조회. 연도 기준 내림차순 정렬
 */
export const getMandalarts = async (userId: string): Promise<Mandalart[]> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('user_id', userId)
    .order('year', { ascending: false });

  if (error) {
    console.error('Mandalart Fetch Error:', error);
    return [];
  }

  return (data || []) as unknown as Mandalart[];
};
