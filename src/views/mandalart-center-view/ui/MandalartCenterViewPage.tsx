'use client';

import { useState, useEffect } from 'react';
import { useCenterEdit } from '@/features/mandalart/edit-center/model/useCenterEdit';
import { useAllMandalarts } from '@/features/mandalart/view/model/useAllMandalarts';
import { Grid3x3 } from '@/shared/ui/Grid';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const MandalartCenterViewPage = () => {
  // 모든 만다라트 조회
  const { data: mandalarts = [], isLoading: isMandalartsLoading } = useAllMandalarts();
  
  // 연도 필터 상태
  const years = Array.from(new Set(mandalarts.map((m) => m.year))).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 기본값으로 가장 최근 연도 선택
  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const { centerGrid, updateCenterCell, saveChanges, isSaving, isLoading } = useCenterEdit(selectedYear);

  if (isLoading || isMandalartsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-1 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <h1 className="font-semibold text-slate-900 text-base sm:text-lg">핵심 만다라트 보기</h1>
          </div>

          <button
            onClick={() => saveChanges()}
            disabled={isSaving}
            className="bg-slate-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-800 transition flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
          >
            <Save size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isSaving ? '저장 중...' : '저장하기'}</span>
          </button>
        </div>

        {/* 연도 필터 */}
        {years.length > 0 && (
          <div className="flex items-center gap-0.5 sm:gap-2 border-t border-slate-100 pt-2 sm:pt-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors rounded-md ${
                  selectedYear === year
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {year}년
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-8 min-h-0">
        <section className="w-full max-w-xl space-y-4 sm:space-y-6 min-w-0">
          <div className="text-center space-y-1 sm:space-y-2 mb-4 sm:mb-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">FOCUS VIEW</p>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">핵심 목표를 설계하세요</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              가운데 9칸은 만다라트의 뿌리입니다. <br className="hidden sm:block" />
              이미 확장된 목표를 수정하면 하위 만다라트를 초기화할지 선택할 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-1 sm:p-2 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 aspect-square min-w-0 min-h-0">
            <Grid3x3 className="gap-1 sm:gap-2 h-full">
              {centerGrid.map((cell, index) => {
                const isCenter = index === 4;
                return (
                  <div key={cell.id} className="relative h-full min-w-0 min-h-0">
                    <textarea
                      value={cell.label}
                      onChange={(e) => updateCenterCell(index, e.target.value)}
                      className={`w-full h-full resize-none p-1.5 sm:p-3 rounded-lg text-center flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-900 transition text-[10px] sm:text-base font-medium leading-tight
                        ${
                          isCenter
                            ? 'bg-slate-900 text-white placeholder:text-slate-500'
                            : 'bg-slate-50 text-slate-900 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-transparent'
                        }
                      `}
                      placeholder={isCenter ? '핵심 목표' : `목표 ${index + 1}`}
                    />
                    {/* 인덱스 번호 표시 (선택사항) */}
                    {!isCenter && cell.label && (
                      <span className="absolute top-0.5 left-1 sm:top-1 sm:left-2 text-[8px] sm:text-[10px] text-slate-400 pointer-events-none">
                        {index + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </Grid3x3>
          </div>
        </section>
      </div>
    </main>
  );
};
