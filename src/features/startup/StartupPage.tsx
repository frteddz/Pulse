import { memo } from 'react'
import { Rocket } from 'lucide-react'

export const StartupPage = memo(function StartupPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent/10 p-2 text-accent">
            <Rocket size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Startup Apps</h2>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              Manage applications that launch on system startup.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-8 text-center transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt dark:bg-surface-alt-dark">
          <Rocket size={24} className="text-text-muted dark:text-text-muted-dark" />
        </div>
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">List of startup apps will appear here.</p>
      </div>
    </section>
  )
})
