export function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Overall health</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">92 / 100</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Your computer is performing well overall, with a few opportunities to improve responsiveness.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
            Healthy and responsive
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-6">
          <h3 className="text-lg font-semibold text-white">Recent findings</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>• Steam is downloading a game in the background.</li>
            <li>• Chrome has several tabs open and is using significant memory.</li>
            <li>• Your SSD is 78% full and may slow down over time.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/6 p-6">
          <h3 className="text-lg font-semibold text-white">Resource overview</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['CPU', 'Stable'],
              ['Memory', 'Moderate usage'],
              ['Disk', 'Busy'],
              ['Battery', 'Normal'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
