'use client';

import { useMandalartDetail } from '@/features/mandalart/edit-detail/model/useMandalartDetail';
import { Grid3x3 } from '@/shared/ui/Grid';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

type MandalartDetailPageProps = {
  params: {
    id: string;
  };
};

export const MandalartDetailPage = ({ params }: MandalartDetailPageProps) => {
  const { id } = params;
  const { gridData, updateCell, saveChanges, isSaving, isLoading } = useMandalartDetail(id);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-1 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </Link>
          <h1 className="font-semibold text-slate-900 text-base sm:text-lg">만다라트 상세 편집</h1>
        </div>

        <button
          onClick={() => saveChanges()}
          disabled={isSaving}
          className="bg-slate-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-800 transition flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
        >
          <Save size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{isSaving ? '저장 중...' : '저장하기'}</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-8 min-h-0">
        <section className="w-full max-w-xl space-y-4 sm:space-y-6 min-w-0">
          <div className="text-center space-y-1 sm:space-y-2 mb-4 sm:mb-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">DETAIL VIEW</p>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 break-words">{gridData[4].label}</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              실천 과제를 구체적으로 작성해 보세요.
            </p>
          </div>

          <div className="bg-white p-1 sm:p-2 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 aspect-square min-w-0 min-h-0">
            <Grid3x3 className="gap-1 sm:gap-2 h-full">
              {gridData.map((cell, index) => {
                const isCenter = index === 4;
                return (
                  <div key={cell.id} className="relative h-full min-w-0 min-h-0">
                    <textarea
                      value={cell.label}
                      onChange={(e) => updateCell(index, e.target.value)}
                      disabled={isCenter} // 서브 그리드의 중심은 상위에서 수정해야 함 (보통은)
                      className={`w-full h-full resize-none p-1.5 sm:p-3 rounded-lg text-center flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-900 transition text-[10px] sm:text-base font-medium leading-tight
                        ${
                          isCenter
                            ? 'bg-slate-100 text-slate-900 font-bold cursor-default'
                            : 'bg-slate-50 text-slate-900 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-transparent'
                        }
                      `}
                      placeholder={isCenter ? '세부 목표' : `실천 과제 ${index + 1}`}
                    />
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
