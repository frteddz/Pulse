import type { HealthResult } from '../types/health'
import type { PerformanceAnalysis, Recommendation } from '../types/performance'
import type { MonitoringState } from '../types/monitoring'

interface AnalysisRule {
  test: (_health: HealthResult, snapshots: MonitoringState) => boolean
  buildRecommendation: (_health: HealthResult, snapshots: MonitoringState) => Recommendation
}

export class PerformanceAnalyzer {
  private readonly rules: AnalysisRule[] = [
    {
      test: (_health, snapshots) => (snapshots.memory?.value ?? 0) > 80,
      buildRecommendation: () => ({
        title: 'High memory usage',
        explanation: 'Memory usage is very high. Closing unused applications may improve responsiveness.',
        severity: 'Warning',
        suggestedAction: 'Close background apps and free up memory.',
      }),
    },
    {
      test: (_health, snapshots) => (snapshots.disk?.value ?? 0) > 85,
      buildRecommendation: () => ({
        title: 'Disk nearly full',
        explanation: 'The system drive is almost full. Keeping at least 15% free space is recommended.',
        severity: 'Warning',
        suggestedAction: 'Remove large files or unused applications to free space.',
      }),
    },
    {
      test: (_health, snapshots) => (snapshots.cpu?.value ?? 0) > 85,
      buildRecommendation: () => ({
        title: 'High CPU usage',
        explanation: 'CPU usage is high and may be slowing the system down.',
        severity: 'Critical',
        suggestedAction: 'Pause heavy processes or close demanding apps.',
      }),
    },
    {
      test: (_health, snapshots) => (snapshots.network?.value ?? 0) === 0,
      buildRecommendation: () => ({
        title: 'No network connection',
        explanation: 'Network activity is unavailable right now, which can affect cloud and sync tasks.',
        severity: 'Info',
        suggestedAction: 'Reconnect to your network or check your connection settings.',
      }),
    },
    {
      test: (_health, snapshots) => (snapshots.network?.value ?? 0) > 50,
      buildRecommendation: () => ({
        title: 'High network activity',
        explanation: 'Network activity is high because applications are actively transferring data.',
        severity: 'Info',
        suggestedAction: 'Monitor large uploads or downloads if responsiveness drops.',
      }),
    },
    {
      test: (_health, snapshots) => (snapshots.gpu?.value ?? 0) > 85,
      buildRecommendation: () => ({
        title: 'High GPU usage',
        explanation: 'Graphics processing unit load is elevated, which can impact performance of graphics-heavy software.',
        severity: 'Warning',
        suggestedAction: 'Identify and close high GPU background applications or games.',
      }),
    },
    {
      test: (_health, snapshots) => (snapshots.temperature?.value ?? 0) > 80,
      buildRecommendation: () => ({
        title: 'Elevated system temperature',
        explanation: 'The system temperature is running very high. Close heavy apps to prevent thermal throttling.',
        severity: 'Critical',
        suggestedAction: 'Verify airflow/fans are working or let the system idle to cool down.',
      }),
    },
  ]

  analyze(health: HealthResult, snapshots: MonitoringState): PerformanceAnalysis {
    const recommendations = this.rules.flatMap((rule) => (rule.test(health, snapshots) ? [rule.buildRecommendation(health, snapshots)] : []))

    const summary = this.buildSummary(health, recommendations)
    const insights = this.buildInsights(health, snapshots)

    return { summary, insights, recommendations }
  }

  private buildSummary(_health: HealthResult, recommendations: Recommendation[]): string {
    if (recommendations.length === 0) {
      return 'The system appears stable and responsive right now.'
    }

    return `The system is showing ${recommendations.length} issue${recommendations.length === 1 ? '' : 's'} that may affect responsiveness.`
  }

  private buildInsights(_health: HealthResult, snapshots: MonitoringState): string[] {
    const insights: string[] = []

    if ((snapshots.cpu?.value ?? 0) > 70) {
      insights.push('CPU usage is elevated.')
    } else {
      insights.push('CPU usage is normal.')
    }

    if ((snapshots.memory?.value ?? 0) > 70) {
      insights.push('Memory pressure is noticeable.')
    } else {
      insights.push('Memory pressure is moderate.')
    }

    if ((snapshots.disk?.value ?? 0) > 80) {
      insights.push('The system drive is filling up.')
    } else {
      insights.push('The system drive has enough room for regular use.')
    }

    if ((snapshots.network?.value ?? 0) > 0) {
      insights.push('Network activity is present.')
    } else {
      insights.push('Network activity is currently idle.')
    }

    if ((snapshots.gpu?.value ?? 0) > 70) {
      insights.push('GPU usage is elevated.')
    } else {
      insights.push('GPU load is low.')
    }

    if ((snapshots.temperature?.value ?? 0) > 75) {
      insights.push('System temperature is high.')
    } else {
      insights.push('System temperature is normal.')
    }

    if (snapshots.battery?.value !== undefined && snapshots.battery?.value > 0) {
      insights.push(`Battery charge is at ${snapshots.battery.value}%.`)
    }

    return insights
  }
}
