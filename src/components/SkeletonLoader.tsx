const SkeletonLoader = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`}></div>
  );
};

export default SkeletonLoader;

export const PageSkeleton = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <SkeletonLoader className="h-10 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonLoader className="h-40 w-full" />
        <SkeletonLoader className="h-40 w-full" />
        <SkeletonLoader className="h-40 w-full" />
      </div>
      <SkeletonLoader className="h-64 w-full" />
      <div className="space-y-4">
        <SkeletonLoader className="h-8 w-1/2" />
        <SkeletonLoader className="h-8 w-1/2" />
        <SkeletonLoader className="h-8 w-1/2" />
      </div>
    </div>
  );
};
