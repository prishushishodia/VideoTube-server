const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <div className="surface flex flex-col items-center justify-center gap-3 px-6 py-16 text-center animate-fade-up">
    {Icon && (
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel-2">
        <Icon className="h-7 w-7 text-zinc-500" />
      </span>
    )}
    <h3 className="text-lg font-semibold">{title}</h3>
    {subtitle && <p className="max-w-sm text-sm text-muted">{subtitle}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
