import { type MandalartVersionType, type MandalartSubGridKey } from '@/entities/mandalart';

/**
 * 수정된 칸의 위치를 기반으로 버전 타입 판별
 * @param gridKey - 수정된 그리드의 키 ('center' 또는 'north', 'east' 등)
 * @param cellIndex - 수정된 셀의 인덱스 (0 ~ 8)
 * @returns 버전 타입 (EDIT_MAIN | EDIT_SUB | EDIT_TASK)
 * @description 셀 위치에 따라 핵심 목표/세부 목표/실천 과제 구분
 */
export const determineVersionType = (
  gridKey: MandalartSubGridKey | 'center',
  cellIndex: number
): MandalartVersionType => {
  // 1. Center Grid (중앙 3x3)에서 수정이 일어난 경우
  if (gridKey === 'center') {
    // 정중앙(인덱스 4)은 만다라트 전체의 '핵심 목표'
    if (cellIndex === 4) return 'EDIT_MAIN';

    // Center의 나머지 칸들은 '세부 목표' (Sub Grid의 주인)
    return 'EDIT_SUB';
  }
  // 2. Sub Grid (주변 8개 그리드)에서 수정이 일어난 경우
  else {
    // Sub Grid의 정중앙(인덱스 4)은 Center의 세부 목표와 같은 내용임 -> '세부 목표' 취급
    if (cellIndex === 4) return 'EDIT_SUB';
    // Sub Grid의 나머지 가장자리 칸들은 실제 행동 -> '실천 과제'
    return 'EDIT_TASK';
  }
};
