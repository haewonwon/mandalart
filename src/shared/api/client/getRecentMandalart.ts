import { createClient } from '@/shared/lib';
import type { Mandalart } from '@/entities/mandalart';

/**
 * 가장 최근에 업데이트된 만다라트 1개 조회
 * @returns Promise<Mandalart | null> - 가장 최근 만다라트. 로그인하지 않았거나 데이터가 없으면 null 반환
 * @throws 만다라트 조회 실패 시 예외 발생 (데이터 없음 제외)
 * @description 현재 로그인한 사용자의 만다라트 중 가장 최근에 업데이트된 1개 조회
 */
export const getRecentMandalart = async (): Promise<Mandalart | null> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // 데이터가 없는 경우 (PGRST116) null 반환
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as Mandalart;
};
