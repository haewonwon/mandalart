import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Mandalart } from '@/entities/mandalart/model/types';

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

  // 2. 병렬로 데이터 패칭 (Promise.all)
  const [profileResult, mandalartsResult] = await Promise.all([
    supabase.from('profiles').select('nickname').eq('id', user.id).single(),
    supabase
      .from('mandalarts')
      .select(
        `
        *,
        current_version:mandalart_versions!fk_current_version(*)
      `
      )
      .eq('user_id', user.id)
      .order('year', { ascending: false }),
  ]);

  const nickname = profileResult.data?.nickname || user.email?.split('@')[0] || 'Guest';
  const mandalarts = (mandalartsResult.data || []) as unknown as Mandalart[];

  if (mandalartsResult.error) {
    console.error('Mandalart Fetch Error:', mandalartsResult.error);
  }

  return {
    nickname,
    mandalarts,
  };
}

