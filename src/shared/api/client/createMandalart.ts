import { createClient } from '@/shared/lib/supabase/client';
import type { MandalartGrid } from '@/entities/mandalart/model/types';
import { checkBanStatus } from '@/shared/lib/auth/checkBanStatus';

/**
 * @param params.title - 만다라트 제목
 * @param params.year - 만다라트 연도
 * @param params.initialContent - 만다라트 초기 내용 (MandalartGrid)
 * @returns Promise<string> - 생성된 만다라트 ID
 * @throws 로그인하지 않았거나 차단된 유저이거나 생성 실패 시 예외 발생
 * @description 새로운 만다라트 생성. 차단된 유저 사용 불가
 */
export const createMandalart = async (params: {
  title: string;
  year: number;
  initialContent: MandalartGrid;
}): Promise<string> => {
  const supabase = createClient();

  // 로그인 체크
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 차단 상태 체크
  const isBanned = await checkBanStatus(supabase, user.id);
  if (isBanned) {
    throw new Error('차단된 유저는 만다라트를 생성할 수 없습니다.');
  }

  const { data, error } = await supabase.rpc('create_mandalart', {
    p_title: params.title,
    p_year: params.year,
    p_initial_content: params.initialContent,
  });

  if (error) throw error;
  return data;
};
