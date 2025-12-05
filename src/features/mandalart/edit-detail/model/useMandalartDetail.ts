'use client';

import { useState } from 'react';
import type { MandalartCenterGrid, MandalartCell } from '@/entities/mandalart/model/types';

// 빈 서브 그리드 생성 헬퍼
const createEmptySubGrid = (idPrefix: string): MandalartCenterGrid => {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${idPrefix}-${i}`,
    label: '',
    completed: false,
  })) as MandalartCenterGrid;
};

export const useMandalartDetail = (mandalartId: string) => {
  // 초기값은 빈 그리드로 설정 (추후 API 연동 시 로딩 처리 필요)
  const [gridData, setGridData] = useState<MandalartCenterGrid>(createEmptySubGrid(mandalartId));
  const [isSaving, setIsSaving] = useState(false);

  const updateCell = (index: number, newValue: string) => {
    setGridData((prev) => {
      const next = [...prev] as MandalartCenterGrid;
      next[index] = { ...next[index], label: newValue };
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
    gridData,
    updateCell,
    saveChanges,
    isSaving,
  };
};
