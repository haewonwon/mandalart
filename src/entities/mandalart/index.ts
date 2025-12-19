/**
 * 만다라트 엔티티 Public API
 * @description 외부(Features, Widgets, Views)에서 사용할 수 있는 만다라트 관련 컴포넌트 및 타입을 export합니다.
 * @note 내부 전용 함수(lib, api 등)는 export하지 않습니다 (캡슐화)
 */

// UI 컴포넌트
export { MandalartCellItem, MandalartCard, MiniGridPreview } from './ui';

// 타입 정의
export type {
  MandalartVersionType,
  MandalartCell,
  MandalartCenterGrid,
  MandalartSubGridKey,
  MandalartGrid,
  MandalartContent,
  CellType,
  MandalartCardProps,
  MiniGridPreviewProps,
  MandalartVersion,
  MandalartProject,
  Mandalart,
} from './model';

export { VERSION_TYPE_LABEL } from './model';
