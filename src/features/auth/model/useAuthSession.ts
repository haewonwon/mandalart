'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/shared/lib';
import { getSession } from '@/shared/api';

/**
 * 현재 사용자 세션 조회 훅
 * @returns 세션 정보 및 로딩 상태
 * @description React Query를 사용하여 세션 조회 및 인증 상태 변경 감지
 */
export const useAuthSession = () => {
  const {
    data: session,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 0, // 항상 최신 상태 유지
    refetchOnWindowFocus: true,
  });

  // 인증 상태 변경 감지
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // 인증 상태가 변경되면 쿼리 재실행
      refetch();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  return {
    session: session ?? null,
    isLoading,
  };
};
