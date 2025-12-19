/**
 * 만다라트 도메인 타입 모음
 * @description 만다라트 버전 타입, 그리드 구조, DB 매핑, UI 전용 타입 정의
 */

// =================================================================
// 1. 만다라트 버전 타입 (수정의 종류)
// =================================================================

/**
 * 만다라트 버전 타입
 * @description 생성/수정/재배치 등 버전 종류 구분
 */
export type MandalartVersionType =
  | 'CREATE' // 최초 생성
  | 'EDIT_MAIN' // 핵심 목표 수정 (Center Grid의 5번 칸)
  | 'EDIT_SUB' // 세부 목표 수정 (Center Grid의 나머지 or Sub Grid의 5번)
  | 'EDIT_TASK' // 실천 과제 수정 (Sub Grid의 나머지 8칸)
  | 'REORDER'; // 재배치

/**
 * 만다라트 버전 타입 라벨
 * @description UI에 표시할 버전 타입 한글 라벨 매핑
 */
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

/**
 * 만다라트 셀 타입
 * @description 만다라트 한 칸의 기본 데이터 구조
 */
export interface MandalartCell {
  id: string;
  label: string;
  completed: boolean;
  color?: string;
}

/**
 * 중앙 3x3 그리드 타입
 * @description 9개의 만다라트 셀로 구성된 고정 길이 배열
 */
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

/**
 * 서브 그리드 키
 * @description 8방향 서브 그리드 위치 키
 */
export type MandalartSubGridKey =
  | 'northWest'
  | 'north'
  | 'northEast'
  | 'west'
  | 'east'
  | 'southWest'
  | 'south'
  | 'southEast';

/**
 * 전체 만다라트 그리드
 * @description 중앙 그리드와 8개 서브 그리드로 구성된 9x9 구조
 */
export interface MandalartGrid {
  center: MandalartCenterGrid;
  subGrids: Partial<Record<MandalartSubGridKey, MandalartCenterGrid>>; // Partial: 없을 수도 있음
}

// =================================================================
// 2-1. UI 전용 타입 (카드/셀/미니 프리뷰 등)
// =================================================================

/**
 * 셀 타입 (센터/서브 그리드 구분)
 * @description 만다라트 셀의 시각적 역할 구분
 */
export type CellType = 'center-main' | 'center-other' | 'subgrid-center' | 'subgrid-other';

/**
 * 만다라트 카드 props
 * @description 대시보드 및 카드 컴포넌트에서 사용하는 카드 데이터
 */
export type MandalartCardProps = {
  id: string;
  title: string;
  status: string;
  gridPreview: Array<{ id: string; label: string }>;
};

/**
 * 미니 그리드 프리뷰 props
 * @description 3x3 미니 만다라트 프리뷰에 사용되는 셀 목록
 */
export type MiniGridPreviewProps = {
  cells: Array<{ id: string; label: string }>;
};

/**
 * 만다라트 콘텐츠 타입
 * @description DB jsonb 컬럼에 저장되는 만다라트 전체 그리드 데이터
 */
export type MandalartContent = MandalartGrid;

// =================================================================
// 3. DB 테이블 매핑 (Supabase Rows)
// =================================================================

/**
 * 만다라트 버전 레코드
 * @description mandalart_versions 테이블 매핑
 */
export interface MandalartVersion {
  id: string;
  mandalart_id: string;
  version: number;
  content: MandalartContent;
  version_type: MandalartVersionType; // ✅ 위에서 정의한 5가지 타입 중 하나
  note?: string;
  created_at: string;
}

/**
 * 만다라트 프로젝트 레코드
 * @description mandalarts 테이블 헤더 데이터 매핑
 */
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

/**
 * 만다라트 통합 타입
 * @description 프로젝트 정보와 현재 버전, 작성자 정보를 포함한 UI용 타입
 */
export interface Mandalart extends MandalartProject {
  current_version?: MandalartVersion;
  author?: { nickname: string; avatar_url?: string }; // 공유 기능용
}
