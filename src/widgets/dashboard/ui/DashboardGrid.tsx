'use client';

import Link from 'next/link';
import { MandalartCard } from '@/entities/mandalart/ui/MandalartCard';
import { EmptyState } from './EmptyState';
import type { Mandalart } from '@/entities/mandalart/model/types';

type DashboardGridProps = {
  mandalarts: Mandalart[];
};

export const DashboardGrid = ({ mandalarts }: DashboardGridProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-8">
      {mandalarts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            href="/mandalart/new"
            tag="create"
            label="새 만다라트 만들기"
            description="새로운 목표를 설계하세요."
          />
          <ActionCard
            href="/mandalart/full-view"
            tag="full view"
            label="현재 만다라트 보기"
            description="전체 9x9 구조를 한 번에 확인하세요."
          />
          <ActionCard
            href="/mandalart/center-view"
            tag="focus"
            label="핵심 만다라트 보기"
            description="중심 3x3만 집중해서 빠르게 편집하세요."
          />
          {mandalarts.map((mandalart) => (
            <MandalartCard
              key={mandalart.id}
              id={mandalart.id}
              title={mandalart.title}
              status="진행 중" // TODO: 상태값 DB 추가 시 연동
              gridPreview={
                mandalart.current_version?.content.center.map((cell) => ({
                  id: cell.id,
                  label: cell.label,
                })) || []
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

type ActionCardProps = {
  href: string;
  tag: string;
  label: string;
  description: string;
  variant?: 'default';
};

const ActionCard = ({ href, tag, label, description }: ActionCardProps) => {
  const base =
    'flex h-full flex-col justify-between border border-slate-200 bg-slate-900/5 p-6 text-left text-slate-900 transition hover:-translate-y-1 hover:bg-slate-900/10';

  return (
    <Link href={href} className={base}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{tag}</p>
        <h3 className="mt-3 text-2xl font-semibold">{label}</h3>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </Link>
  );
};
