import { memo, useMemo } from 'react'
import { useAppStore } from '../../shared/store/appStore'
import { HealthEngine } from '../../shared/health/HealthEngine'
import { PerformanceAnalyzer } from '../../shared/performance/PerformanceAnalyzer'
import { TrendChart } from '../../shared/components/TrendChart'

const healthEngine = new HealthEngine()
const performanceAnalyzer = new PerformanceAnalyzer()

export const PerformancePage = memo(function PerformancePage() {
  const telemetry = useAppStore((state) => state.currentTelemetry)
  const history = useAppStore((state) => state.telemetryHistory)

  const healthResult = useMemo(() => (telemetry ? healthEngine.evaluate(telemetry) : null), [telemetry])
  const analysis = useMemo(
    () => (telemetry && healthResult ? performanceAnalyzer.analyze(healthResult, telemetry) : null),
    [telemetry, healthResult]
  )

  const cpuData = useMemo(() => history.map((t) => t.cpu?.value ?? 0), [history])
  const ramData = useMemo(() => history.map((t) => t.memory?.value ?? 0), [history])
  const gpuData = useMemo(() => history.map((t) => t.gpu?.value ?? 0), [history])
  const tempData = useMemo(() => history.map((t) => t.temperature?.value ?? 0), [history])
  const netData = useMemo(() => history.map((t) => t.network?.value ?? 0), [history])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Performance Analysis & Trends</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-secondary-dark">
          Analyze historical patterns of core system components over the last 60 seconds to identify
          performance bottlenecks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          { title: 'CPU Utilization', data: cpuData, color: '#c084fc', label: 'CPU (%)' },
          { title: 'RAM Pressure', data: ramData, color: '#fbbf24', label: 'Memory (%)' },
          { title: 'GPU Workload', data: gpuData, color: '#f472b6', label: 'GPU (%)' },
          { title: 'Thermal State', data: tempData, color: '#f87171', max: 100, label: 'Temp (°C)' },
          { title: 'Network Throughput', data: netData, color: '#38bdf8', max: 1000, label: 'Speed (KB/s)' },
        ].map((chart) => (
          <div
            key={chart.title}
            className="rounded-2xl border border-border bg-surface p-5 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark"
            style={{ contain: 'content' }}
          >
            <h3 className="text-sm font-medium text-text-primary dark:text-text-primary-dark">{chart.title}</h3>
            <div className="mt-3">
              <TrendChart
                data={chart.data}
                color={chart.color}
                max={chart.max}
                label={chart.label}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark" style={{ contain: 'content' }}>
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">Diagnostics Summary</h3>
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-6">
          {analysis?.summary ?? 'No diagnostic analysis available yet.'}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-3">
              Diagnostic Recommendations
            </h4>
            {analysis?.recommendations && analysis.recommendations.length > 0 ? (
              <div className="space-y-3">
                {analysis.recommendations.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border bg-surface-alt p-4 transition-colors duration-200 dark:border-border-dark dark:bg-surface-alt-dark"
                  >
                    <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary dark:text-text-secondary-dark">{item.explanation}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-accent">{item.severity}</span>
                      <span className="text-xs text-text-muted dark:text-text-muted-dark font-medium">
                        Action: {item.suggestedAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic dark:text-text-muted-dark">No recommendations. System health looks solid.</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-3">
              System Insights
            </h4>
            {analysis?.insights && analysis.insights.length > 0 ? (
              <ul className="space-y-3 text-sm text-text-secondary dark:text-text-secondary-dark">
                {analysis.insights.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-border bg-surface-alt p-4 transition-colors duration-200 dark:border-border-dark dark:bg-surface-alt-dark"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted italic dark:text-text-muted-dark">No insights available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})
