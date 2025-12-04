export const MandalartCellItem = ({ title, isCenter }: { title: string; isCenter?: boolean }) => {
  return (
    <div
      className={`flex items-center justify-center aspect-square p-2 text-center text-sm border
      ${isCenter ? 'bg-gray-800 text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
    >
      {title || '비어있음'}
    </div>
  );
};
