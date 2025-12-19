'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAllMandalarts } from '@/features/mandalart/view/model/useAllMandalarts';
import type {
  MandalartCenterGrid,
  MandalartGrid,
  MandalartSubGridKey,
} from '@/entities/mandalart/model/types';
import { createEmptyGrid, createEmptyCell } from '@/shared/lib/constants';
import { determineVersionType } from '@/shared/lib/mandalart/versionType';
import { updateMandalart } from '@/shared/api';

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
  const router = useRouter();
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

  const updateCenterCell = (
    index: number,
    newValue: string,
    onNeedsConfirm?: () => void
  ) => {
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

    // 2. 하위 그리드가 있다면 상위 컴포넌트에서 확인 받기
    if (hasSubGrid && onNeedsConfirm) {
      onNeedsConfirm(); // 상위에서 확인 받도록 콜백 호출
      return; // 확인 후 applyUpdateWithReset이 호출될 때까지 대기
    }

    // 3. 하위 그리드가 없거나 확인이 필요 없는 경우 바로 업데이트
    applyUpdateWithReset(index, newValue, false);
  };

  const { mutate, mutateAsync, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!gridData || !mandalart) throw new Error('저장할 데이터가 없습니다.');

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

      // API 호출 (차단 체크는 API 내부에서 처리)
      try {
        await updateMandalart({
          mandalartId: mandalart.id,
          content: gridData,
          versionType,
          note: '핵심 목표 수정',
        });
      } catch (error: any) {
        // 차단 에러인 경우 리다이렉트
        if (error.message?.includes('차단된 유저')) {
          router.push('/banned');
        }
        throw error;
      }
      
      // 저장 성공 후 변경 추적 초기화
      setChangedCells([]);
    },
    onSuccess: () => {
      // 성공 메시지는 상위 컴포넌트에서 Modal로 처리
      // 대시보드에도 반영되도록 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['recentMandalart'] });
      queryClient.invalidateQueries({ queryKey: ['allMandalarts'] });
      queryClient.invalidateQueries({ queryKey: ['mandalartVersions'] });
    },
    onError: (error: any) => {
      console.error(error);
      // 에러는 상위 컴포넌트에서 Modal로 처리
    },
  });

  // 하위 그리드 초기화를 위한 내부 함수
  const applyUpdateWithReset = (index: number, newValue: string, shouldReset: boolean) => {
    if (!gridData) return;
    const subGridKey = INDEX_TO_SUBGRID_KEY[index];

    setGridData((prev) => {
      if (!prev) return null;
      const next = { ...prev };
      const nextCenter = [...prev.center] as MandalartCenterGrid;
      nextCenter[index] = { ...nextCenter[index], label: newValue };
      next.center = nextCenter;

      if (shouldReset && subGridKey) {
        next.subGrids = {
          ...next.subGrids,
          [subGridKey]: Array.from({ length: 9 }, (_, i) =>
            createEmptyCell(`${subGridKey}-${i}`)
          ) as MandalartCenterGrid,
        };
      }

      return next;
    });

    setChangedCells((prev) => {
      const existing = prev.find((c) => c.cellIndex === index);
      if (existing) return prev;
      return [...prev, { gridKey: 'center', cellIndex: index }];
    });
  };

  return {
    centerGrid: gridData?.center || createEmptyGrid(),
    updateCenterCell,
    applyUpdateWithReset,
    saveChanges: mutate,
    saveChangesAsync: mutateAsync,
    isSaving,
    isLoading: isDataLoading,
  };
};
