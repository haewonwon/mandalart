// 1. 기본 셀 (Cell)
// (기존 MandalartCoreCell, MandalartCell 통합)
export type MandalartCell = {
  id: string; // UUID or 'row-col'
  label: string; // title -> label (통일)
  completed: boolean; // isCompleted -> completed (DB 컬럼 매핑 고려)
  color?: string;
};

// 2. 그리드 구조 (Grid & Content)
// 3x3 그리드(9개 셀) 정의
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

export type MandalartSubGridKey =
  | 'northWest'
  | 'north'
  | 'northEast'
  | 'west'
  | 'east'
  | 'southWest'
  | 'south'
  | 'southEast';

// 9x9 전체 만다라트 구조
export type MandalartGrid = {
  center: MandalartCenterGrid;
  subGrids: Record<MandalartSubGridKey, MandalartCenterGrid>; // Record<Key, Cell[]>
};

// DB의 jsonb 컬럼 (content)에 매핑될 타입
export type MandalartContent = MandalartGrid;

// 3. 프로젝트 (DB: mandalart_projects)
export type MandalartProject = {
  id: string;
  user_id: string;
  year: number;
  title: string;
  is_public: boolean;
  current_version_id: string | null;
  created_at: string;
  updated_at: string;
};

// 4. 버전 (DB: mandalart_versions)
export type MandalartVersion = {
  id: string;
  mandalart_id: string;
  version: number;
  content: MandalartContent;
  note?: string;
  created_at: string;
};

// 5. 통합 타입 (UI용: Project + Current Version)
export type Mandalart = MandalartProject & {
  current_version?: MandalartVersion;
};
