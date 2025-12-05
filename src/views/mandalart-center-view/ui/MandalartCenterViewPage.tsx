'use client';

import { useCenterEdit } from '@/features/mandalart/edit-center/model/useCenterEdit';
import { Grid3x3 } from '@/shared/ui/Grid';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const MandalartCenterViewPage = () => {
  const { centerGrid, updateCenterCell, saveChanges, isSaving, isLoading } = useCenterEdit();

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
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">핵심 만다라트 보기</h1>
        </div>

        <button
          onClick={() => saveChanges()}
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
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">FOCUS VIEW</p>
            <h2 className="text-2xl font-bold text-slate-900">핵심 목표를 설계하세요</h2>
            <p className="text-sm text-slate-600">
              가운데 9칸은 만다라트의 뿌리입니다. <br className="hidden sm:block" />
              이미 확장된 목표를 수정하면 하위 만다라트를 초기화할지 선택할 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 aspect-square">
            <Grid3x3 className="gap-2 h-full">
              {centerGrid.map((cell, index) => {
                const isCenter = index === 4;
                return (
                  <div key={cell.id} className="relative h-full">
                    <textarea
                      value={cell.label}
                      onChange={(e) => updateCenterCell(index, e.target.value)}
                      className={`w-full h-full resize-none p-3 rounded-lg text-center flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-900 transition text-sm sm:text-base font-medium leading-tight
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
