import { createClient } from '@/shared/lib';
import type { Mandalart } from '@/entities/mandalart';

/**
 * @returns Promise<Mandalart[]> - 사용자의 모든 만다라트 목록. 로그인하지 않았거나 에러 발생 시 빈 배열 반환
 * @description 현재 로그인한 사용자의 모든 만다라트 조회. 연도와 업데이트 날짜 기준 내림차순 정렬
 */
export const getAllMandalarts = async (): Promise<Mandalart[]> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('user_id', user.id)
    .order('year', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Mandalart Fetch Error:', error);
    return [];
  }

  return (data || []) as unknown as Mandalart[];
};
