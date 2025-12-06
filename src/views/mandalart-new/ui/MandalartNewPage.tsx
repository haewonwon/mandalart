'use client';

import { useState, useRef } from 'react';
import { Grid3x3 } from '@/shared/ui/Grid';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Pencil } from 'lucide-react';
import { useCreateWizard } from '@/features/mandalart/create/model/useCreateWizard';
import { useModal } from '@/shared/hooks/useModal';
import { AlertModal } from '@/shared/ui/AlertModal';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { formatError } from '@/shared/lib/error/formatError';

export const MandalartNewPage = () => {
  const modal = useModal();
  const pendingActionRef = useRef<{ type: 'edit' | 'expand' | 'reset'; seed?: string } | null>(null);
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);

  const {
    // State
    year,
    setYear,
    centerInputs,
    centerGrid,
    generatedGrid,
    selectedSeed,
    setSelectedSeed,
    committedSeed,
    isLoading,

    // Computed
    seedOptions,
    canExpand,

    // Actions
    handleCenterInputChange,
    saveCenterGrid,
    editCenterGrid,
    doEditCenterGrid,
    handleSubGridInputChange,
    expandGrid,
    doExpandGrid,
    resetExpand,
    doResetExpand,
    saveMandalart,
  } = useCreateWizard();

  const handleSaveCenterGrid = () => {
    saveCenterGrid((errorMessage) => {
      modal.alert.show({
        type: 'error',
        message: errorMessage,
      });
    });
  };

  const handleEditCenterGrid = () => {
    editCenterGrid(() => {
      // 확인이 필요한 경우
      modal.confirm.show({
        title: '핵심 만다라트 수정',
        message: '핵심 만다라트를 수정하시겠습니까? 확장된 내용은 초기화됩니다.',
        type: 'warning',
        onConfirm: () => {
          doEditCenterGrid();
        },
      });
    });
  };

  const handleExpandGrid = () => {
    if (!selectedSeed) return;

    try {
      expandGrid(() => {
        // 확인이 필요한 경우
        modal.confirm.show({
          title: '목표 변경',
          message: '변경하시겠습니까? 저장하지 않은 내용은 사라집니다.',
          type: 'warning',
          onConfirm: () => {
            try {
              doExpandGrid();
            } catch (error: any) {
              modal.alert.show({
                type: 'error',
                message: formatError(error, '만다라트 생성 중 오류가 발생했습니다.'),
              });
            }
          },
        });
      });
    } catch (error: any) {
      modal.alert.show({
        type: 'error',
        message: formatError(error, '만다라트 생성 중 오류가 발생했습니다.'),
      });
    }
  };

  const handleResetExpand = () => {
    resetExpand(() => {
      // 확인이 필요한 경우
      modal.confirm.show({
        title: '확장 내용 초기화',
        message: '확장된 내용을 초기화하시겠습니까? 입력한 내용은 사라집니다.',
        type: 'warning',
        onConfirm: () => {
          doResetExpand();
        },
      });
    });
  };

  const handleSaveMandalart = () => {
    saveMandalart(undefined, {
      onSuccess: () => {
        modal.alert.show({
          type: 'success',
          message: '저장되었습니다.',
        });
      },
      onError: (error: any) => {
        modal.alert.show({
          type: 'error',
          message: formatError(error, '저장 중 오류가 발생했습니다.'),
        });
      },
    });
  };

  return (
    <main className="flex flex-col flex-1 bg-slate-50 min-h-screen">
      {/* Custom Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">새 만다라트 만들기</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-12 sm:px-8 bg-white">
        <section className="w-full max-w-4xl space-y-8">
          <header className="mb-6 space-y-2 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">MANDALART</p>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">새 만다라트 만들기</h2>
            <p className="text-base text-slate-600">
              중심 만다라트와 확장 목표 조건을 충족했을 때 새로운 9x9 만다라트를 생성할 수 있습니다.
            </p>
          </header>

          {/* 1. 연도 선택 */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">목표 연도</label>
            <div className="relative inline-block">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="appearance-none rounded-md border border-slate-300 bg-white pl-3 pr-8 py-2 text-sm font-medium text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                disabled={!!centerGrid}
              >
                {yearOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}년
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Step 1 완료 상태 (요약) - Step 2 진행 중일 때 표시 */}
          {centerGrid && (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 1. 중심 만다라트
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">{centerGrid[4].label}</span>
                  <span className="text-sm text-slate-500">및 주변 목표 설정 완료</span>
                </div>
              </div>
              <button
                onClick={handleEditCenterGrid}
                className="group flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
              >
                <Pencil size={14} className="transition group-hover:scale-110" />
                수정하기
              </button>
            </div>
          )}

          {/* 2. 중심 만다라트 입력 (Step 1) */}
          {!centerGrid ? (
            <div className="space-y-5 rounded-lg bg-slate-100 px-6 py-5 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">Step 1. 중심 만다라트 만들기</p>
                <p className="text-xs text-slate-500">
                  가운데 목표와 주변 목표 중 최소 하나를 입력해야 합니다.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {centerInputs.map((value, idx) => (
                  <input
                    key={`center-input-${idx}`}
                    value={value}
                    onChange={(event) => handleCenterInputChange(idx, event.target.value)}
                    placeholder={idx === 4 ? '중심 목표' : `주변 목표 ${idx + 1}`}
                    className={`rounded border border-slate-300 bg-white px-2 py-2 text-sm focus:border-slate-900 focus:outline-none ${
                      idx === 4 ? 'font-semibold text-slate-900' : ''
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCenterGrid}
                  className="inline-flex items-center justify-center rounded-full border border-slate-900 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
                >
                  중심 만다라트 저장하기
                </button>
              </div>
            </div>
          ) : (
            /* Step 2. 확장하기 */
            <div className="space-y-6">
              <div className="rounded-lg bg-slate-50 px-6 py-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Step 2. 확장하기 (선택)</h2>
                  <div className="flex items-center gap-3">
                    {generatedGrid && (
                      <button
                        type="button"
                        onClick={handleResetExpand}
                        className="text-sm font-medium text-red-500 hover:text-red-600 underline underline-offset-4"
                      >
                        확장 취소
                      </button>
                    )}
                    {!generatedGrid && (
                      <button
                        type="button"
                        onClick={handleSaveMandalart}
                        disabled={isLoading}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4"
                      >
                        여기서 저장하고 끝내기
                      </button>
                    )}
                  </div>
                </div>

                {!committedSeed && (
                  <div className="text-sm text-slate-600 space-y-2">
                    <p>중심 만다라트가 설정되었습니다.</p>
                    {seedOptions.length === 0 ? (
                      <p className="text-amber-600">확장 가능한 주변 목표가 없습니다.</p>
                    ) : (
                      <p>아래에서 목표를 선택하여 9x9 만다라트로 확장할 수 있습니다.</p>
                    )}
                  </div>
                )}

                {seedOptions.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      확장할 목표 선택
                      <select
                        className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                        value={selectedSeed}
                        onChange={(event) => setSelectedSeed(event.target.value)}
                        disabled={!canExpand}
                      >
                        <option value="">목표를 선택하세요</option>
                        {seedOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        disabled={!canExpand || !selectedSeed}
                        onClick={handleExpandGrid}
                        className="flex-1 rounded-full border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {committedSeed
                          ? '선택한 목표로 다시 생성하기'
                          : '선택한 목표로 만다라트 생성하기'}
                      </button>

                      {generatedGrid && (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={handleSaveMandalart}
                          className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isLoading ? '저장 중...' : '최종 저장하기'}
                        </button>
                      )}
                    </div>

                    {generatedGrid && (
                      <div className="space-y-3 rounded-lg bg-white border border-slate-200 px-6 py-5 mt-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                          세부 목표 설정
                        </h3>
                        <Grid3x3 className="gap-2">
                          {generatedGrid.center.map((cell, index) => (
                            <input
                              key={cell.id}
                              value={cell.label}
                              onChange={(e) => handleSubGridInputChange(index, e.target.value)}
                              disabled={index === 4}
                              placeholder={index === 4 ? '' : `세부 목표 ${index + 1}`}
                              className={`w-full aspect-square p-2 text-center text-sm border rounded focus:border-slate-900 focus:outline-none
                                ${
                                  index === 4
                                    ? 'bg-slate-100 font-bold text-slate-900 cursor-default'
                                    : 'bg-white'
                                }`}
                            />
                          ))}
                        </Grid3x3>
                        <p className="text-xs text-slate-500">
                          * 선택한 목표가 중심으로 이동했습니다. 나머지 8칸을 자유롭게 채워보세요.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

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
