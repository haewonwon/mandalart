import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import { checkBanStatus } from '@/shared/lib/auth/checkBanStatus';
import { getMandalartsServer, getProfileNicknameServer } from '@/shared/api';

export async function getDashboardData() {
  const supabase = await createClient();

  // 1. 로그인 세션 체크
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. 차단 상태 체크
  const isBanned = await checkBanStatus(supabase, user.id);
  if (isBanned) {
    redirect('/banned');
  }

  // 3. 병렬로 데이터 패칭 (Promise.all)
  const [nicknameData, mandalarts] = await Promise.all([
    getProfileNicknameServer(user.id),
    getMandalartsServer(user.id),
  ]);

  const nickname = nicknameData || user.email?.split('@')[0] || 'Guest';

  // 가장 최근 업데이트된 만다라트 찾기
  let lastUpdatedAt: string | undefined;
  let lastUpdatedYear: number | undefined;
  
  if (mandalarts.length > 0) {
    const sortedMandalarts = [...mandalarts].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    const mostRecent = sortedMandalarts[0];
    lastUpdatedAt = mostRecent.updated_at;
    lastUpdatedYear = mostRecent.year;
  }

  return {
    nickname,
    mandalarts,
    lastUpdatedAt,
    lastUpdatedYear,
  };
}

