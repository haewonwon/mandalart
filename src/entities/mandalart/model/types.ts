// =================================================================
// 1. 만다라트 버전 타입 (수정의 종류)
// =================================================================
export type MandalartVersionType =
  | 'CREATE'      // 최초 생성
  | 'EDIT_MAIN'   // 핵심 목표 수정 (Center Grid의 5번 칸)
  | 'EDIT_SUB'    // 세부 목표 수정 (Center Grid의 나머지 or Sub Grid의 5번)
  | 'EDIT_TASK'   // 실천 과제 수정 (Sub Grid의 나머지 8칸)
  | 'REORDER';    // 재배치

// UI에서 보여줄 한글 라벨 매핑
export const VERSION_TYPE_LABEL: Record<MandalartVersionType, string> = {
  CREATE: '최초 생성',
  EDIT_MAIN: '핵심 목표',
  EDIT_SUB: '세부 목표',
  EDIT_TASK: '실천과제',
  REORDER: '재배치',
};

// =================================================================
// 2. 만다라트 데이터 구조 (Grid & Content)
// =================================================================
export interface MandalartCell {
  id: string;
  label: string;
  completed: boolean;
  color?: string;
}

// 3x3 그리드 (9개 셀)
export type MandalartCenterGrid = [
  MandalartCell,
  MandalartCell,
  MandalartCell,
  MandalartCell,
  MandalartCell,
  MandalartCell,
  MandalartCell,
  MandalartCell,
  MandalartCell
];

// 서브 그리드 키 (방향)
export type MandalartSubGridKey =
  | 'northWest'
  | 'north'
  | 'northEast'
  | 'west'
  | 'east'
  | 'southWest'
  | 'south'
  | 'southEast';

// 9x9 전체 구조
export interface MandalartGrid {
  center: MandalartCenterGrid;
  subGrids: Partial<Record<MandalartSubGridKey, MandalartCenterGrid>>; // Partial: 없을 수도 있음
}

// DB의 jsonb 컬럼에 매핑
export type MandalartContent = MandalartGrid;

// =================================================================
// 3. DB 테이블 매핑 (Supabase Rows)
// =================================================================
// 'mandalart_versions' 테이블
export interface MandalartVersion {
  id: string;
  mandalart_id: string;
  version: number;
  content: MandalartContent;
  version_type: MandalartVersionType; // ✅ 위에서 정의한 5가지 타입 중 하나
  note?: string;
  created_at: string;
}

// 'mandalarts' 테이블 (헤더)
export interface MandalartProject {
  id: string;
  user_id: string;
  year: number;
  title: string;
  is_public: boolean;
  current_version_id: string | null;
  created_at: string;
  updated_at: string;
}

// 통합 타입 (UI용)
export interface Mandalart extends MandalartProject {
  current_version?: MandalartVersion;
  author?: { nickname: string; avatar_url?: string }; // 공유 기능용
}
