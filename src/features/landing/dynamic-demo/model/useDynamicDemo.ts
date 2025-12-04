'use client';

import { useState, useEffect } from 'react';
import type { DemoTone, DemoTheme } from './demoData';
import { DEMO_THEMES, DEMO_COLORS } from './demoData';

type DynamicDemoState = {
  currentTheme: DemoTheme;
  currentTone: DemoTone;
};

export const useDynamicDemo = (): DynamicDemoState => {
  const [index, setIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % DEMO_THEMES.length);
      setColorIndex((prev) => (prev + 1) % DEMO_COLORS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentTheme: DEMO_THEMES[index],
    currentTone: DEMO_COLORS[colorIndex],
  };
};
