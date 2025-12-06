'use client';

import { useCallback, useRef, useState } from 'react';
import type { MandalartGrid, MandalartSubGridKey } from '@/entities/mandalart/model/types';
import { exportMandalartAsImage } from './mandalartImageExport';
import { exportMandalartAsPDF } from './mandalartPDFExport';

export const useMandalartExport = (onError?: (message: string) => void) => {
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // 이미지 다운로드
  const downloadImage = useCallback(async (
    fileName: string = 'mandalart-grid',
    year?: number | null
  ) => {
    if (!exportRef.current) {
      onError?.('만다라트 요소를 찾을 수 없습니다.');
      return;
    }
    setIsExporting(true);

    try {
      await exportMandalartAsImage(exportRef.current, fileName, year);
    } catch (err) {
      console.error('이미지 저장 실패:', err);

      // 만약 CORS 에러라면 힌트 주기
      if (err instanceof Error && err.message.includes('fetch')) {
        onError?.('외부 이미지(프로필 등)의 보안 설정 때문에 저장할 수 없습니다.');
      } else {
        onError?.('이미지 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setIsExporting(false);
    }
  }, [onError]);

  // PDF 다운로드
  const downloadPDF = useCallback(async (
    fileName: string = 'mandalart-grid'
  ) => {
    if (!exportRef.current) {
      onError?.('만다라트 요소를 찾을 수 없습니다.');
      return;
    }
    setIsExporting(true);

    try {
      await exportMandalartAsPDF(exportRef.current, fileName);
    } catch (err) {
      console.error('PDF 저장 실패:', err);

      // 만약 CORS 에러라면 힌트 주기
      if (err instanceof Error && err.message.includes('fetch')) {
        onError?.('외부 이미지(프로필 등)의 보안 설정 때문에 저장할 수 없습니다.');
      } else {
        onError?.('PDF 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setIsExporting(false);
    }
  }, [onError]);

  return {
    exportRef,
    isExporting,
    downloadImage,
    downloadPDF,
  };
};
