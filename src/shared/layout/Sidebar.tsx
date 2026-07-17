import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Activity, HardDrive, Play, Cpu, Gauge, Layers3, X } from 'lucide-react'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: Gauge },
  { id: 'performance', label: 'Performance', path: '/performance', icon: Activity },
  { id: 'storage', label: 'Storage', path: '/storage', icon: HardDrive },
  { id: 'startup', label: 'Startup', path: '/startup', icon: Play },
  { id: 'processes', label: 'Processes', path: '/processes', icon: Cpu },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar - fixed */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-border bg-surface transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar - slide overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-surface transition-transform duration-300 ease-out dark:border-border-dark dark:bg-surface-dark lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-5">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet text-white shadow-lg shadow-accent/20">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">Pulse</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">System health</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-alt dark:text-text-secondary-dark dark:hover:bg-surface-alt-dark"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-accent/10 text-accent dark:bg-accent/15'
                          : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary dark:text-text-secondary-dark dark:hover:bg-surface-alt-dark dark:hover:text-text-primary-dark'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </nav>
          <SidebarFooter />
        </div>
      </div>
    </>
  )
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet text-white shadow-lg shadow-accent/20">
          <Activity size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">Pulse</p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">System health</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent/10 text-accent dark:bg-accent/15'
                      : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary dark:text-text-secondary-dark dark:hover:bg-surface-alt-dark dark:hover:text-text-primary-dark'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      <SidebarFooter />
    </div>
  )
}

function SidebarFooter() {
  return (
    <div className="border-t border-border p-4 dark:border-border-dark">
      <div className="rounded-2xl border border-border bg-surface-alt p-4 dark:border-border-dark dark:bg-surface-alt-dark">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary dark:text-text-primary-dark">
          <Layers3 size={16} />
          <span>Health summary</span>
        </div>
        <p className="text-xs leading-5 text-text-muted dark:text-text-muted-dark">
          Pulse explains why your PC feels slow in plain English.
        </p>
      </div>
    </div>
  )
}
