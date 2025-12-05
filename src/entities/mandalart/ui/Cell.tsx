export const MandalartCellItem = ({ label, isCenter }: { label: string; isCenter?: boolean }) => {
  return (
    <div
      className={`flex items-center justify-center aspect-square p-2 text-center text-sm border
      ${isCenter ? 'bg-gray-800 text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
    >
      {label || '비어있음'}
    </div>
  );
};
