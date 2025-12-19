'use client';

import { MandalartCellItem, type MandalartCenterGrid } from '@/entities/mandalart';
import { Grid3x3 } from '@/shared/ui';

type MandalartBoardProps = {
  grid?: MandalartCenterGrid;
};

export const MandalartBoard = ({ grid }: MandalartBoardProps) => {
  const cells = grid || Array(9).fill({ id: 'empty', label: '', completed: false });

  return (
    <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">만다라트 3x3</h2>
        <p className="text-sm text-slate-500">핵심 목표와 주변 목표를 먼저 구성해 보세요.</p>
      </header>
      <Grid3x3 className="w-full">
        {cells.map((cell, index) => (
          <MandalartCellItem
            key={cell.id === 'empty' ? `empty-${index}` : cell.id}
            label={cell.label}
            isCenter={index === 4}
          />
        ))}
      </Grid3x3>
    </section>
  );
};
