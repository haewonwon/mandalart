import { type MandalartCell, type MandalartCenterGrid, type MandalartGrid, type MandalartSubGridKey } from '@/entities/mandalart';
import { v4 as uuidv4 } from 'uuid'; // 또는 nanoid

/**
 * 빈 만다라트 셀 생성
 * @param id - 셀 ID (없으면 UUID 자동 생성)
 * @returns MandalartCell - 빈 셀 객체
 * @description 만다라트 셀의 기본 구조를 가진 빈 셀 생성
 */
export const createEmptyCell = (id?: string): MandalartCell => ({
  id: id || uuidv4(),
  label: '',
  completed: false,
});

/**
 * 빈 3x3 그리드 생성
 * @returns MandalartCenterGrid - 9개의 빈 셀로 구성된 그리드
 * @description 만다라트의 중앙 그리드 또는 서브 그리드 초기화
 */
export const createEmptyGrid = (): MandalartCenterGrid => {
  // Array.from으로 9개 채움 (타입 단언 필요)
  return Array.from({ length: 9 }).map(() => createEmptyCell()) as MandalartCenterGrid;
};

/**
 * 전체 9x9 만다라트 초기 데이터
 * @description 중앙 3x3 그리드와 8개의 서브 그리드로 구성된 빈 만다라트 구조
 */
export const INITIAL_MANDALART: MandalartGrid = {
  center: createEmptyGrid(),
  subGrids: {
    northWest: createEmptyGrid(),
    north: createEmptyGrid(),
    northEast: createEmptyGrid(),
    west: createEmptyGrid(),
    east: createEmptyGrid(),
    southWest: createEmptyGrid(),
    south: createEmptyGrid(),
    southEast: createEmptyGrid(),
  },
};
