'use client';

import type { MandalartGrid, MandalartSubGridKey, MandalartCenterGrid } from '@/entities/mandalart/model/types';
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
  exportRef?: React.RefObject<HTMLDivElement | null>;
};

export const FullMandalartBoard = ({
  data,
  className,
  isReorderMode = false,
  orderedPositions,
  onReorder,
  exportRef,
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

  // center 인덱스와 subGrid 키 매핑
  const SUBGRID_TO_CENTER_INDEX: Record<MandalartSubGridKey, number> = {
    northWest: 0,
    north: 1,
    northEast: 2,
    west: 3,
    east: 5,
    southWest: 6,
    south: 7,
    southEast: 8,
  };

  // 역매핑: center 인덱스 -> subGrid 키
  const CENTER_INDEX_TO_SUBGRID: Record<number, MandalartSubGridKey> = {
    0: 'northWest',
    1: 'north',
    2: 'northEast',
    3: 'west',
    5: 'east',
    6: 'southWest',
    7: 'south',
    8: 'southEast',
  };

  // orderedPositions를 기반으로 center 그리드 재배치
  const reorderedCenter = useMemo(() => {
    if (!safeData.center) return safeData.center;

    const newCenter = [...safeData.center] as MandalartCenterGrid;
    const centerCell = newCenter[4]; // 가운데 셀은 항상 고정

    // orderedPositions에서 center를 제외한 subGrid 순서 추출
    const subGridOrder = orderedPositions.filter((pos) => pos !== 'center') as MandalartSubGridKey[];

    // 각 위치(0-8, 4 제외)에 해당하는 subGrid를 찾아서 center 셀 재배치
    const positionToSubGrid: (MandalartSubGridKey | null)[] = Array(9).fill(null);
    let subGridIdx = 0;
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue; // 가운데는 건너뛰기
      if (subGridIdx < subGridOrder.length) {
        positionToSubGrid[i] = subGridOrder[subGridIdx];
        subGridIdx++;
      }
    }

    // 원본 center 그리드에서 subGrid 키로 셀을 찾아서 재배치
    const reordered = Array(9).fill(null) as MandalartCenterGrid;
    reordered[4] = centerCell; // 가운데는 항상 고정

    for (let i = 0; i < 9; i++) {
      if (i === 4) continue; // 가운데는 이미 설정됨

      const subGridKey = positionToSubGrid[i];
      if (subGridKey) {
        // 원본 center 그리드에서 이 subGrid에 해당하는 인덱스 찾기
        const originalIndex = SUBGRID_TO_CENTER_INDEX[subGridKey];
        reordered[i] = safeData.center[originalIndex];
      } else {
        // 매핑이 없으면 빈 셀
        reordered[i] = safeData.center[i];
      }
    }

    return reordered;
  }, [safeData.center, orderedPositions]);

  // 렌더링 헬퍼 함수
  const renderGridBlock = (posKey: MandalartSubGridKey | 'center', isOverlay = false) => {
    if (posKey === 'center') {
      return (
        <div className={`bg-slate-100 p-0.5 sm:p-1 rounded ${isOverlay ? 'shadow-xl' : ''}`}>
          <Grid3x3 className="gap-0.5">
            {reorderedCenter.map((cell, idx) => (
              <MandalartCellItem
                key={`center-${cell.id}-${idx}`}
                label={cell.label}
                isCenter={idx === 4}
                emptyText=""
                cellType={idx === 4 ? 'center-main' : 'center-other'}
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

    // center 그리드의 해당 셀 가져오기 (subGrid의 가운데 셀이 비어있을 때 사용)
    // orderedPositions에서 이 subGrid의 위치를 찾아서 reorderedCenter에서 가져오기
    const positionIndex = orderedPositions.indexOf(posKey);
    let centerCell = null;
    if (positionIndex !== -1 && positionIndex !== 4) {
      // orderedPositions의 인덱스가 center 그리드의 인덱스와 동일
      // (4는 center이므로 제외)
      centerCell = reorderedCenter[positionIndex];
    }
    
    // fallback: 원본 center에서 찾기
    if (!centerCell) {
      const centerIndex = SUBGRID_TO_CENTER_INDEX[posKey];
      centerCell = safeData.center[centerIndex];
    }

    return (
      <div
        className={`bg-white border border-slate-100 p-0.5 sm:p-1 rounded ${
          isOverlay ? 'shadow-xl ring-2 ring-slate-900' : ''
        }`}
      >
        <Grid3x3 className="gap-0.5">
          {subCells.map((cell, idx) => {
            // 가운데 셀(4번 인덱스)이 비어있으면 center 그리드의 해당 셀 label 사용
            const displayLabel =
              idx === 4 && (!cell.label || cell.label.trim() === '')
                ? centerCell?.label || ''
                : cell.label;

            return (
              <MandalartCellItem
                key={`${posKey}-${idx}`}
                label={displayLabel}
                isCenter={idx === 4}
                emptyText=""
                cellType={idx === 4 ? 'subgrid-center' : 'subgrid-other'}
              />
            );
          })}
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
  }, [orderedPositions, isReorderMode, safeData, reorderedCenter]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
        <div 
          ref={exportRef}
          className={`grid grid-cols-3 gap-1 sm:gap-2 ${className}`}
        >
          {renderItems}
        </div>
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
