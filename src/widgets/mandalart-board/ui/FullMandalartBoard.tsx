'use client';

import type { MandalartGrid, MandalartSubGridKey } from '@/entities/mandalart/model/types';
import { MandalartCellItem } from '@/entities/mandalart/ui/Cell';
import { Grid3x3 } from '@/shared/ui/Grid';
import { SortableGridItem } from './SortableGridItem';
import { INITIAL_MANDALART } from '@/shared/lib/constants';
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
  data?: MandalartGrid | null;
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

  // 안전하게 데이터 사용 (Fallback 처리)
  const safeData = data ?? INITIAL_MANDALART;

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
      const oldIndex = orderedPositions.indexOf(active.id as any);
      const newIndex = orderedPositions.indexOf(over.id as any);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = [...orderedPositions];
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
            {safeData.center.map((cell, idx) => (
              <MandalartCellItem
                key={`center-${cell.id}-${idx}`}
                label={cell.label}
                isCenter={idx === 4}
              />
            ))}
          </Grid3x3>
        </div>
      );
    }

    // safeData.subGrids[posKey]는 타입상 존재하지만, 혹시 모를 런타임 에러 방지를 위해 안전하게 접근
    const subCells =
      safeData.subGrids?.[posKey] ||
      Array(9).fill({ id: `empty-${posKey}`, label: '', completed: false });

    return (
      <div
        className={`bg-white border border-slate-100 p-0.5 sm:p-1 rounded ${
          isOverlay ? 'shadow-xl ring-2 ring-slate-900' : ''
        }`}
      >
        <Grid3x3 className="gap-0.5">
          {subCells.map((cell, idx) => (
            <MandalartCellItem key={`${posKey}-${idx}`} label={cell.label} isCenter={idx === 4} />
          ))}
        </Grid3x3>
      </div>
    );
  };

  // 렌더링을 위한 9개 칸 배열 생성
  const renderItems = useMemo(() => {
    const items: React.ReactNode[] = [];
    const currentSortableOrder = orderedPositions.filter((id) => id !== 'center');

    let sortableIdx = 0;
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        items.push(
          <div key="center-fixed" className="relative z-0">
            {renderGridBlock('center')}
          </div>
        );
      } else {
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
  }, [orderedPositions, isReorderMode, safeData]);

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
