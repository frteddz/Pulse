import { useAppStore } from '../store/appStore'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore()

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface shadow-lg shadow-black/10 transition-all duration-200 hover:scale-105 hover:shadow-xl dark:border-border-dark dark:bg-surface-dark"
      aria-label="Toggle theme"
    >
      <div className="relative">
        <Sun
          size={20}
          className={`transition-all duration-300 ${
            theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          size={20}
          className={`absolute left-0 top-0 transition-all duration-300 ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  )
}
