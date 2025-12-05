'use client';

import type { MandalartGrid, MandalartSubGridKey } from '@/entities/mandalart/model/types';
import { MandalartCellItem } from '@/entities/mandalart/ui/Cell';
import { Grid3x3 } from '@/shared/ui/Grid';
import { SortableGridItem } from './SortableGridItem';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

type FullMandalartBoardProps = {
  data: MandalartGrid;
  className?: string;
  isReorderMode?: boolean;
  orderedPositions: (MandalartSubGridKey | 'center')[];
  onReorder?: (newOrder: (MandalartSubGridKey | 'center')[]) => void;
};

export const FullMandalartBoard = ({
  data,
  className,
  isReorderMode = false,
  orderedPositions,
  onReorder,
}: FullMandalartBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // 드래그 가능한 아이템 목록에서 'center'를 제외 (8개만)
  const sortableItems = useMemo(() => {
    return orderedPositions.filter((id) => id !== 'center') as string[];
  }, [orderedPositions]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // orderedPositions 전체 배열에서 인덱스를 찾습니다.
      const oldIndex = orderedPositions.indexOf(active.id as any);
      const newIndex = orderedPositions.indexOf(over.id as any);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = [...orderedPositions];

        // center의 인덱스(4)를 기준으로 교환 로직이 center를 침범하지 않도록 합니다.
        // 하지만 dnd-kit의 리스트 관점에서는 8개의 아이템만 존재하고,
        // 우리는 렌더링 시 4번 인덱스에 center를 강제로 끼워넣을 것이므로,
        // 실제 데이터 배열(newOrder)에서의 교환은 center를 건너뛰거나 고려해서 처리해야 합니다.

        // 여기서는 단순 스왑(Swap) 방식을 사용합니다.
        // Center가 아닌 8개끼리만 자리가 바뀝니다.
        const temp = newOrder[oldIndex];
        newOrder[oldIndex] = newOrder[newIndex];
        newOrder[newIndex] = temp;

        onReorder?.(newOrder);
      }
    }
    setActiveId(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  // 렌더링 헬퍼 함수
  const renderGridBlock = (posKey: MandalartSubGridKey | 'center', isOverlay = false) => {
    if (posKey === 'center') {
      return (
        <div className={`bg-slate-100 p-0.5 sm:p-1 rounded ${isOverlay ? 'shadow-xl' : ''}`}>
          <Grid3x3 className="gap-0.5">
            {data.center.map((cell, idx) => (
              <MandalartCellItem
                key={`center-${cell.id}-${idx}`}
                title={cell.label}
                isCenter={idx === 4}
              />
            ))}
          </Grid3x3>
        </div>
      );
    }

    const subCells = data.subGrids[posKey] || Array(9).fill({ id: `empty-${posKey}`, label: '' });

    return (
      <div
        className={`bg-white border border-slate-100 p-0.5 sm:p-1 rounded ${
          isOverlay ? 'shadow-xl ring-2 ring-slate-900' : ''
        }`}
      >
        <Grid3x3 className="gap-0.5">
          {subCells.map((cell, idx) => (
            <MandalartCellItem key={`${posKey}-${idx}`} title={cell.label} isCenter={idx === 4} />
          ))}
        </Grid3x3>
      </div>
    );
  };

  // 렌더링을 위한 9개 칸 배열 생성
  // sortableItems(8개)를 배치하되, 4번째 인덱스(가운데)는 무조건 'center'로 채움
  const renderItems = useMemo(() => {
    const items: React.ReactNode[] = [];
    // 현재 orderedPositions에서 'center'를 제외한 실제 순서대로 아이템을 가져옵니다.
    const currentSortableOrder = orderedPositions.filter((id) => id !== 'center');

    let sortableIdx = 0;
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        // 정중앙 (인덱스 4) -> 고정된 Center 렌더링
        items.push(
          <div key="center-fixed" className="relative z-0">
            {renderGridBlock('center')}
          </div>
        );
      } else {
        // 나머지 칸 -> Sortable 아이템 렌더링
        const posKey = currentSortableOrder[sortableIdx];
        if (posKey) {
          const disabled = !isReorderMode;
          items.push(
            <SortableGridItem key={posKey} id={posKey} disabled={disabled}>
              {renderGridBlock(posKey)}
            </SortableGridItem>
          );
          sortableIdx++;
        }
      }
    }
    return items;
  }, [orderedPositions, isReorderMode, data]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
        <div className={`grid grid-cols-3 gap-1 sm:gap-2 ${className}`}>{renderItems}</div>
      </SortableContext>

      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId ? renderGridBlock(activeId as MandalartSubGridKey, true) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
};
