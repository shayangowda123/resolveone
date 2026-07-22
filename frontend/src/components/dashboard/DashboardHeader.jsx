const DashboardHeader = ({
  badge,
  title,
  description,
  actions,
}) => {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.13] via-[#10152b] to-[#0c1220] p-8 shadow-2xl shadow-black/20 lg:p-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
            {badge}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
            {title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            {description}
          </p>
        </div>

        {actions && (
          <div className="flex flex-wrap gap-3">
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}

export default DashboardHeader