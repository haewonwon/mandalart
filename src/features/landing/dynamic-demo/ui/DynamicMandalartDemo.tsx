'use client';

import { useDynamicDemo } from '../model/useDynamicDemo';

export const DynamicMandalartDemo = () => {
  const { currentTheme, currentTone } = useDynamicDemo();
  const gridGoals = [
    ...currentTheme.aroundGoals.slice(0, 4),
    currentTheme.centerGoal,
    ...currentTheme.aroundGoals.slice(4),
  ];

  return (
    <section className="flex w-full flex-col items-center justify-center gap-2 py-6 md:items-start">
      <div className="w-full text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">mandalart preview</p>
        <h2
          className={`min-h-15 text-2xl font-semibold tracking-tight transition-colors duration-500 ${currentTone.headingText}`}
          key={currentTheme.title}
        >
          {currentTheme.title}
        </h2>
      </div>

      <div className="grid aspect-square w-full max-w-sm grid-cols-3 grid-rows-3 gap-3 rounded-2xl border border-slate-300 bg-white/90 p-4 shadow-sm transition-all duration-500 md:mx-0 md:self-start">
        {gridGoals.map((keyword, idx) => {
          const isCenter = idx === 4;

          return (
            <div
              key={`${currentTheme.title}-${idx}`}
              className={`flex items-center justify-center rounded-lg border text-center font-medium transition-all duration-500 ${
                isCenter
                  ? `${currentTone.highlightBg} ${currentTone.highlightText} ${currentTone.highlightBorder} text-base`
                  : `${currentTone.baseBg} ${currentTone.baseText} ${currentTone.baseBorder} text-sm`
              }`}
            >
              <span className="tracking-tight">{keyword}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
