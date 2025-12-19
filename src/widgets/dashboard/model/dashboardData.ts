import type { MandalartCardProps } from '@/entities/mandalart';

export const dashboardStatusMessage = '현재 진행 중인 만다라트가 없습니다.';

// API 연동 전까지는 빈 배열로 둡니다.
// 실제 데이터는 Supabase에서 가져와야 합니다.
export const defaultDashboardCards: MandalartCardProps[] = [];
