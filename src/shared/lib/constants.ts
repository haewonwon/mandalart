import {
  MandalartCell,
  MandalartCenterGrid,
  MandalartGrid,
  MandalartSubGridKey,
} from '@/entities/mandalart/model/types';
import { v4 as uuidv4 } from 'uuid'; // 또는 nanoid

// 1. 빈 셀 하나를 만드는 함수
export const createEmptyCell = (id?: string): MandalartCell => ({
  id: id || uuidv4(),
  label: '',
  completed: false,
});

// 2. 빈 3x3 그리드(9칸)를 만드는 함수
export const createEmptyGrid = (): MandalartCenterGrid => {
  // Array.from으로 9개 채움 (타입 단언 필요)
  return Array.from({ length: 9 }).map(() => createEmptyCell()) as MandalartCenterGrid;
};

// 3. 전체 9x9 만다라트 초기 데이터
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
