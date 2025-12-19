import { createClient } from '@/shared/lib';

export interface AdminStats {
  userCount: number;
  mandalartCount: number;
  todaySignups: number;
  pendingTickets: number;
}

/**
 * 관리자 대시보드 통계 조회
 * @returns 관리자 통계 데이터
 * @description 총 유저 수, 만다라트 수, 오늘 가입자 수, 미해결 티켓 수 조회
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient();

  // 오늘 날짜 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // 병렬로 모든 통계 조회
  const [userCountResult, mandalartCountResult, todaySignupsResult, pendingTicketsResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('mandalarts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
  ]);

  return {
    userCount: userCountResult.count ?? 0,
    mandalartCount: mandalartCountResult.count ?? 0,
    todaySignups: todaySignupsResult.count ?? 0,
    pendingTickets: pendingTicketsResult.count ?? 0,
  };
}

