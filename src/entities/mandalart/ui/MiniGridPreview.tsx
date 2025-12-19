'use client';

import type { MiniGridPreviewProps } from '@/entities/mandalart';

/**
 * 미니 만다라트 프리뷰 컴포넌트
 * @description 3x3 셀 그리드로 간단한 만다라트 미리보기 표시
 */
export const MiniGridPreview = ({ cells }: MiniGridPreviewProps) => {
  const normalized = cells.slice(0, 9);

  return (
    <div className="grid aspect-square w-full max-w-[160px] grid-cols-3 gap-1">
      {normalized.map((cell) => (
        <div
          key={cell.id}
          className="flex items-center justify-center rounded bg-slate-100 text-center text-[10px] font-medium text-slate-600"
        >
          {cell.label}
        </div>
      ))}
    </div>
  );
};
