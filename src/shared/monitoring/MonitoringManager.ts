import { MonitoringService } from './monitoringService'
import type { MonitorKind, MonitorSnapshot, MonitoringState } from '../types/monitoring'

export class MonitoringManager {
  private service = new MonitoringService()
  private state: MonitoringState = {
    cpu: null,
    memory: null,
    disk: null,
    gpu: null,
    network: null,
    battery: null,
    temperature: null,
    updatedAt: null,
  }

  async refreshAll(): Promise<MonitoringState> {
    this.state = await this.service.getAllSnapshots()
    return this.state
  }

  async refreshMonitor(kind: MonitorKind): Promise<MonitorSnapshot> {
    const snapshot = await this.service.getSnapshot(kind)
    this.state[kind] = snapshot
    this.state.updatedAt = new Date().toISOString()
    return snapshot
  }

  getState(): MonitoringState {
    return this.state
  }
}
