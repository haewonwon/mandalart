'use client';

type MiniGridPreviewProps = {
  cells: Array<{ id: string; label: string }>;
};

export const MiniGridPreview = ({ cells }: MiniGridPreviewProps) => {
  const normalized = cells.slice(0, 9);

  return (
    <div className="grid aspect-square w-full max-w-[160px] grid-cols-3 gap-1">
      {normalized.map((cell) => (
        <div
          key={cell.id}
          className="flex items-center justify-center rounded bg-slate-100 text-center text-[10px] font-medium text-slate-600"
        >
          {cell.label}
        </div>
      ))}
    </div>
  );
};
