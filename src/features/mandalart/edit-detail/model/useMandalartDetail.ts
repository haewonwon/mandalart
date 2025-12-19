'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { MandalartCenterGrid, MandalartCell, MandalartSubGridKey, MandalartGrid } from '@/entities/mandalart/model/types';
import { createEmptyGrid } from '@/shared/lib/constants';
import { getMandalart, updateMandalart } from '@/shared/api';

// 빈 서브 그리드 생성 헬퍼
const createEmptySubGrid = (idPrefix: string): MandalartCenterGrid => {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${idPrefix}-${i}`,
    label: '',
    completed: false,
  })) as MandalartCenterGrid;
};

// id 파싱: "mandalartId-posKey" 또는 "mandalartId-posKey-draft" 형태
const parseDetailId = (id: string | undefined): { mandalartId: string; posKey: MandalartSubGridKey | null } => {
  if (!id) {
    return { mandalartId: '', posKey: null };
  }

  const validPosKeys: MandalartSubGridKey[] = ['northWest', 'north', 'northEast', 'west', 'east', 'southWest', 'south', 'southEast'];
  
  // 마지막 부분이 유효한 posKey인지 확인
  const parts = id.split('-');
  const lastPart = parts[parts.length - 1];
  const secondLastPart = parts.length > 1 ? parts[parts.length - 2] : null;
  
  // "draft"가 마지막에 있는 경우
  if (lastPart === 'draft' && secondLastPart && validPosKeys.includes(secondLastPart as MandalartSubGridKey)) {
    const posKey = secondLastPart as MandalartSubGridKey;
    const mandalartId = parts.slice(0, -2).join('-');
    return { mandalartId, posKey };
  }
  
  // 마지막 부분이 유효한 posKey인 경우
  if (validPosKeys.includes(lastPart as MandalartSubGridKey)) {
    const posKey = lastPart as MandalartSubGridKey;
    const mandalartId = parts.slice(0, -1).join('-');
    return { mandalartId, posKey };
  }
  
  // 유효한 posKey가 없는 경우 (기존 만다라트 ID만 전달된 경우)
  return { mandalartId: id, posKey: null };
};

export const useMandalartDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mandalartId, posKey } = parseDetailId(id);
  
  // 만다라트 데이터 조회
  const { data: mandalart, isLoading: isDataLoading } = useQuery({
    queryKey: ['mandalart', mandalartId],
    queryFn: () => {
      if (!mandalartId) throw new Error('만다라트 ID가 없습니다.');
      return getMandalart(mandalartId);
    },
    enabled: !!mandalartId,
  });

  // 세부 목표에 해당하는 서브 그리드 데이터
  // 대시보드와 동일한 로직: 서브 그리드가 있으면 사용, 없으면 center의 세부 목표를 중심에 배치한 draft 그리드 생성
  const getGridData = (): MandalartCenterGrid => {
    if (!mandalart?.current_version?.content || !posKey) {
      return createEmptyGrid();
    }

    const content = mandalart.current_version.content as MandalartGrid;
    const subGrid = content.subGrids?.[posKey];
    
    // Case A: 확장이 완료된 SubGrid가 있는 경우
    if (subGrid) {
      return subGrid;
    }

    // Case B: 확장은 안 됐지만, 세부 목표(텍스트)가 있는 경우
    // posKey를 인덱스로 변환
    const posKeyToIndex: Record<MandalartSubGridKey, number> = {
      northWest: 0,
      north: 1,
      northEast: 2,
      west: 3,
      east: 5,
      southWest: 6,
      south: 7,
      southEast: 8,
    };
    
    const centerIndex = posKeyToIndex[posKey];
    const centerCell = content.center?.[centerIndex];
    
    if (centerCell && centerCell.label && centerCell.label.trim() !== '') {
      // 가짜 3x3 그리드 생성 (중심에 세부 목표 배치) - 대시보드와 동일
      return Array(9)
        .fill(null)
        .map((_, idx) =>
          idx === 4
            ? { ...centerCell, id: `draft-center-${centerIndex}` }
            : { id: `draft-${centerIndex}-${idx}`, label: '', completed: false }
        ) as MandalartCenterGrid;
    }

    // 세부 목표도 없으면 빈 그리드
    return createEmptyGrid();
  };

  // useMemo로 계산하여 불필요한 재계산 방지
  const gridData = useMemo(() => getGridData(), [mandalart, posKey]);

  // 로컬 상태 (편집용)
  const [localGridData, setLocalGridData] = useState<MandalartCenterGrid>(gridData);

  // 데이터 로드 시 상태 동기화
  useEffect(() => {
    if (gridData) {
      setLocalGridData(gridData);
    }
  }, [gridData]);

  const updateCell = (index: number, newValue: string) => {
    setLocalGridData((prev) => {
      const next = [...prev] as MandalartCenterGrid;
      next[index] = { ...next[index], label: newValue };
      return next;
    });
  };

  const { mutate: saveChanges, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!mandalart) throw new Error('만다라트 데이터가 없습니다.');
      if (!posKey) throw new Error('세부 목표 위치를 찾을 수 없습니다.');

      const currentContent = mandalart.current_version?.content as MandalartGrid;
      if (!currentContent) throw new Error('만다라트 데이터가 없습니다.');

      // 서브 그리드 업데이트
      const updatedContent: MandalartGrid = {
        ...currentContent,
        subGrids: {
          ...currentContent.subGrids,
          [posKey]: localGridData,
        },
      };

      // 버전 타입 판별 (서브 그리드의 실천과제 수정)
      // 서브 그리드의 실천과제는 인덱스 0-3, 5-8이므로 EDIT_TASK
      const versionType: 'EDIT_TASK' = 'EDIT_TASK';

      // API 호출 (차단 체크는 API 내부에서 처리)
      try {
        await updateMandalart({
          mandalartId: mandalart.id,
          content: updatedContent,
          versionType,
          note: '실천과제 수정',
        });
      } catch (error: any) {
        // 차단 에러인 경우 리다이렉트
        if (error.message?.includes('차단된 유저')) {
          router.push('/banned');
        }
        throw error;
      }
    },
    onSuccess: () => {
      // 성공 메시지는 상위 컴포넌트에서 Modal로 처리
      queryClient.invalidateQueries({ queryKey: ['mandalart', mandalartId] });
      queryClient.invalidateQueries({ queryKey: ['allMandalarts'] });
      queryClient.invalidateQueries({ queryKey: ['mandalartVersions'] });
    },
    onError: (error: any) => {
      console.error(error);
      // 에러는 상위 컴포넌트에서 Modal로 처리
    },
  });

  return {
    gridData: localGridData,
    updateCell,
    saveChanges,
    isSaving,
    isLoading: isDataLoading,
  };
};
