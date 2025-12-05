'use client';

import { useState } from 'react';
import type { MandalartCenterGrid, MandalartCoreCell } from '@/entities/mandalart/model/types';

// Mock Data Generator
const createMockSubGrid = (id: string): MandalartCenterGrid => {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `cell-${id}-${i}`,
    label: i === 4 ? `목표 ${id}` : i % 2 === 0 ? `실천 계획 ${i + 1}` : '',
    completed: false,
    updatedAt: new Date().toISOString(),
  })) as MandalartCenterGrid;
};

export const useMandalartDetail = (mandalartId: string) => {
  // TODO: 실제로는 API를 통해 데이터를 가져와야 함
  const [gridData, setGridData] = useState<MandalartCenterGrid>(createMockSubGrid(mandalartId));
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
