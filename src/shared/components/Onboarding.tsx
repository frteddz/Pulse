import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { theme } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 text-text-primary transition-colors duration-300 dark:bg-background-dark dark:text-text-primary-dark ${
        mounted ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-violet text-white shadow-lg shadow-accent/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">Welcome to Pulse</h1>
          <p className="mt-3 text-base text-text-secondary dark:text-text-secondary-dark">
            Choose your preferred theme to get started.
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <ThemeOption theme="light" currentTheme={theme} onSelect={() => useAppStore.getState().setTheme('light')} />
          <ThemeOption theme="dark" currentTheme={theme} onSelect={() => useAppStore.getState().setTheme('dark')} />
        </div>

        <button
          onClick={onComplete}
          className="mx-auto block rounded-2xl bg-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

function ThemeOption({ theme, currentTheme, onSelect }: { theme: string; currentTheme: string; onSelect: () => void }) {
  const isActive = currentTheme === theme

  return (
    <button
      onClick={onSelect}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200 ${
        isActive
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-text-muted dark:border-border-dark dark:hover:border-text-muted-dark'
      }`}
    >
      <div
        className={`h-16 w-24 rounded-xl border ${
          theme === 'light'
            ? 'border-slate-200 bg-white shadow-sm'
            : 'border-slate-700 bg-slate-900'
        }`}
      >
        <div className={`h-2 w-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`} />
        <div className="mx-2 my-2 space-y-1">
          <div className={`h-1.5 w-3/4 rounded ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'}`} />
          <div className={`h-1.5 w-1/2 rounded ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'}`} />
        </div>
      </div>
      <span className="text-sm font-medium capitalize text-text-primary dark:text-text-primary-dark">{theme}</span>
      {isActive && (
        <div className="absolute -bottom-1 h-1 w-6 rounded-full bg-accent" />
      )}
    </button>
  )
}
