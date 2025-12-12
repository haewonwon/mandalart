'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';
import { useAuthSession } from './useAuthSession';

export const useBanCheck = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading } = useAuthSession();

  useEffect(() => {
    const checkBanStatus = async () => {
      // 로딩 중이거나 세션이 없으면 체크하지 않음
      if (isLoading || !session?.user) return;

      // 이미 차단 페이지에 있다면 무한 리다이렉트 방지
      if (pathname === '/banned') return;

      // 피드백 페이지는 차단된 유저도 접근 가능
      if (pathname === '/feedback') return;

      try {
        // 내 프로필의 차단 여부(is_banned) 확인
        const { data, error } = await supabase
          .from('profiles')
          .select('is_banned')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('차단 상태 확인 실패:', error);
          return;
        }

        // 차단되었다면 차단 페이지로 이동
        if (data?.is_banned === true) {
          router.replace('/banned');
        }
      } catch (error) {
        console.error('차단 상태 확인 중 오류:', error);
      }
    };

    checkBanStatus();
  }, [session, isLoading, pathname, router]);
};
