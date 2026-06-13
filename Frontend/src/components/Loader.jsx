const Loader = ({ label = "Loading", full = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        full ? "min-h-[60vh]" : "h-64"
      }`}
    >
      <span className="relative inline-flex h-11 w-11">
        <span className="absolute inset-0 rounded-full border-[3px] border-white/10" />
        <span className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-brand border-r-brand animate-spin" />
      </span>
      {label && (
        <span className="text-sm font-medium text-muted animate-pulse">
          {label}…
        </span>
      )}
    </div>
  );
};

export default Loader;
