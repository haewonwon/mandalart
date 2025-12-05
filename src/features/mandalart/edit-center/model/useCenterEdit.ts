'use client';

import { useState } from 'react';
import type {
  MandalartCenterGrid,
  MandalartGrid,
  MandalartSubGridKey,
} from '@/entities/mandalart/model/types';

// 인덱스와 서브 그리드 키 매핑
const INDEX_TO_SUBGRID_KEY: Partial<Record<number, MandalartSubGridKey>> = {
  0: 'northWest',
  1: 'north',
  2: 'northEast',
  3: 'west',
  5: 'east',
  6: 'southWest',
  7: 'south',
  8: 'southEast',
};

// Mock Data 생성기
const createMockData = (): MandalartGrid => {
  const createCells = (prefix: string) =>
    Array.from({ length: 9 }, (_, i) => ({
      id: `${prefix}-${i}`,
      label: i === 4 ? `${prefix} 중심` : `${prefix} 목표 ${i + 1}`,
      completed: false,
      updatedAt: new Date().toISOString(),
    }));

  return {
    center: createCells('Main') as any,
    subGrids: {
      northWest: createCells('NW'), // 존재하는 하위 그리드 예시
      north: [], // 비어있는 하위 그리드 예시
    } as any,
  };
};

export const useCenterEdit = () => {
  const [gridData, setGridData] = useState<MandalartGrid>(createMockData());
  const [isSaving, setIsSaving] = useState(false);

  const updateCenterCell = (index: number, newValue: string) => {
    const subGridKey = INDEX_TO_SUBGRID_KEY[index];
    const currentCell = gridData.center[index];

    // 변경사항이 없으면 리턴
    if (currentCell.label === newValue) return;

    // 1. 하위 그리드가 존재하는지 확인 (값이 변경되었을 때만)
    const hasSubGrid =
      subGridKey &&
      gridData.subGrids[subGridKey] &&
      gridData.subGrids[subGridKey]!.some((cell) => cell.label.trim() !== '');

    let shouldResetSubGrid = false;

    // 2. 하위 그리드가 있다면 사용자에게 물어봄
    if (hasSubGrid) {
      const message =
        `'${currentCell.label}' 목표는 이미 확장된 만다라트가 존재합니다.\n\n` +
        `확인을 누르면 하위 만다라트가 초기화됩니다.\n` +
        `취소를 누르면 하위 만다라트는 유지되고 제목만 변경됩니다.`;

      shouldResetSubGrid = window.confirm(message);
    }

    // 3. 상태 업데이트
    setGridData((prev) => {
      const next = { ...prev };
      // 중심 그리드 업데이트
      const nextCenter = [...prev.center] as MandalartCenterGrid;
      nextCenter[index] = { ...nextCenter[index], label: newValue };
      next.center = nextCenter;

      // 하위 그리드 초기화 (사용자가 확인을 눌렀을 경우)
      if (shouldResetSubGrid && subGridKey) {
        // 해당 서브 그리드를 빈 배열(또는 초기화된 상태)로 변경
        next.subGrids = {
          ...next.subGrids,
          [subGridKey]: Array.from({ length: 9 }, (_, i) => ({
            id: `${subGridKey}-${i}`,
            label: '',
            completed: false,
            updatedAt: new Date().toISOString(),
          })),
        };
      }

      return next;
    });
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // TODO: Supabase 저장 로직 연동
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('성공적으로 저장되었습니다.');
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    centerGrid: gridData.center,
    updateCenterCell,
    saveChanges,
    isSaving,
  };
};
