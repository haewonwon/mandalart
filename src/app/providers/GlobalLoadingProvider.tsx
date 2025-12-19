'use client';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Loading } from '@/shared/ui';

/**
 * React Query 전역 로딩 상태를 감지하여 표시하는 Provider
 * @description 모든 React Query 요청(fetch/mutate)의 로딩 상태를 전역으로 감지하여 상단에 로딩 바 표시
 */
export const GlobalLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-slate-200">
            <div className="h-full bg-slate-900 animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}
      {children}
    </>
  );
};
