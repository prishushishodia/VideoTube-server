const PageHeader = ({ icon: Icon, title, subtitle, action }) => (
  <header className="mb-7 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
    <div className="flex items-center gap-3.5">
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel-2">
          <Icon className="h-5 w-5 text-brand" />
        </span>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
    {action}
  </header>
);

export default PageHeader;
