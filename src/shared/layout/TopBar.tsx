import { Menu } from 'lucide-react'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/95 px-6 py-4 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark/95 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-alt lg:hidden dark:text-text-secondary-dark dark:hover:bg-surface-alt-dark"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted dark:text-text-muted-dark">{today}</p>
          <h1 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">Understanding your system</h1>
        </div>
      </div>
    </header>
  )
}
