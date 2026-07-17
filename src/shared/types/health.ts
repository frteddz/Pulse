export type HealthStatus = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical'
export type HealthSeverity = 'Info' | 'Warning' | 'Critical'

export interface HealthIssue {
  title: string
  description: string
  severity: HealthSeverity
  recommendation: string
}

export interface HealthResult {
  score: number
  status: HealthStatus
  issues: HealthIssue[]
}
