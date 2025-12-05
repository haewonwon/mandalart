'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase';
import { MandalartCenterGrid, MandalartGrid } from '@/entities/mandalart/model/types';
import { useNewMandalart } from './useNewMandalart';

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
      alert('핵심 목표를 입력해 주세요.');
      return false;
    }
    if (!hasSurrounding) {
      alert('세부 목표를 최소 한 개 이상 입력해 주세요.');
      return false;
    }
    return true;
  }, [centerInputs]);

  const saveCenterGrid = () => {
    if (!validateCenter()) return;

    const nextGrid = centerInputs.map((label, idx) => ({
      id: `center-${idx + 1}`,
      label: label.trim(),
      completed: false,
    })) as MandalartCenterGrid;

    setCenterGrid(nextGrid);
    setStep('EXPAND_GRID');
  };

  const editCenterGrid = () => {
    if (
      generatedGrid &&
      !window.confirm('핵심 만다라트를 수정하시겠습니까? 확장된 내용은 초기화됩니다.')
    ) {
      return;
    }
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

  const expandGrid = () => {
    if (!selectedSeed) return;

    const needsConfirm = committedSeed && committedSeed !== selectedSeed;
    if (needsConfirm && !window.confirm('변경하시겠습니까? 저장하지 않은 내용은 사라집니다.')) {
      setSelectedSeed(committedSeed || '');
      return;
    }

    try {
      const nextGrid = generateGridFromSeed(selectedSeed);
      setGeneratedGrid(nextGrid);
      setCommittedSeed(selectedSeed);
    } catch (error) {
      console.error(error);
      alert('만다라트 생성 중 오류가 발생했습니다.');
    }
  };

  const resetExpand = () => {
    if (window.confirm('확장된 내용을 초기화하시겠습니까? 입력한 내용은 사라집니다.')) {
      setGeneratedGrid(null);
      setCommittedSeed(null);
      setSelectedSeed('');
    }
  };

  // 3. React Query Mutation (API 연동)
  const { mutate: saveMandalart, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (!centerGrid) throw new Error('데이터가 부족합니다.');
      const supabase = createClient();

      // 1. 로그인 체크
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다.');

      // 2. 저장할 데이터 구성 (MandalartGrid 타입)
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

      // 3. Supabase RPC 호출
      const { data, error } = await supabase.rpc('create_mandalart', {
        p_title: title,
        p_year: year,
        p_initial_content: payloadContent,
      });

      if (error) throw error;
      return data; // 생성된 ID 반환
    },
    onSuccess: () => {
      alert('저장되었습니다.');
      // 대시보드 데이터 갱신 등을 위해 쿼리 무효화 (필요 시)
      // queryClient.invalidateQueries({ queryKey: ['mandalarts'] });

      // 대시보드 페이지로 이동
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('Save Error:', error);
      alert(error.message || '저장 중 오류가 발생했습니다.');
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
    handleSubGridInputChange,
    expandGrid,
    resetExpand,
    saveMandalart,
  };
};
