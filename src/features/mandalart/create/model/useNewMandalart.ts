'use client';

import { useMemo } from 'react';
import { type MandalartCenterGrid, type MandalartCell, type MandalartGrid, type MandalartSubGridKey } from '@/entities/mandalart';

const CENTER_CELL_INDEX = 4;

const CENTER_TO_SUBGRID: Partial<Record<number, MandalartSubGridKey>> = {
  0: 'northWest',
  1: 'north',
  2: 'northEast',
  3: 'west',
  5: 'east',
  6: 'southWest',
  7: 'south',
  8: 'southEast',
};

const SUBGRID_ORDER: MandalartSubGridKey[] = [
  'northWest',
  'north',
  'northEast',
  'west',
  'east',
  'southWest',
  'south',
  'southEast',
];

// updatedAt 제거
const createEmptyCell = (prefix: string, index: number): MandalartCell => ({
  id: `${prefix}-${index}`,
  label: '',
  completed: false,
});

export type SeedOption = {
  id: string;
  label: string;
  index: number;
  subGridKey: MandalartSubGridKey;
};

type UseNewMandalartParams = {
  centerGrid?: MandalartCenterGrid | null;
};

export const useNewMandalart = ({ centerGrid }: UseNewMandalartParams) => {
  const centerGoal = centerGrid?.[CENTER_CELL_INDEX];
  const hasCenterLabel = Boolean(centerGoal?.label?.trim());

  const seedOptions: SeedOption[] = useMemo(() => {
    if (!centerGrid) return [];

    return (centerGrid as MandalartCenterGrid)
      .map((cell, index) => ({ cell, index }))
      .filter(
        ({ cell, index }) =>
          index !== CENTER_CELL_INDEX &&
          Boolean(cell.label?.trim()) &&
          Boolean(CENTER_TO_SUBGRID[index])
      )
      .map(({ cell, index }) => ({
        id: cell.id,
        label: cell.label,
        index,
        subGridKey: CENTER_TO_SUBGRID[index] as MandalartSubGridKey,
      }));
  }, [centerGrid]);

  const canExpand = hasCenterLabel && seedOptions.length > 0;

  const generateGridFromSeed = (seedId: string): MandalartGrid => {
    if (!centerGrid) {
      throw new Error('핵심 만다라트 정보가 없습니다.');
    }

    const targetSeed = seedOptions.find((option) => option.id === seedId);
    if (!targetSeed) {
      throw new Error('선택한 목표를 찾을 수 없습니다.');
    }

    // updatedAt 제거
    const centerCells = Array.from({ length: 9 }, (_, index) =>
      index === CENTER_CELL_INDEX
        ? {
            id: targetSeed.id,
            label: targetSeed.label,
            completed: false,
          }
        : createEmptyCell(`seed-${targetSeed.id}`, index)
    ) as MandalartCenterGrid;

    const subGrids = SUBGRID_ORDER.reduce((acc, key) => {
      acc[key] = Array.from({ length: 9 }, (_, index) =>
        createEmptyCell(`${key}`, index)
      ) as MandalartCenterGrid; // 타입 단언 추가 (Tuple 타입 보장)
      return acc;
    }, {} as Record<MandalartSubGridKey, MandalartCenterGrid>);

    return {
      center: centerCells,
      subGrids,
    };
  };

  return {
    needsCenter: !hasCenterLabel,
    seedOptions,
    canExpand,
    generateGridFromSeed,
  };
};
