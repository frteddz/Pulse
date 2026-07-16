import { Bell, Search, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0b1220]/70 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="text-sm text-slate-400">Today</p>
        <h1 className="text-xl font-semibold text-white">Understanding your system</h1>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-slate-400">
          <Search size={16} />
          <input
            className="w-40 bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Search"
            aria-label="Search"
          />
        </label>
        <button className="rounded-2xl border border-white/10 bg-white/6 p-2.5 text-slate-300 transition hover:bg-white/10">
          <Bell size={16} />
        </button>
        <Link
          to="/settings"
          className="rounded-2xl border border-white/10 bg-white/6 p-2.5 text-slate-300 transition hover:bg-white/10"
        >
          <Settings2 size={16} />
        </Link>
      </div>
    </header>
  )
}
