'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, Target } from 'lucide-react';
import { MandalartCard } from '@/entities/mandalart/ui/MandalartCard';
import { EmptyState } from './EmptyState';
import type {
  Mandalart,
  MandalartGrid,
  MandalartCenterGrid,
} from '@/entities/mandalart/model/types';

interface DashboardGridProps {
  mandalarts?: Mandalart[];
}

const ActionCard = ({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
}) => (
  <Link
    href={href}
    className="group flex min-h-[200px] flex-col justify-between bg-[#F1F3F5] p-6 transition-all hover:bg-[#E9ECEF]"
  >
    <div className="space-y-4">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {href === '/mandalart/new' ? 'Create' : href.includes('full') ? 'Full View' : 'Focus'}
      </span>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">{description}</p>
    </div>
  </Link>
);

export const DashboardGrid = ({ mandalarts = [] }: DashboardGridProps) => {
  const years = Array.from(new Set(mandalarts.map((m) => m.year))).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const filteredMandalarts = selectedYear ? mandalarts.filter((m) => m.year === selectedYear) : [];

  // 4. SubGrid 카드로 변환 (Flatten)
  const flattenedCards = filteredMandalarts.flatMap((mandalart) => {
    const content = mandalart.current_version?.content as any;
    const centerGrid = content?.center as MandalartCenterGrid;
    const subGrids = content?.sub_grids || content?.subGrids || {};

    // 인덱스 -> 위치 Key 매핑
    const indexToKey: Record<number, string> = {
      0: 'northWest',
      1: 'north',
      2: 'northEast',
      3: 'west',
      5: 'east',
      6: 'southWest',
      7: 'south',
      8: 'southEast',
    };

    const cards = [];

    // 4번(중심)을 제외한 0~8번 셀 순회
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;

      const posKey = indexToKey[i];
      const subGrid = subGrids[posKey];
      const cell = centerGrid?.[i]; // 방어 코드

      if (!cell) continue;

      // Case A: 확장이 완료된 SubGrid가 있는 경우
      if (subGrid) {
        cards.push({
          uniqueKey: `${mandalart.id}-${posKey}`,
          projectId: mandalart.id,
          title: subGrid[4]?.label || cell.label,
          status: '진행 중',
          data: subGrid as MandalartCenterGrid,
          year: mandalart.year,
          updatedAt: mandalart.updated_at,
        });
      }
      // Case B: 확장은 안 됐지만, 세부 목표(텍스트)가 있는 경우
      else if (cell.label && cell.label.trim() !== '') {
        // 가짜 3x3 그리드 생성 (중심에 세부 목표 배치)
        const draftGrid = Array(9)
          .fill(null)
          .map((_, idx) =>
            idx === 4
              ? { ...cell, id: `draft-center-${i}` }
              : { id: `draft-${i}-${idx}`, label: '', completed: false }
          ) as MandalartCenterGrid;

        cards.push({
          uniqueKey: `${mandalart.id}-${posKey}-draft`,
          projectId: mandalart.id,
          title: cell.label,
          status: '설계 중',
          data: draftGrid,
          year: mandalart.year,
          updatedAt: mandalart.updated_at,
        });
      }
    }
    return cards;
  });

  return (
    <div className="space-y-8">
      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ActionCard
          title="새 만다라트 만들기"
          description="새로운 목표를 설계하세요."
          icon={Plus}
          href="/mandalart/new"
        />
        <ActionCard
          title="전체 만다라트 보기"
          description="전체 9x9 구조를 한 번에 확인하세요."
          icon={LayoutGrid}
          href="/mandalart/full-view"
        />
        <ActionCard
          title="핵심 만다라트 보기"
          description="중심 3x3만 집중해서 빠르게 편집하세요."
          icon={Target}
          href="/mandalart/center-view"
        />
      </div>

      {/* Year Filter Tabs */}
      {years.length > 0 && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedYear === year
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {year}년
            </button>
          ))}
        </div>
      )}

      {/* Mandalart Cards Grid */}
      {flattenedCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {flattenedCards.map((card) => (
            <MandalartCard
              key={card.uniqueKey}
              id={card.projectId}
              title={card.title}
              status={card.status}
              gridPreview={card.data}
              year={card.year}
              updatedAt={card.updatedAt}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};
