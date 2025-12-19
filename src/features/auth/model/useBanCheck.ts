'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getBanStatus } from '@/shared/api';
import { useAuthSession } from './useAuthSession';

/**
 * 사용자 차단 상태 확인 및 리다이렉트 훅
 * @description 차단된 사용자를 /banned 페이지로 리다이렉트
 */
export const useBanCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading: isSessionLoading } = useAuthSession();

  const { data: isBanned } = useQuery({
    queryKey: ['banStatus'],
    queryFn: getBanStatus,
    enabled: !!session?.user && !isSessionLoading, // 세션이 있을 때만 실행
    staleTime: 1000 * 60, // 1분간 캐시 유지
    retry: false,
  });

  useEffect(() => {
    // 로딩 중이거나 세션이 없으면 체크하지 않음
    if (isSessionLoading || !session?.user) return;

    // 이미 차단 페이지에 있다면 무한 리다이렉트 방지
    if (pathname === '/banned') return;

    // 피드백 페이지는 차단된 유저도 접근 가능
    if (pathname === '/feedback') return;

    // 차단되었다면 차단 페이지로 이동
    if (isBanned === true) {
      router.replace('/banned');
    }
  }, [isBanned, session, isSessionLoading, pathname, router]);
};
