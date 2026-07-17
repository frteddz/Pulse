import type { HealthResult } from './health'

export type RecommendationSeverity = 'Info' | 'Warning' | 'Critical'

export interface Recommendation {
  title: string
  explanation: string
  severity: RecommendationSeverity
  suggestedAction: string
}

export interface PerformanceAnalysis {
  summary: string
  insights: string[]
  recommendations: Recommendation[]
}

export interface PerformanceContext {
  health: HealthResult
  snapshots: Record<string, unknown>
}
