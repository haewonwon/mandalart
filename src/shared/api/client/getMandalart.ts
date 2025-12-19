import { createClient } from '@/shared/lib';
import type { Mandalart } from '@/entities/mandalart';

/**
 * 특정 만다라트 조회 (ID로)
 * @param mandalartId - 조회할 만다라트 ID
 * @returns Promise<Mandalart | null> - 만다라트 정보. 데이터가 없으면 null 반환
 * @throws 만다라트 조회 실패 시 예외 발생 (데이터 없음 제외)
 * @description ID로 특정 만다라트 조회. 인증 불필요
 */
export const getMandalart = async (mandalartId: string): Promise<Mandalart | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('id', mandalartId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as Mandalart;
};
