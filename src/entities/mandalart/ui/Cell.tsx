type CellType = 'center-main' | 'center-other' | 'subgrid-center' | 'subgrid-other';

export const MandalartCellItem = ({ 
  label, 
  isCenter,
  emptyText = '비어있음',
  cellType
}: { 
  label: string; 
  isCenter?: boolean;
  emptyText?: string;
  cellType?: CellType;
}) => {
  // cellType이 제공되면 그것을 우선 사용, 없으면 기존 isCenter 로직 사용
  const getCellStyles = () => {
    if (cellType) {
      switch (cellType) {
        case 'center-main':
          return 'bg-gray-800 text-white font-bold';
        case 'center-other':
          return 'bg-gray-300 text-gray-800';
        case 'subgrid-center':
          return 'bg-gray-300 text-gray-800';
        case 'subgrid-other':
          return 'bg-white text-gray-700 hover:bg-gray-50';
        default:
          return 'bg-white text-gray-700 hover:bg-gray-50';
      }
    }
    // 기존 로직 (다른 곳에서 사용하는 경우를 위해 유지)
    return isCenter ? 'bg-gray-800 text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-50';
  };

  return (
    <div
      className={`flex items-center justify-center aspect-square p-2 text-center text-sm border ${getCellStyles()}`}
    >
      {label || emptyText}
    </div>
  );
};
