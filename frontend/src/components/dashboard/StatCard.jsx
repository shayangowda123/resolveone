const StatCard = ({
  label,
  value,
  description,
  icon,
}) => {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1422] p-6 transition-all duration-300 hover:border-indigo-400/20 hover:bg-[#11192b]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-4xl font-semibold text-white">
            {value}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default StatCard