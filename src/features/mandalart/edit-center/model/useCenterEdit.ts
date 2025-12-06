'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';
import { useAllMandalarts } from '@/features/mandalart/view/model/useAllMandalarts';
import type {
  MandalartCenterGrid,
  MandalartGrid,
  MandalartSubGridKey,
} from '@/entities/mandalart/model/types';
import { createEmptyGrid, createEmptyCell } from '@/shared/lib/constants';
import { determineVersionType } from '@/shared/lib/mandalart/versionType';

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

export const useCenterEdit = (selectedYear: number | null) => {
  const queryClient = useQueryClient();
  const { data: mandalarts = [], isLoading: isDataLoading } = useAllMandalarts();

  // 선택된 연도의 만다라트 필터링 (가장 최근 업데이트된 것)
  const mandalart = mandalarts
    .filter((m) => m.year === selectedYear)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  // 로컬 상태 (편집용)
  const [gridData, setGridData] = useState<MandalartGrid | null>(null);
  // 변경된 셀 추적 (버전 타입 판별용)
  const [changedCells, setChangedCells] = useState<Array<{ gridKey: 'center'; cellIndex: number }>>([]);

  // 초기 데이터 로드 시 상태 동기화
  useEffect(() => {
    if (mandalart?.current_version?.content) {
      setGridData(mandalart.current_version.content as MandalartGrid);
      setChangedCells([]); // 초기화
    }
  }, [mandalart]);

  const updateCenterCell = (index: number, newValue: string) => {
    if (!gridData) return;

    const subGridKey = INDEX_TO_SUBGRID_KEY[index];
    const currentCell = gridData.center[index];

    // 변경사항이 없으면 리턴
    if (currentCell.label === newValue) return;

    // 1. 하위 그리드가 존재하는지 확인
    const hasSubGrid =
      subGridKey &&
      gridData.subGrids &&
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
      if (!prev) return null;
      const next = { ...prev };
      // 중심 그리드 업데이트 (불변성 유지)
      const nextCenter = [...prev.center] as MandalartCenterGrid;
      nextCenter[index] = { ...nextCenter[index], label: newValue };
      next.center = nextCenter;

      // 하위 그리드 초기화
      if (shouldResetSubGrid && subGridKey) {
        next.subGrids = {
          ...next.subGrids,
          [subGridKey]: Array.from({ length: 9 }, (_, i) =>
            createEmptyCell(`${subGridKey}-${i}`)
          ) as MandalartCenterGrid,
        };
      }

      return next;
    });

    // 변경된 셀 추적
    setChangedCells((prev) => {
      const existing = prev.find((c) => c.cellIndex === index);
      if (existing) return prev;
      return [...prev, { gridKey: 'center', cellIndex: index }];
    });
  };

  const { mutate: saveChanges, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!gridData || !mandalart) throw new Error('저장할 데이터가 없습니다.');
      const supabase = createClient();

      // 변경된 셀들 중 가장 우선순위가 높은 타입 선택
      // 우선순위: EDIT_MAIN > EDIT_SUB > EDIT_TASK
      let versionType: 'EDIT_MAIN' | 'EDIT_SUB' | 'EDIT_TASK' = 'EDIT_SUB';
      for (const cell of changedCells) {
        const cellType = determineVersionType(cell.gridKey, cell.cellIndex);
        if (cellType === 'EDIT_MAIN') {
          versionType = 'EDIT_MAIN';
          break; // 가장 높은 우선순위
        }
        if (cellType === 'EDIT_SUB') {
          versionType = 'EDIT_SUB';
        }
        // EDIT_TASK는 기본값이 EDIT_SUB이므로 무시
      }

      // 새 버전 저장 (save_new_version RPC)
      const { error } = await supabase.rpc('save_new_version', {
        p_mandalart_id: mandalart.id,
        p_content: gridData,
        p_version_type: versionType,
        p_note: '핵심 목표 수정',
      });

      if (error) throw error;
      
      // 저장 성공 후 변경 추적 초기화
      setChangedCells([]);
    },
    onSuccess: () => {
      alert('성공적으로 저장되었습니다.');
      // 대시보드에도 반영되도록 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['recentMandalart'] });
      queryClient.invalidateQueries({ queryKey: ['allMandalarts'] });
      queryClient.invalidateQueries({ queryKey: ['mandalartVersions'] });
    },
    onError: (error: any) => {
      console.error(error);
      alert(error.message || '저장 중 오류가 발생했습니다.');
    },
  });

  return {
    centerGrid: gridData?.center || createEmptyGrid(),
    updateCenterCell,
    saveChanges,
    isSaving,
    isLoading: isDataLoading,
  };
};
