export type MonitorKind = 'cpu' | 'memory' | 'disk' | 'gpu' | 'network' | 'battery' | 'temperature'

export interface MonitorSnapshot {
  kind: MonitorKind
  value: number
  unit: string
  label: string
  status: 'healthy' | 'warning' | 'critical'
  detail: string
}

export interface MonitoringState {
  cpu: MonitorSnapshot | null
  memory: MonitorSnapshot | null
  disk: MonitorSnapshot | null
  gpu: MonitorSnapshot | null
  network: MonitorSnapshot | null
  battery: MonitorSnapshot | null
  temperature: MonitorSnapshot | null
  updatedAt: string | null
}
