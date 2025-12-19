import { createClient } from '@/shared/lib';
import type { MandalartVersion } from '@/entities/mandalart';

/**
 * 특정 만다라트의 모든 버전 조회
 * @param mandalartId - 조회할 만다라트 ID
 * @returns Promise<MandalartVersion[]> - 만다라트 버전 목록. 로그인하지 않았거나 에러 발생 시 빈 배열 반환
 * @description 특정 만다라트의 모든 버전 조회. 버전 번호 기준 내림차순 정렬
 */
export const getMandalartVersions = async (mandalartId: string): Promise<MandalartVersion[]> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('mandalart_versions')
    .select('*')
    .eq('mandalart_id', mandalartId)
    .order('version', { ascending: false });

  if (error) {
    console.error('Mandalart Versions Fetch Error:', error);
    return [];
  }

  return (data || []) as MandalartVersion[];
};
