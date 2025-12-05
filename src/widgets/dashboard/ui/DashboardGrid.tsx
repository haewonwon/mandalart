'use client';

import Link from 'next/link';
import { MandalartCard, MandalartCardProps } from '@/entities/mandalart/ui/MandalartCard';
import { WelcomeSection } from './WelcomeSection';
import { EmptyState } from './EmptyState';

type DashboardGridProps = {
  nickname: string;
  statusMessage: string;
  cards: MandalartCardProps[];
};

export const DashboardGrid = ({ nickname, statusMessage, cards }: DashboardGridProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-8 px-6 py-8">
      <WelcomeSection nickname={nickname} statusMessage={statusMessage} />
      {cards.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/mandalart/new"
            className="flex h-full flex-col justify-between border border-slate-200 bg-slate-900/5 p-6 text-left text-slate-900 transition hover:-translate-y-1 hover:bg-slate-900/10"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">create</p>
              <h3 className="mt-3 text-2xl font-semibold">+ 새 만다라트 만들기</h3>
            </div>
            <p className="text-sm text-slate-600">새로운 목표를 설계하세요.</p>
          </Link>
          {cards.map((card) => (
            <MandalartCard key={card.id} {...card} />
          ))}
        </div>
      )}
    </div>
  );
};
