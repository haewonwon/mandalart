'use client';

import { useState } from 'react';
import type { MandalartCenterGrid, MandalartGrid } from '@/entities/mandalart/model/types';
import { useNewMandalart } from '@/features/mandalart/create/model/useNewMandalart';
import { Grid3x3 } from '@/shared/ui/Grid';
import { MandalartCellItem } from '@/entities/mandalart/ui/Cell';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const MandalartNewPage = () => {
  const [centerGrid, setCenterGrid] = useState<MandalartCenterGrid | null>(null);
  const [centerInputs, setCenterInputs] = useState<string[]>(() => Array(9).fill(''));
  const { needsCenter, seedOptions, canExpand, generateGridFromSeed } = useNewMandalart({
    centerGrid,
  });
  const [selectedSeed, setSelectedSeed] = useState<string>('');
  const [committedSeed, setCommittedSeed] = useState<string | null>(null);
  const [generatedGrid, setGeneratedGrid] = useState<MandalartGrid | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSeedChange = (nextValue: string) => {
    setSelectedSeed(nextValue);
  };

  const handleCenterInputChange = (index: number, value: string) => {
    setCenterInputs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleCenterSave = () => {
    const centerLabel = centerInputs[4]?.trim();
    const hasSurrounding = centerInputs.some((label, idx) => idx !== 4 && label.trim().length > 0);

    if (!centerLabel) {
      alert('가운데 목표를 입력해 주세요.');
      return;
    }
    if (!hasSurrounding) {
      alert('주변 목표를 최소 한 개 이상 입력해 주세요.');
      return;
    }

    const nextGrid = centerInputs.map((label, idx) => ({
      id: `center-${idx + 1}`,
      label: label.trim(),
      completed: false,
    })) as MandalartCenterGrid;

    setCenterGrid(nextGrid);
    setCenterInputs(Array(9).fill(''));
    setSelectedSeed('');
    setCommittedSeed(null);
    setGeneratedGrid(null);
  };

  const handleGenerate = () => {
    if (!selectedSeed) return;
    const needsConfirm = committedSeed && committedSeed !== selectedSeed;
    if (needsConfirm && !window.confirm('변경하시겠습니까? 저장 안 했으면 날아갑니다.')) {
      setSelectedSeed(committedSeed);
      return;
    }

    try {
      const nextGrid = generateGridFromSeed(selectedSeed);
      setGeneratedGrid(nextGrid);
      setCommittedSeed(selectedSeed);
    } catch (error) {
      console.error(error);
      alert('만다라트 생성 중 오류가 발생했습니다.');
    }
  };

  const handleSave = async () => {
    if (!generatedGrid || !committedSeed) {
      alert('생성된 만다라트가 없습니다.');
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // TODO: Supabase 저장 로직 연동
      alert('만다라트 저장 기능이 곧 구현됩니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 bg-slate-50 min-h-screen">
      {/* Custom Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">새 만다라트 만들기</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-12 sm:px-8 bg-white">
        <section className="w-full max-w-4xl space-y-8">
          <header className="mb-6 space-y-2 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">MANDALART</p>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">새로운 우주 설계</h2>
            <p className="text-base text-slate-600">
              중심 만다라트와 확장 목표 조건을 충족했을 때 새로운 9x9 만다라트를 생성할 수 있습니다.
            </p>
          </header>

          {needsCenter ? (
            <div className="space-y-5 rounded-lg bg-slate-100 px-6 py-5 text-sm text-slate-700">
              <p>아직 중심 만다라트가 없어요.</p>
              <p className="text-xs text-slate-500">
                가운데 목표와 주변 목표 중 최소 하나를 입력해야 확장할 수 있습니다.
              </p>
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
              <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleCenterSave}
                  className="inline-flex items-center justify-center rounded-full border border-slate-900 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
                >
                  중심 만다라트 저장하기
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!committedSeed && (
                <>
                  <div className="rounded-lg bg-slate-50 px-6 py-5">
                    <h2 className="text-lg font-semibold text-slate-900">확장 조건</h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                      <li>가운데 만다라트가 존재해야 합니다.</li>
                      <li>주변 목표 8개 중 최소 1개 이상이 작성되어야 합니다.</li>
                      <li>확장할 목표를 선택하면 해당 목표를 중심으로 9x9 격자가 생성됩니다.</li>
                    </ul>
                  </div>

                  {seedOptions.length === 0 && (
                    <div className="rounded-lg bg-amber-50/80 px-6 py-5 text-sm text-amber-900">
                      <p>작성된 주변 목표가 없어요.</p>
                      <p className="mt-1">
                        중심 만다라트에서 최소 한 개 이상의 목표를 입력해 주세요.
                      </p>
                    </div>
                  )}
                </>
              )}

              {seedOptions.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    확장할 목표 선택
                    <select
                      className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                      value={selectedSeed}
                      onChange={(event) => handleSeedChange(event.target.value)}
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
                      onClick={handleGenerate}
                      className="flex-1 rounded-full border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {committedSeed
                        ? '선택한 목표로 다시 생성하기'
                        : '선택한 목표로 만다라트 생성하기'}
                    </button>
                    <button
                      type="button"
                      disabled={!generatedGrid || isSaving}
                      onClick={handleSave}
                      className="flex-1 rounded-full border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? '저장 중...' : '현재 상태 저장'}
                    </button>
                  </div>

                  {generatedGrid && (
                    <div className="space-y-3 rounded-lg bg-slate-50 px-6 py-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                        new center grid
                      </h3>
                      <Grid3x3 className="gap-1">
                        {generatedGrid.center.map((cell, index) => (
                          <MandalartCellItem
                            key={cell.id}
                            label={cell.label}
                            isCenter={index === 4}
                          />
                        ))}
                      </Grid3x3>
                      <p className="text-xs text-slate-500">
                        선택한 목표를 중심으로 새로운 3x3 정열이 생성되었습니다. 주변 8칸을 채워
                        보세요.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
