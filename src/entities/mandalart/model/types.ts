export type MandalartCell = {
  id: string;
  title: string;
  isCompleted: boolean;
  color?: string; // 나중에 힙하게 꾸밀 때 필요
};

// 3x3 격자 하나 (Cluster)
export type MandalartCluster = {
  id: string;
  centerCell: MandalartCell; // 가운데 핵심 목표
  surroundingCells: MandalartCell[]; // 주변 8개
};

// 전체 9x9 보드
export type MandalartBoardData = {
  mainCluster: MandalartCluster; // 정중앙
  subClusters: MandalartCluster[]; // 주변 8개 확장
};
