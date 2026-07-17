import type { MonitoringState } from '../types/monitoring'
import type { HealthIssue, HealthResult, HealthStatus } from '../types/health'

interface HealthRule {
  test: (snapshots: MonitoringState) => boolean
  buildIssue: (snapshots: MonitoringState) => HealthIssue
}

export class HealthEngine {
  private readonly rules: HealthRule[] = [
    {
      test: (snapshots) => (snapshots.cpu?.value ?? 0) > 85,
      buildIssue: () => ({
        title: 'High CPU usage',
        description: 'CPU load is unusually high and may slow down your system.',
        severity: 'Critical',
        recommendation: 'Close heavy applications or pause background tasks to reduce strain.',
      }),
    },
    {
      test: (snapshots) => (snapshots.memory?.value ?? 0) > 80,
      buildIssue: () => ({
        title: 'High memory usage',
        description: 'RAM pressure is high, which can make the system feel sluggish.',
        severity: 'Warning',
        recommendation: 'Close unused apps or restart memory-heavy programs.',
      }),
    },
    {
      test: (snapshots) => (snapshots.disk?.value ?? 0) > 85,
      buildIssue: () => ({
        title: 'Disk nearly full',
        description: 'Storage space is very limited and may affect responsiveness.',
        severity: 'Warning',
        recommendation: 'Free up space by removing large files or unused apps.',
      }),
    },
    {
      test: (snapshots) => (snapshots.network?.value ?? 0) === 0,
      buildIssue: () => ({
        title: 'No network connection',
        description: 'The device appears to be disconnected from the network.',
        severity: 'Info',
        recommendation: 'Check your connection or reconnect to Wi-Fi or Ethernet.',
      }),
    },
    {
      test: (snapshots) => (snapshots.gpu?.value ?? 0) > 85,
      buildIssue: () => ({
        title: 'High GPU usage',
        description: 'Graphics load is elevated, which can affect GUI rendering and game performance.',
        severity: 'Warning',
        recommendation: 'Close graphics-heavy background applications or games.',
      }),
    },
    {
      test: (snapshots) => (snapshots.temperature?.value ?? 0) > 80,
      buildIssue: () => ({
        title: 'High system temperature',
        description: 'CPU is running hot. Prolonged high temperatures may trigger thermal throttling.',
        severity: 'Critical',
        recommendation: 'Ensure proper ventilation or close heavy workload tasks to allow cooling.',
      }),
    },
  ]

  evaluate(snapshots: MonitoringState): HealthResult {
    const issues = this.rules.flatMap((rule) => (rule.test(snapshots) ? [rule.buildIssue(snapshots)] : []))

    const score = this.calculateScore(issues)
    const status = this.getStatus(score)

    return {
      score,
      status,
      issues,
    }
  }

  private calculateScore(issues: HealthIssue[]): number {
    let score = 100

    for (const issue of issues) {
      if (issue.severity === 'Critical') {
        score -= 30
      } else if (issue.severity === 'Warning') {
        score -= 15
      } else {
        score -= 5
      }
    }

    return Math.max(0, Math.min(100, score))
  }

  private getStatus(score: number): HealthStatus {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 40) return 'Poor'
    return 'Critical'
  }
}
