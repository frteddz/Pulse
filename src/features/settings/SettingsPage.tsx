import { memo } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useAppStore } from '../../shared/store/appStore'

export const SettingsPage = memo(function SettingsPage() {
  const { theme, setTheme } = useAppStore()

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    if (value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    } else {
      setTheme(value)
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Settings</h2>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
          Adjust application behavior and preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
          <h3 className="text-base font-semibold text-text-primary dark:text-text-primary-dark">Appearance</h3>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark">Choose your preferred theme.</p>
          <div className="mt-4 flex gap-3">
            {themes.map((t) => {
              const Icon = t.icon
              const isActive = t.id === 'system'
                ? false
                : theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface-alt text-text-secondary hover:border-text-muted hover:text-text-primary dark:border-border-dark dark:bg-surface-alt-dark dark:text-text-secondary-dark dark:hover:border-text-muted-dark dark:hover:text-text-primary-dark'
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
          <h3 className="text-base font-semibold text-text-primary dark:text-text-primary-dark">Monitoring</h3>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark">Configure polling rates.</p>
          <div className="mt-4">
            <label className="flex items-center justify-between rounded-xl border border-border bg-surface-alt px-4 py-3 dark:border-border-dark dark:bg-surface-alt-dark">
              <span className="text-sm text-text-primary dark:text-text-primary-dark">Refresh interval</span>
              <span className="text-sm font-mono text-accent">2s</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
})
