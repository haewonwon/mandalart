export const Grid3x3 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`grid grid-cols-3 grid-rows-3 gap-2 ${className}`}>{children}</div>;
};
