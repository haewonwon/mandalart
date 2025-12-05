'use client';

import { useMandalartDetail } from '@/features/mandalart/edit-detail/model/useMandalartDetail';
import { Grid3x3 } from '@/shared/ui/Grid';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type MandalartDetailPageProps = {
  params: {
    id: string;
  };
};

export const MandalartDetailPage = ({ params }: MandalartDetailPageProps) => {
  const { id } = params;
  const { gridData, updateCell, saveChanges, isSaving } = useMandalartDetail(id);

  return (
    <main className="flex flex-col flex-1 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">만다라트 상세 편집</h1>
        </div>

        <button
          onClick={saveChanges}
          disabled={isSaving}
          className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span className="hidden sm:inline">{isSaving ? '저장 중...' : '저장하기'}</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <section className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-2 mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">DETAIL VIEW</p>
            <h2 className="text-2xl font-bold text-slate-900">{gridData[4].label}</h2>
            <p className="text-sm text-slate-600">
              세부 실천 계획을 구체적으로 작성해 보세요.
            </p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 aspect-square">
            <Grid3x3 className="gap-2 h-full">
              {gridData.map((cell, index) => {
                const isCenter = index === 4;
                return (
                  <div key={cell.id} className="relative h-full">
                    <textarea
                      value={cell.label}
                      onChange={(e) => updateCell(index, e.target.value)}
                      disabled={isCenter} // 서브 그리드의 중심은 상위에서 수정해야 함 (보통은)
                      className={`w-full h-full resize-none p-3 rounded-lg text-center flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-900 transition text-sm sm:text-base font-medium leading-tight
                        ${
                          isCenter
                            ? 'bg-slate-100 text-slate-900 font-bold cursor-default'
                            : 'bg-slate-50 text-slate-900 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-transparent'
                        }
                      `}
                      placeholder={isCenter ? '핵심 목표' : `실천 계획 ${index + 1}`}
                    />
                     {!isCenter && cell.label && (
                        <span className="absolute top-1 left-2 text-[10px] text-slate-400 pointer-events-none">
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
