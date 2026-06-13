const VideoCardSkeleton = ({ compact = false }) => (
  <div className={compact ? "w-[260px] shrink-0" : "w-full"}>
    <div className="skeleton aspect-video w-full rounded-xl" />
    <div className="mt-3 flex gap-3">
      <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2 py-0.5">
        <div className="skeleton h-3.5 w-[90%] rounded" />
        <div className="skeleton h-3.5 w-[60%] rounded" />
        <div className="skeleton h-3 w-[40%] rounded" />
      </div>
    </div>
  </div>
);

export default VideoCardSkeleton;
