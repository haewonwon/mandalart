'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FullMandalartBoard } from '@/widgets/mandalart-board/ui/FullMandalartBoard';
import type { MandalartGrid, MandalartSubGridKey } from '@/entities/mandalart/model/types';
import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthSession } from '@/features/auth/model/useAuthSession';
import { fetchMandalartForShare } from '@/shared/api/mandalart';

const DEFAULT_ORDER: (MandalartSubGridKey | 'center')[] = [
  'northWest',
  'north',
  'northEast',
  'west',
  'center',
  'east',
  'southWest',
  'south',
  'southEast',
];

type MandalartSharePageProps = {
  mandalartId: string;
  shareToken: string;
};

export const MandalartSharePage = ({ mandalartId, shareToken }: MandalartSharePageProps) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const { session } = useAuthSession();
  
  const { data: mandalart, isLoading, error } = useQuery({
    queryKey: ['sharedMandalart', mandalartId],
    queryFn: () => {
      if (!mandalartId) {
        throw new Error('만다라트 ID가 없습니다.');
      }
      return fetchMandalartForShare(mandalartId);
    },
    enabled: !!mandalartId, // mandalartId가 있을 때만 쿼리 실행
  });

  const data = mandalart?.current_version?.content as MandalartGrid | undefined;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (error || !mandalart || !data) {
    return (
      <main className="flex flex-col flex-1 bg-slate-50 h-full min-h-screen">
        <div className="flex flex-1 items-center justify-center p-8 text-slate-500">
          {error ? '만다라트를 불러오는 중 오류가 발생했습니다.' : '만다라트를 찾을 수 없습니다.'}
        </div>
      </main>
    );
  }

  const authorNickname = mandalart?.author?.nickname || '익명';
  const year = mandalart?.year || new Date().getFullYear();

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      {/* 상단 헤더 영역 */}
      <div className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/mandalart_logo.svg"
              alt="08.MANDALART 로고"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-sm font-semibold text-slate-900">08.MANDALART</span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="flex flex-col items-center gap-8 lg:gap-12">
            {/* 제목 및 설명 섹션 */}
            <div className="text-center space-y-2 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-100 text-[10px] sm:text-xs font-medium text-slate-400">
                <Sparkles size={10} className="sm:w-3.5 sm:h-3.5" />
                <span>공유된 만다라트</span>
              </div>
              <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-slate-900">{authorNickname}님의</span>
                <br />
                <span className="text-slate-900">{year} 만다라트</span>
              </h1>
            </div>

            {/* 만다라트 섹션 - 크기 축소 */}
            <div className="w-full max-w-2xl min-w-0">
              <div className="bg-white p-1.5 sm:p-4 rounded-xl shadow-lg border border-slate-200 w-full aspect-square min-h-0">
                <div className="w-full h-full min-w-0 min-h-0">
                  <FullMandalartBoard
                    data={data}
                    isReorderMode={false}
                    orderedPositions={DEFAULT_ORDER}
                    onReorder={() => {}}
                    exportRef={exportRef}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* CTA 섹션 */}
            <div className="w-full max-w-md text-center space-y-4 sm:space-y-6 pt-2 sm:pt-4">
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-sm sm:text-xl font-semibold text-slate-400">
                  나만의 만다라트를 만들어보세요
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  목표를 설정하고 실천 계획을 세워<br className="hidden sm:block" />
                  꾸준히 기록하며 성장하세요
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Link
                  href={session ? '/mandalart/new' : '/login'}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                  <Sparkles size={12} className="sm:w-4 sm:h-4" />
                  만다라트 생성하기
                </Link>
                <Link
                  href={session ? '/dashboard' : '/'}
                  className="inline-flex items-center justify-center border border-slate-300 text-slate-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  서비스 둘러보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

