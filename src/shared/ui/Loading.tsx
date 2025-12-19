'use client';

import { Loader2 } from 'lucide-react';

type LoadingProps = {
  variant?: 'fullscreen' | 'inline' | 'button';
  size?: number;
  className?: string;
  text?: string;
};

/**
 * 로딩 인디케이터 컴포넌트
 * @param variant - 로딩 표시 방식 (fullscreen: 전체 화면, inline: 인라인, button: 버튼 내부)
 * @param size - 아이콘 크기 (기본값: 24)
 * @param className - 추가 CSS 클래스
 * @param text - 로딩 텍스트 (선택)
 * @description 다양한 상황에서 사용할 수 있는 로딩 컴포넌트
 */
export const Loading = ({ variant = 'inline', size = 24, className = '', text }: LoadingProps) => {
  const baseClasses = 'animate-spin text-slate-400';

  if (variant === 'fullscreen') {
    return (
      <div className={`flex h-screen w-full items-center justify-center bg-slate-50 ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={baseClasses} size={size} />
          {text && <p className="text-sm text-slate-500">{text}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return <Loader2 className={`${baseClasses} ${className}`} size={size} />;
  }

  // inline (기본값)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={baseClasses} size={size} />
      {text && <span className="ml-2 text-sm text-slate-500">{text}</span>}
    </div>
  );
};
