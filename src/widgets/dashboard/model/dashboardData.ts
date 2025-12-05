import type { MandalartCardProps } from '@/entities/mandalart/ui/MandalartCard';

export const dashboardStatusMessage = '총 3개의 만다라트가 기록되었습니다.';

// 위치 기반 ID 적용 (northWest, north, northEast...)
export const defaultDashboardCards: MandalartCardProps[] = [
  {
    id: 'northWest',
    title: '2025 크리에이티브 우주',
    status: '진행 중',
    gridPreview: [
      { id: 'c1', label: '전시' },
      { id: 'c2', label: '인사이트' },
      { id: 'c3', label: '출간' },
      { id: 'c4', label: '리서치' },
      { id: 'c5', label: '핵심' },
      { id: 'c6', label: '콜라보' },
      { id: 'c7', label: '오프라인' },
      { id: 'c8', label: '피드백' },
      { id: 'c9', label: '기록' },
    ],
  },
  {
    id: 'north',
    title: '일상 루틴 리부트',
    status: '설계 중',
    gridPreview: [
      { id: 'd1', label: '아침' },
      { id: 'd2', label: '집중' },
      { id: 'd3', label: '브레이크' },
      { id: 'd4', label: '야외' },
      { id: 'd5', label: '핵심' },
      { id: 'd6', label: '운동' },
      { id: 'd7', label: '취침' },
      { id: 'd8', label: '리뷰' },
      { id: 'd9', label: '감사' },
    ],
  },
  {
    id: 'northEast',
    title: '28일 감정 아카이브',
    status: '진행 중',
    gridPreview: [
      { id: 'p1', label: '감사' },
      { id: 'p2', label: '기록' },
      { id: 'p3', label: '산책' },
      { id: 'p4', label: '독서' },
      { id: 'p5', label: '핵심' },
      { id: 'p6', label: '휴식' },
      { id: 'p7', label: '콜라주' },
      { id: 'p8', label: '피드백' },
      { id: 'p9', label: '공유' },
    ],
  },
  {
    id: 'west',
    title: '사이드 프로젝트 팜',
    status: '설계 중',
    gridPreview: [
      { id: 'q1', label: '아이디어' },
      { id: 'q2', label: '연구' },
      { id: 'q3', label: '메모' },
      { id: 'q4', label: '프로토' },
      { id: 'q5', label: '핵심' },
      { id: 'q6', label: '테스트' },
      { id: 'q7', label: '정리' },
      { id: 'q8', label: '공유' },
      { id: 'q9', label: '회고' },
    ],
  },
];
