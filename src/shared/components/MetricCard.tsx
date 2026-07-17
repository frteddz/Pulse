import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  detail: string
  progress: number
  icon: LucideIcon
  accentClass: string
  featured?: boolean
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  detail,
  progress,
  icon: Icon,
  accentClass,
  featured = false,
}: MetricCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 dark:border-border-dark dark:bg-surface-dark ${
        featured ? 'lg:col-span-2' : ''
      }`}
      style={{ contain: 'content' }}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted dark:text-text-muted-dark">{title}</p>
          <p className={`mt-2 font-semibold text-text-primary dark:text-text-primary-dark ${featured ? 'text-3xl' : 'text-xl'}`}>
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 ${accentClass}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="relative z-10 mt-4 h-1.5 overflow-hidden rounded-full bg-surface-alt dark:bg-surface-alt-dark">
        <div
          className={`h-full rounded-full transition-all duration-500 ${accentClass.replace('text-', 'bg-')}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="relative z-10 mt-3 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">{detail}</p>
    </div>
  )
})
