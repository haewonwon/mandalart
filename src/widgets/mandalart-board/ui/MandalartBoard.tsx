import type { MandalartCluster } from '@/entities/mandalart/model/types';
import { MandalartCellItem } from '@/entities/mandalart/ui/Cell';
import { Grid3x3 } from '@/shared/ui/Grid';

const placeholderCluster: MandalartCluster = {
  id: 'cluster-main',
  centerCell: { id: 'cell-center', title: '핵심 목표', isCompleted: false },
  surroundingCells: [
    { id: 'cell-1', title: '목표 1', isCompleted: false },
    { id: 'cell-2', title: '목표 2', isCompleted: false },
    { id: 'cell-3', title: '목표 3', isCompleted: false },
    { id: 'cell-4', title: '목표 4', isCompleted: false },
    { id: 'cell-5', title: '목표 5', isCompleted: false },
    { id: 'cell-6', title: '목표 6', isCompleted: false },
    { id: 'cell-7', title: '목표 7', isCompleted: false },
    { id: 'cell-8', title: '목표 8', isCompleted: false },
  ],
};

type MandalartBoardProps = {
  cluster?: MandalartCluster;
};

export const MandalartBoard = ({ cluster = placeholderCluster }: MandalartBoardProps) => {
  const cells: MandalartCluster['surroundingCells'][number][] = [];
  const surrounding = cluster.surroundingCells;

  for (let index = 0, surroundIdx = 0; index < 9; index += 1) {
    if (index === 4) {
      cells.push(cluster.centerCell);
      continue;
    }
    cells.push(surrounding[surroundIdx] ?? { id: `empty-${index}`, title: '', isCompleted: false });
    surroundIdx += 1;
  }

  return (
    <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">만다라트 3x3</h2>
        <p className="text-sm text-slate-500">핵심 목표와 주변 목표를 먼저 구성해 보세요.</p>
      </header>
      <Grid3x3 className="w-full">
        {cells.map((cell, index) => (
          <MandalartCellItem
            key={cell.id ?? `cell-${index}`}
            title={cell.title}
            isCenter={index === 4}
          />
        ))}
      </Grid3x3>
    </section>
  );
};
