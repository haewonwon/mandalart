'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';

interface AdminStats {
  userCount: number;
  mandalartCount: number;
  todaySignups: number;
  pendingFeedback: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    userCount: 0,
    mandalartCount: 0,
    todaySignups: 0,
    pendingFeedback: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      try {
        // 오늘 날짜 계산
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        // 1. 총 유저 수
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // 2. 총 만다라트 수
        const { count: mandalartCount } = await supabase
          .from('mandalarts')
          .select('*', { count: 'exact', head: true });

        // 3. 오늘의 가입자 수
        const { count: todaySignups } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayISO);

        // 4. 미해결 티켓 수
        const { count: pendingFeedback } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('is_resolved', false);

        setStats({
          userCount: userCount ?? 0,
          mandalartCount: mandalartCount ?? 0,
          todaySignups: todaySignups ?? 0,
          pendingFeedback: pendingFeedback ?? 0,
        });
      } catch (error) {
        console.error('통계 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};

