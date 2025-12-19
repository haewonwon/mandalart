'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MandalartCenterGrid, MandalartGrid } from '@/entities/mandalart/model/types';
import { useNewMandalart } from './useNewMandalart';
import { createMandalart } from '@/shared/api/mandalart';

export type Step = 'SETUP' | 'CORE_GRID' | 'EXPAND_GRID';

interface UseCreateWizardProps {
  initialYear?: number;
}

export const useCreateWizard = ({
  initialYear = new Date().getFullYear(),
}: UseCreateWizardProps = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient(); // 저장 성공 시 캐시 무효화를 위해 필요

  const [step, setStep] = useState<Step>('CORE_GRID');

  // 1. 데이터 상태
  const [year, setYear] = useState(initialYear);
  const [centerGrid, setCenterGrid] = useState<MandalartCenterGrid | null>(null);
  const [generatedGrid, setGeneratedGrid] = useState<MandalartGrid | null>(null);

  // 입력 폼 상태 (Step 1)
  const [centerInputs, setCenterInputs] = useState<string[]>(() => Array(9).fill(''));

  // Step 2 관련 (useNewMandalart 훅 활용)
  const { seedOptions, canExpand, generateGridFromSeed } = useNewMandalart({
    centerGrid,
  });
  const [selectedSeed, setSelectedSeed] = useState<string>('');
  const [committedSeed, setCommittedSeed] = useState<string | null>(null);

  // 2. 유효성 검사 및 로직
  const handleCenterInputChange = (index: number, value: string) => {
    setCenterInputs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const validateCenter = useCallback(() => {
    const centerLabel = centerInputs[4]?.trim();
    const hasSurrounding = centerInputs.some((label, idx) => idx !== 4 && label.trim().length > 0);

    if (!centerLabel) {
      return { valid: false, message: '핵심 목표를 입력해 주세요.' };
    }
    if (!hasSurrounding) {
      return { valid: false, message: '세부 목표를 최소 한 개 이상 입력해 주세요.' };
    }
    return { valid: true };
  }, [centerInputs]);

  const saveCenterGrid = (onError?: (message: string) => void) => {
    const validation = validateCenter();
    if (!validation.valid && validation.message) {
      onError?.(validation.message);
      return;
    }

    const nextGrid = centerInputs.map((label, idx) => ({
      id: `center-${idx + 1}`,
      label: label.trim(),
      completed: false,
    })) as MandalartCenterGrid;

    setCenterGrid(nextGrid);
    setStep('EXPAND_GRID');
  };

  const editCenterGrid = (onNeedsConfirm?: () => void) => {
    if (generatedGrid && onNeedsConfirm) {
      onNeedsConfirm(); // 상위에서 확인 받도록 콜백 호출
      return; // 확인 후 실제 edit이 호출될 때까지 대기
    }
    // 확인이 완료되었거나 generatedGrid가 없으면 진행
    setCenterGrid(null);
    setGeneratedGrid(null);
    setCommittedSeed(null);
    setSelectedSeed('');
    setStep('CORE_GRID');
  };

  const doEditCenterGrid = () => {
    setCenterGrid(null);
    setGeneratedGrid(null);
    setCommittedSeed(null);
    setSelectedSeed('');
    setStep('CORE_GRID');
  };

  const handleSubGridInputChange = (index: number, value: string) => {
    if (!generatedGrid) return;
    if (index === 4) return; // 중심 셀은 수정 불가

    setGeneratedGrid((prev) => {
      if (!prev) return null;
      const newCenter = [...prev.center] as MandalartCenterGrid;
      newCenter[index] = { ...newCenter[index], label: value };
      return { ...prev, center: newCenter };
    });
  };

  const expandGrid = (onNeedsConfirm?: () => void) => {
    if (!selectedSeed) return;

    const needsConfirm = committedSeed && committedSeed !== selectedSeed;
    if (needsConfirm && onNeedsConfirm) {
      onNeedsConfirm(); // 상위에서 확인 받도록 콜백 호출
      return; // 확인 후 doExpandGrid가 호출될 때까지 대기
    }

    doExpandGrid();
  };

  const doExpandGrid = () => {
    if (!selectedSeed) return;
    try {
      const nextGrid = generateGridFromSeed(selectedSeed);
      setGeneratedGrid(nextGrid);
      setCommittedSeed(selectedSeed);
    } catch (error) {
      console.error(error);
      throw new Error('만다라트 생성 중 오류가 발생했습니다.');
    }
  };

  const resetExpand = (onNeedsConfirm?: () => void) => {
    if (onNeedsConfirm) {
      onNeedsConfirm(); // 상위에서 확인 받도록 콜백 호출
      return; // 확인 후 doResetExpand가 호출될 때까지 대기
    }
    doResetExpand();
  };

  const doResetExpand = () => {
    setGeneratedGrid(null);
    setCommittedSeed(null);
    setSelectedSeed('');
  };

  // 3. React Query Mutation (API 연동)
  const { mutate: saveMandalart, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (!centerGrid) throw new Error('데이터가 부족합니다.');

      // 저장할 데이터 구성 (MandalartGrid 타입)
      const payloadContent = generatedGrid
        ? {
            center: centerGrid,
            subGrids: generatedGrid.subGrids,
          }
        : {
            center: centerGrid,
            subGrids: {},
          };

      // 제목은 별도 입력이 없으므로 '핵심 목표'를 제목으로 사용
      const title = centerGrid[4].label;

      // API 호출 (차단 체크는 API 내부에서 처리)
      try {
        return await createMandalart({
          title,
          year,
          initialContent: payloadContent,
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
      // 대시보드 데이터 갱신 등을 위해 쿼리 무효화 (필요 시)
      // queryClient.invalidateQueries({ queryKey: ['mandalarts'] });

      // 대시보드 페이지로 이동
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('Save Error:', error);
      // 에러는 상위 컴포넌트에서 Modal로 처리
    },
  });

  return {
    // State
    step,
    year,
    setYear,
    centerInputs,
    centerGrid,
    generatedGrid,
    selectedSeed,
    setSelectedSeed,
    committedSeed,
    isLoading,

    // Computed
    seedOptions,
    canExpand,

    // Actions
    handleCenterInputChange,
    saveCenterGrid,
    editCenterGrid,
    doEditCenterGrid,
    handleSubGridInputChange,
    expandGrid,
    doExpandGrid,
    resetExpand,
    doResetExpand,
    saveMandalart,
  };
};
