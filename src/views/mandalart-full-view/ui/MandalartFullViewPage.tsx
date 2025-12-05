'use client';

import { useState } from 'react';
import { FullMandalartBoard } from '@/widgets/mandalart-board/ui/FullMandalartBoard';
import { useMandalartExport } from '@/features/mandalart/export/model/useMandalartExport';
import type { MandalartSubGridKey } from '@/entities/mandalart/model/types';
import { ArrowLeft, Download, Share2, GripHorizontal, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRecentMandalart } from '@/features/mandalart/view/model/useRecentMandalart';
import type { MandalartGrid } from '@/entities/mandalart/model/types';

export const MandalartFullViewPage = () => {
  // API 데이터 연동 (가장 최근 만다라트)
  const { data: mandalart, isLoading } = useRecentMandalart();
  const data = mandalart?.current_version?.content as MandalartGrid | undefined;

  const { exportRef, downloadImage, downloadPDF, isExporting } = useMandalartExport();
  const [isReorderMode, setIsReorderMode] = useState(false);

  // 초기 배치 상태 관리
  const [orderedPositions, setOrderedPositions] = useState<(MandalartSubGridKey | 'center')[]>([
    'northWest',
    'north',
    'northEast',
    'west',
    'center',
    'east',
    'southWest',
    'south',
    'southEast',
  ]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('링크가 클립보드에 복사되었습니다.');
    });
  };

  const toggleReorderMode = () => {
    setIsReorderMode((prev) => !prev);
  };

  const handleReorderChange = (newOrder: (MandalartSubGridKey | 'center')[]) => {
    setOrderedPositions(newOrder);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  // 데이터가 없는 경우 처리 (옵션)
  if (!data) {
    return (
      <main className="flex flex-col flex-1 bg-slate-50 h-full">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center gap-4 shadow-sm">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">현재 만다라트 보기</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-8 text-slate-500">
          표시할 만다라트가 없습니다. 먼저 만다라트를 생성해주세요.
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 bg-slate-50 h-full">
      {/* Header / Actions Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">현재 만다라트 보기</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleReorderMode}
            className={`p-2 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition ${
              isReorderMode
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={isReorderMode ? '재배치 완료' : '재배치'}
          >
            {isReorderMode ? <Check size={20} /> : <GripHorizontal size={20} />}
            <span className="hidden sm:inline text-sm font-medium">
              {isReorderMode ? '완료' : '재배치'}
            </span>
          </button>

          {!isReorderMode && (
            <>
              <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block"></div>

              <button
                onClick={() => downloadImage('mandalart-full')}
                disabled={isExporting}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition"
                title="이미지 저장"
              >
                <Download size={20} />
                <span className="hidden sm:inline text-sm font-medium">이미지</span>
              </button>

              <button
                onClick={() => downloadPDF('mandalart-full')}
                disabled={isExporting}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition"
                title="PDF 저장"
              >
                <span className="font-bold text-xs border border-slate-600 rounded px-1">PDF</span>
                <span className="hidden sm:inline text-sm font-medium">저장</span>
              </button>

              <button
                onClick={handleShare}
                className="ml-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition flex items-center gap-2"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">공유</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center min-h-0">
        <div
          ref={exportRef}
          className={`bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-slate-200 aspect-square w-full max-w-4xl mx-auto transition-all duration-300 ${
            isReorderMode ? 'ring-2 ring-slate-900 shadow-lg scale-[0.98]' : ''
          }`}
        >
          <FullMandalartBoard
            data={data}
            isReorderMode={isReorderMode}
            orderedPositions={orderedPositions}
            onReorder={handleReorderChange}
          />
        </div>
      </div>

      {/* Reorder Mode Toast/Overlay */}
      {isReorderMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm z-50 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-sm font-medium">
            원하는 위치로 드래그하여 순서를 변경하세요. (가운데는 고정)
          </p>
        </div>
      )}
    </main>
  );
};
