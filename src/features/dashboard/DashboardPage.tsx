import { memo } from 'react'
import { Cpu, HardDrive, MemoryStick, Network, MonitorCog, Gauge, Thermometer, Battery } from 'lucide-react'
import { useMemo } from 'react'
import { MetricCard } from '../../shared/components/MetricCard'
import { HealthEngine } from '../../shared/health/HealthEngine'
import { PerformanceAnalyzer } from '../../shared/performance/PerformanceAnalyzer'
import { useAppStore } from '../../shared/store/appStore'

const healthEngine = new HealthEngine()
const performanceAnalyzer = new PerformanceAnalyzer()

export const DashboardPage = memo(function DashboardPage() {
  const telemetry = useAppStore((state) => state.currentTelemetry)

  const healthResult = useMemo(() => (telemetry ? healthEngine.evaluate(telemetry) : null), [telemetry])
  const analysis = useMemo(
    () => (telemetry && healthResult ? performanceAnalyzer.analyze(healthResult, telemetry) : null),
    [telemetry, healthResult]
  )

  const metrics = useMemo(
    () => [
      {
        title: 'Overall Health Score',
        value: healthResult ? `${healthResult.score} / 100` : '—',
        detail: healthResult
          ? `${healthResult.status} • ${healthResult.issues.length} issue${healthResult.issues.length === 1 ? '' : 's'}`
          : 'Waiting for health analysis…',
        progress: healthResult?.score ?? 0,
        icon: Gauge,
        accentClass: 'bg-accent/15 text-accent',
        featured: true,
      },
      {
        title: 'CPU Usage',
        value: telemetry?.cpu ? `${telemetry.cpu.value}%` : '—',
        detail: telemetry?.cpu?.detail ?? 'Waiting for CPU data…',
        progress: telemetry?.cpu?.value ?? 0,
        icon: Cpu,
        accentClass: 'bg-violet/15 text-violet',
      },
      {
        title: 'RAM Usage',
        value: telemetry?.memory ? `${telemetry.memory.value}%` : '—',
        detail: telemetry?.memory?.detail ?? 'Waiting for memory data…',
        progress: telemetry?.memory?.value ?? 0,
        icon: MemoryStick,
        accentClass: 'bg-amber-400/15 text-amber-400',
      },
      {
        title: 'Disk Usage',
        value: telemetry?.disk ? `${telemetry.disk.value}%` : '—',
        detail: telemetry?.disk?.detail ?? 'Waiting for disk data…',
        progress: telemetry?.disk?.value ?? 0,
        icon: HardDrive,
        accentClass: 'bg-emerald-400/15 text-emerald-400',
      },
      {
        title: 'GPU Usage',
        value: telemetry?.gpu ? `${telemetry.gpu.value}%` : '—',
        detail: telemetry?.gpu?.detail ?? 'Waiting for GPU data…',
        progress: telemetry?.gpu?.value ?? 0,
        icon: MonitorCog,
        accentClass: 'bg-fuchsia-400/15 text-fuchsia-400',
      },
      {
        title: 'Network Usage',
        value: telemetry?.network ? `${telemetry.network.value} ${telemetry.network.unit}` : '—',
        detail: telemetry?.network?.detail ?? 'Waiting for network data…',
        progress: Math.min(telemetry?.network?.value ?? 0, 100),
        icon: Network,
        accentClass: 'bg-sky-400/15 text-sky-400',
      },
      {
        title: 'Temperature',
        value: telemetry?.temperature ? `${telemetry.temperature.value}°C` : '—',
        detail: telemetry?.temperature?.detail ?? 'Waiting for temperature data…',
        progress: Math.min(telemetry?.temperature?.value ?? 0, 100),
        icon: Thermometer,
        accentClass: 'bg-red-400/15 text-red-400',
      },
      {
        title: 'Battery',
        value: telemetry?.battery ? `${telemetry.battery.value}%` : '—',
        detail: telemetry?.battery?.detail ?? 'Waiting for battery data…',
        progress: telemetry?.battery?.value ?? 0,
        icon: Battery,
        accentClass: 'bg-teal-400/15 text-teal-400',
      },
    ],
    [healthResult, telemetry]
  )

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Good':
        return 'bg-emerald-400/10 text-emerald-500 border-emerald-400/20'
      case 'Fair':
        return 'bg-amber-400/10 text-amber-500 border-amber-400/20'
      case 'Poor':
        return 'bg-red-400/10 text-red-500 border-red-400/20'
      default:
        return 'bg-text-muted/10 text-text-muted border-border dark:text-text-muted-dark dark:border-border-dark'
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark" style={{ contain: 'content' }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-accent">Analysis</p>
            <h3 className="mt-2 text-xl font-semibold text-text-primary dark:text-text-primary-dark">Overall Summary</h3>
          </div>
          <div
            className={`inline-flex w-fit items-center rounded-xl border px-3 py-1.5 text-sm font-medium ${getStatusColor(healthResult?.status)}`}
          >
            {healthResult?.status ?? 'Evaluating'}
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary dark:text-text-secondary-dark">
          {analysis?.summary ?? 'Waiting for your current system state…'}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Active Recommendations
            </h4>
            <div className="mt-3 space-y-3">
              {analysis?.recommendations.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-surface-alt p-4 transition-colors duration-200 dark:border-border-dark dark:bg-surface-alt-dark"
                >
                  <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary dark:text-text-secondary-dark">{item.explanation}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-accent">{item.severity}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              System Insights
            </h4>
            <ul className="mt-3 space-y-3 text-sm text-text-secondary dark:text-text-secondary-dark">
              {analysis?.insights.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border bg-surface-alt p-4 transition-colors duration-200 dark:border-border-dark dark:bg-surface-alt-dark"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
})
