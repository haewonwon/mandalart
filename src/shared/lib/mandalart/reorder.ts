import {
  MandalartGrid,
  MandalartSubGridKey,
  MandalartCenterGrid,
} from '@/entities/mandalart/model/types';

// 1. 만다라트의 물리적 순서 (인덱스 0 ~ 8)
// 이 순서는 변하지 않는 '좌석'입니다.
const PHYSICAL_ORDER: (MandalartSubGridKey | 'center')[] = [
  'northWest',
  'north',
  'northEast',
  'west',
  'center',
  'east',
  'southWest',
  'south',
  'southEast',
];

// 2. 키(Key)를 인덱스(Number)로 바꿔주는 헬퍼
// 예: 'north' -> 1
const getIndexByKey = (key: MandalartSubGridKey | 'center'): number => {
  return PHYSICAL_ORDER.indexOf(key);
};

/**
 * 만다라트 그리드 재배치
 * @param originalData - 기존 만다라트 전체 데이터
 * @param newOrder - 사용자가 드래그해서 바꾼 키의 순서 배열 (예: ['south', 'north', ...])
 * @returns 재배치된 MandalartGrid
 * @description 드래그앤드롭으로 변경된 순서에 따라 중앙 그리드와 서브 그리드 재배치
 */
export const reorderMandalartGrid = (
  originalData: MandalartGrid,
  newOrder: (MandalartSubGridKey | 'center')[]
): MandalartGrid => {
  // 새로운 껍데기 준비
  const newCenter = [...originalData.center]; // 일단 복사 (타입 유지)
  const newSubGrids = { ...originalData.subGrids }; // 일단 복사

  // 0번 자리(좌상단)부터 8번 자리(우하단)까지 루프를 돕니다.
  PHYSICAL_ORDER.forEach((targetKey, targetIndex) => {
    // 1. 현재 타겟 자리에 사용자가 갖다 놓은 '원래 키(Source)'가 무엇인가?
    const sourceKey = newOrder[targetIndex];

    // 2. '원래 키'가 원래 있던 '원래 인덱스'를 찾습니다.
    const sourceIndex = getIndexByKey(sourceKey);

    // --- A. Center Grid 재배치 (핵심) ---
    // 타겟 자리(targetIndex)에 원래 소스 자리(sourceIndex)의 데이터를 넣습니다.
    // 예: 0번 자리에 원래 7번(South)에 있던 '재테크' 셀을 넣음.
    newCenter[targetIndex] = originalData.center[sourceIndex];

    // --- B. Sub Grids 재배치 ---
    // 'center'는 서브 그리드가 없으므로 건너뜁니다.
    if (targetKey !== 'center' && sourceKey !== 'center') {
      // 타겟 키(예: 'northWest')에 소스 키(예: 'south')의 서브 그리드를 연결합니다.
      // 데이터가 없으면(undefined) 그대로 둠 (또는 빈 그리드)
      const sourceSubGrid = originalData.subGrids?.[sourceKey];

      if (sourceSubGrid) {
        newSubGrids[targetKey] = sourceSubGrid;
      } else {
        // 원래 데이터가 없었다면, 이동한 자리도 비워줍니다.
        // (delete를 쓰거나 undefined 할당)
        delete newSubGrids[targetKey];
      }
    }
  });

  return {
    center: newCenter as MandalartCenterGrid,
    subGrids: newSubGrids,
  };
};
