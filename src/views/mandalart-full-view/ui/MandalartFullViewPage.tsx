'use client';

import { useState, useEffect } from 'react';
import { FullMandalartBoard } from '@/widgets/mandalart-board/ui/FullMandalartBoard';
import { useMandalartExport } from '@/features/mandalart/export/model/useMandalartExport';
import { ArrowLeft, Download, Share2, GripHorizontal, Check, X, ChevronDown, Trash2 } from 'lucide-react';
import { Loading, AlertModal, ConfirmModal } from '@/shared/ui';
import { formatError, generateShareToken } from '@/shared/lib';
import { useModal } from '@/shared/hooks';
import { type MandalartSubGridKey, type MandalartGrid, VERSION_TYPE_LABEL } from '@/entities/mandalart';
import Link from 'next/link';
import { useAllMandalarts } from '@/features/mandalart/view/model/useAllMandalarts';
import { useReorderMandalart } from '@/features/mandalart/edit/model/useReorderMandalart';
import { useMandalartVersions } from '@/features/mandalart/view/model/useMandalartVersions';
import { useDeleteMandalart } from '@/features/mandalart/delete/model/useDeleteMandalart';
import { useRouter } from 'next/navigation';

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

export const MandalartFullViewPage = () => {
  const router = useRouter();
  const modal = useModal();
  // API 데이터 연동 (모든 만다라트)
  const { data: mandalarts = [], isLoading } = useAllMandalarts();
  
  // 연도 필터 상태
  const years = Array.from(new Set(mandalarts.map((m) => m.year))).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 기본값으로 가장 최근 연도 선택
  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  // 선택된 연도의 만다라트 필터링 (가장 최근 업데이트된 것)
  const selectedMandalart = mandalarts
    .filter((m) => m.year === selectedYear)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  // 삭제 기능
  const { mutate: deleteMandalart, isPending: isDeleting } = useDeleteMandalart();

  const handleDelete = () => {
    if (!selectedMandalart) return;
    
    modal.confirm.show({
      title: '만다라트 삭제',
      message: `${selectedYear}년 만다라트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      type: 'danger',
      confirmText: '삭제',
      onConfirm: () => {
      deleteMandalart(selectedMandalart.id, {
        onSuccess: () => {
          modal.alert.show({
            type: 'success',
            message: '만다라트가 삭제되었습니다.',
          });
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        },
        onError: (error: any) => {
          modal.alert.show({
            type: 'error',
            message: formatError(error, '삭제 중 오류가 발생했습니다.'),
          });
        },
      });
      },
    });
  };

  // 선택된 만다라트의 모든 버전 조회
  const { data: versions = [], isLoading: isVersionsLoading } = useMandalartVersions(selectedMandalart?.id || null);

  // 버전 필터 상태
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // 기본값으로 가장 최근 버전 선택
  useEffect(() => {
    if (versions.length > 0 && selectedVersionId === null) {
      setSelectedVersionId(versions[0].id);
    }
  }, [versions, selectedVersionId]);

  // 선택된 버전의 데이터 가져오기
  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || selectedMandalart?.current_version;
  const data = selectedVersion?.content as MandalartGrid | undefined;

  const { exportRef, downloadImage, downloadPDF, isExporting } = useMandalartExport((errorMessage) => {
    modal.alert.show({
      type: 'error',
      message: errorMessage,
    });
  });
  const [isReorderMode, setIsReorderMode] = useState(false);
  const { mutate: saveReorder, isPending: isSavingReorder } = useReorderMandalart(selectedMandalart || null);

  // 초기 배치 상태 관리
  const [orderedPositions, setOrderedPositions] = useState<(MandalartSubGridKey | 'center')[]>(DEFAULT_ORDER);
  const [initialOrderedPositions, setInitialOrderedPositions] = useState<(MandalartSubGridKey | 'center')[]>(DEFAULT_ORDER);

  // 데이터가 변경될 때 orderedPositions 초기화
  useEffect(() => {
    setOrderedPositions(DEFAULT_ORDER);
    setInitialOrderedPositions(DEFAULT_ORDER);
    setSelectedVersionId(null); // 버전도 초기화
  }, [selectedMandalart?.id]);

  const handleShare = () => {
    if (!selectedMandalart) return;
    
    // 공유 토큰 생성
    const shareToken = generateShareToken(selectedMandalart.id);
    
    // 공유 링크 생성 (공개 페이지로 직접 접근)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${baseUrl}/share/${shareToken}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      modal.alert.show({
        type: 'success',
        message: '공유 링크가 클립보드에 복사되었습니다.',
      });
    });
  };

  const handleStartReorder = () => {
    // 재배치 모드 시작 시 현재 순서를 초기값으로 저장
    setInitialOrderedPositions([...orderedPositions]);
    setIsReorderMode(true);
  };

  const handleCancelReorder = () => {
    // 취소 시 초기값으로 복원
    setOrderedPositions([...initialOrderedPositions]);
    setIsReorderMode(false);
  };

  const handleSaveReorder = () => {
    // 변경사항이 있는지 확인
    const hasChanges = JSON.stringify(orderedPositions) !== JSON.stringify(initialOrderedPositions);
    
    if (!hasChanges) {
      modal.alert.show({
        type: 'info',
        message: '변경사항이 없습니다.',
      });
      setIsReorderMode(false);
      return;
    }

    // 재배치 모드 종료 시 저장
    saveReorder(orderedPositions, {
      onSuccess: () => {
        modal.alert.show({
          type: 'success',
          message: '재배치가 저장되었습니다.',
        });
        setOrderedPositions(DEFAULT_ORDER);
        setInitialOrderedPositions(DEFAULT_ORDER);
        setIsReorderMode(false);
      },
      onError: (error: any) => {
        modal.alert.show({
          type: 'error',
          message: formatError(error, '재배치 저장에 실패했습니다.'),
        });
      },
    });
  };

  const handleReorderChange = (newOrder: (MandalartSubGridKey | 'center')[]) => {
    setOrderedPositions(newOrder);
  };


  if (isLoading) {
    return <Loading variant="fullscreen" size={32} />;
  }

  // 데이터가 없는 경우 처리
  if (!isLoading && mandalarts.length === 0) {
    return (
      <main className="flex flex-col flex-1 bg-slate-50 h-full">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center gap-4 shadow-sm">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">전체 만다라트 보기</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-8 text-slate-500">
          표시할 만다라트가 없습니다. 먼저 만다라트를 생성해주세요.
        </div>
      </main>
    );
  }

  // 선택된 연도에 만다라트가 없는 경우
  if (!isLoading && selectedYear !== null && !data) {
    return (
      <main className="flex flex-col flex-1 bg-slate-50 h-full">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4 mb-3">
              <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="font-semibold text-slate-900 text-lg">전체 만다라트 보기</h1>
            </div>
            {years.length > 0 && (
              <div className="flex items-center gap-1 -mx-1">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
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
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center p-8 text-slate-500">
          {selectedYear}년에 생성된 만다라트가 없습니다.
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 bg-slate-50 h-full">
      {/* Header / Actions Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/dashboard" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </Link>
              <h1 className="font-semibold text-slate-900 text-base sm:text-lg">전체 만다라트 보기</h1>
            </div>

            <div className="flex items-center gap-2">
              {isReorderMode ? (
                <>
                  <button
                    onClick={handleCancelReorder}
                    disabled={isSavingReorder}
                    className="p-2 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="취소"
                  >
                    <X size={20} />
                    <span className="hidden sm:inline text-sm font-medium">취소</span>
                  </button>
                  <button
                    onClick={handleSaveReorder}
                    disabled={isSavingReorder}
                    className="p-2 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="저장"
                  >
                    {isSavingReorder ? (
                      <Loading variant="button" size={20} />
                    ) : (
                      <Check size={20} />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">
                      {isSavingReorder ? '저장 중...' : '저장'}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartReorder}
                    className="p-2 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition text-slate-600 hover:bg-slate-100"
                    title="재배치"
                  >
                    <GripHorizontal size={20} />
                    <span className="hidden sm:inline text-sm font-medium">재배치</span>
                  </button>
                </>
              )}

              {!isReorderMode && (
                <>
                  <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block"></div>

                  <button
                    onClick={() => {
                      const fileName = `mandalart-${selectedYear || 'unknown'}-v${selectedVersion?.version || 'latest'}`;
                      downloadImage(fileName, selectedYear);
                    }}
                    disabled={isExporting}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition"
                    title="이미지 저장"
                  >
                    <Download size={20} />
                    <span className="hidden sm:inline text-sm font-medium">이미지</span>
                  </button>

                  <button
                    onClick={() => {
                      const fileName = `mandalart-${selectedYear || 'unknown'}-v${selectedVersion?.version || 'latest'}`;
                      downloadPDF(fileName);
                    }}
                    disabled={isExporting}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-full sm:rounded-md sm:px-3 sm:py-2 flex items-center gap-2 transition"
                    title="PDF 저장"
                  >
                    <span className="font-bold text-xs border border-slate-600 rounded px-1">PDF</span>
                    <span className="hidden sm:inline text-sm font-medium">저장</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="ml-2 bg-slate-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-800 transition flex items-center gap-1.5 sm:gap-2"
                  >
                    <Share2 size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">공유</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Year Filter Tabs and Delete Button */}
          {years.length > 0 && (
            <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
              <div className="flex items-center gap-0.5 sm:gap-1 -mx-1">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      selectedYear === year
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {year}년
                  </button>
                ))}
              </div>
              
              {/* 삭제 버튼 */}
              {selectedMandalart && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`${selectedYear}년 만다라트 삭제`}
                >
                  {isDeleting ? (
                    <Loading variant="button" size={14} className="sm:w-4 sm:h-4" />
                  ) : (
                    <Trash2 className="sm:w-4 sm:h-4" size={14} />
                  )}
                  <span className="hidden sm:inline">삭제</span>
                </button>
              )}
            </div>
          )}

          {/* Version Filter Dropdown */}
          {versions.length > 0 && !isVersionsLoading && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <label className="text-[10px] sm:text-xs font-medium text-slate-600">버전:</label>
              <div className="relative inline-block">
                <select
                  value={selectedVersionId || ''}
                  onChange={(e) => setSelectedVersionId(e.target.value)}
                  className="appearance-none rounded-md border border-slate-300 bg-white pl-2 pr-6 sm:pl-3 sm:pr-8 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {versions.map((version) => {
                    const versionTypeLabel = version.version_type ? VERSION_TYPE_LABEL[version.version_type] : '알 수 없음';
                    return (
                      <option key={version.id} value={version.id}>
                        v{version.version} - {versionTypeLabel}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none sm:w-4 sm:h-4"
                  size={14}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-auto p-2 sm:p-8 flex items-center justify-center min-h-0">
        <div
          className={`bg-white p-1.5 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 aspect-square w-full max-w-4xl mx-auto transition-all duration-300 min-w-0 min-h-0 ${
            isReorderMode ? 'ring-2 ring-slate-900 shadow-lg scale-[0.98]' : ''
          }`}
        >
          <FullMandalartBoard
            data={data}
            isReorderMode={isReorderMode}
            orderedPositions={orderedPositions}
            onReorder={handleReorderChange}
            exportRef={exportRef}
          />
        </div>
      </div>

      {/* Reorder Mode Toast/Overlay */}
      {isReorderMode && (
        <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg backdrop-blur-sm z-50 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-xs sm:text-sm font-medium">
            원하는 위치로 드래그하여 순서를 변경하세요. (가운데는 고정)
          </p>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={modal.alert.isOpen}
        onClose={modal.alert.hide}
        title={modal.alert.title}
        message={modal.alert.message}
        type={modal.alert.type}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.confirm.isOpen}
        onClose={modal.confirm.hide}
        onConfirm={modal.confirm.onConfirm}
        onCancel={modal.confirm.onCancel}
        title={modal.confirm.title}
        message={modal.confirm.message}
        confirmText={modal.confirm.confirmText}
        cancelText={modal.confirm.cancelText}
        type={modal.confirm.type}
      />
    </main>
  );
};
