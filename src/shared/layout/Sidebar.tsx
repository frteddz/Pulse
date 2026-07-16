import { motion } from 'framer-motion'
import { Activity, HardDrive, Layers3, Play, Settings, Sparkles, Cpu, Gauge } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: Sparkles },
  { id: 'performance', label: 'Performance', path: '/performance', icon: Gauge },
  { id: 'storage', label: 'Storage', path: '/storage', icon: HardDrive },
  { id: 'startup', label: 'Startup', path: '/startup', icon: Play },
  { id: 'processes', label: 'Processes', path: '/processes', icon: Cpu },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-[#0b1220]/80 px-4 py-5 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-500/20">
          <Activity size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Pulse</p>
          <p className="text-xs text-slate-400">System health explained</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-white/12 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-white/8 hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-auto rounded-3xl border border-white/10 bg-white/6 p-4"
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
          <Layers3 size={16} />
          <span>Health summary</span>
        </div>
        <p className="text-sm leading-6 text-slate-400">
          Pulse will explain why your PC feels slow in plain English.
        </p>
      </motion.div>
    </aside>
  )
}
