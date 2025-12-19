import { createClient } from '@/shared/lib';

/**
 * @param mandalartId - 삭제할 만다라트 ID
 * @returns Promise<void> - 성공 시 아무것도 반환하지 않음
 * @throws 만다라트 삭제 실패 시 예외 발생
 * @description 만다라트 삭제
 */
export const deleteMandalart = async (mandalartId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase.from('mandalarts').delete().eq('id', mandalartId);

  if (error) throw error;
};
