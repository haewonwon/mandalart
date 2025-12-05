export type MandalartCell = {
  id: string;
  title: string;
  isCompleted: boolean;
  color?: string;
};

export type MandalartCluster = {
  id: string;
  centerCell: MandalartCell;
  surroundingCells: MandalartCell[];
};

export type MandalartBoardData = {
  mainCluster: MandalartCluster;
  subClusters: MandalartCluster[];
};

// core data for versioned mandalart grid
export type MandalartCoreCell = {
  id: string;
  label: string;
  note?: string;
  completed: boolean;
  updatedAt: string;
};

export type MandalartCenterGrid = [
  MandalartCoreCell,
  MandalartCoreCell,
  MandalartCoreCell,
  MandalartCoreCell,
  MandalartCoreCell,
  MandalartCoreCell,
  MandalartCoreCell,
  MandalartCoreCell,
  MandalartCoreCell
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

export type MandalartGrid = {
  center: MandalartCenterGrid;
  subGrids: Record<MandalartSubGridKey, MandalartCoreCell[]>;
};

export type MandalartVersion = {
  id: string;
  projectId: string;
  version: number;
  parentVersionId?: string;
  data: MandalartGrid;
  insertedAt: string;
  updatedBy?: string;
};

export type MandalartProject = {
  id: string;
  userId: string;
  year: number;
  currentVersionId: string;
  isPublic: boolean;
  versions?: MandalartVersion[];
};
