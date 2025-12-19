import { createClient, checkBanStatus } from '@/shared/lib';
import type { MandalartGrid, MandalartVersionType } from '@/entities/mandalart';

/**
 * 만다라트 버전 저장 (수정, 재배치 등)
 * @param params.mandalartId - 수정할 만다라트 ID
 * @param params.content - 수정된 만다라트 내용
 * @param params.versionType - 버전 타입 (EDIT_MAIN, EDIT_SUB, EDIT_TASK, REORDER)
 * @param params.note - 버전 메모 (선택사항)
 * @returns Promise<void> - 성공 시 아무것도 반환하지 않음
 * @throws 로그인하지 않았거나 차단된 유저이거나 저장 실패 시 예외 발생
 * @description 만다라트 버전 저장 (수정, 재배치). 차단된 유저 사용 불가
 */
export const updateMandalart = async (params: {
  mandalartId: string;
  content: MandalartGrid;
  versionType: MandalartVersionType;
  note?: string;
}): Promise<void> => {
  const supabase = createClient();

  // 로그인 체크
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 차단 상태 체크
  const isBanned = await checkBanStatus(supabase, user.id);
  if (isBanned) {
    throw new Error('차단된 유저는 만다라트를 수정할 수 없습니다.');
  }

  const { error } = await supabase.rpc('save_new_version', {
    p_mandalart_id: params.mandalartId,
    p_content: params.content,
    p_version_type: params.versionType,
    p_note: params.note || '',
  });

  if (error) throw error;
};
