import type { MonitorKind, MonitorSnapshot, MonitoringState } from '../types/monitoring'

const mockData: Record<MonitorKind, MonitorSnapshot> = {
  cpu: {
    kind: 'cpu',
    value: 34,
    unit: '%',
    label: 'CPU usage',
    status: 'healthy',
    detail: 'CPU load is within a normal range.',
  },
  memory: {
    kind: 'memory',
    value: 68,
    unit: '%',
    label: 'RAM usage',
    status: 'warning',
    detail: 'Memory pressure is moderate.',
  },
  disk: {
    kind: 'disk',
    value: 78,
    unit: '%',
    label: 'Disk usage',
    status: 'warning',
    detail: 'Drive capacity is approaching a busy range.',
  },
  gpu: {
    kind: 'gpu',
    value: 41,
    unit: '%',
    label: 'GPU usage',
    status: 'healthy',
    detail: 'Graphics load is moderate.',
  },
  network: {
    kind: 'network',
    value: 12,
    unit: 'MB/s',
    label: 'Network activity',
    status: 'healthy',
    detail: 'Network usage is steady.',
  },
  battery: {
    kind: 'battery',
    value: 87,
    unit: '%',
    label: 'Battery',
    status: 'healthy',
    detail: 'Battery level is healthy.',
  },
  temperature: {
    kind: 'temperature',
    value: 62,
    unit: '°C',
    label: 'Temperature',
    status: 'healthy',
    detail: 'Temperature is within a safe range.',
  },
}

export class MonitoringService {
  async getSnapshot(kind: MonitorKind): Promise<MonitorSnapshot> {
    try {
      const electronApi = (window as Window & typeof globalThis & {
        electronAPI?: Record<string, () => Promise<MonitorSnapshot>>
      }).electronAPI

      if (electronApi) {
        const methodMap: Record<MonitorKind, string> = {
          cpu: 'getCpuSnapshot',
          memory: 'getMemorySnapshot',
          disk: 'getDiskSnapshot',
          network: 'getNetworkSnapshot',
          gpu: 'getGpuSnapshot',
          battery: 'getBatterySnapshot',
          temperature: 'getTemperatureSnapshot',
        }
        const methodName = methodMap[kind]
        if (methodName && typeof electronApi[methodName] === 'function') {
          return await electronApi[methodName]()
        }
      }
    } catch (e) {
      console.warn(`Failed to retrieve IPC snapshot for ${kind}:`, e)
    }

    return Promise.resolve(mockData[kind])
  }

  async getAllSnapshots(): Promise<MonitoringState> {
    try {
      const electronApi = (window as Window & typeof globalThis & {
        electronAPI?: { getTelemetry?: () => Promise<MonitoringState> }
      }).electronAPI

      if (electronApi?.getTelemetry) {
        return await electronApi.getTelemetry()
      }
    } catch (e) {
      console.warn('Failed to retrieve unified telemetry via IPC:', e)
    }

    // Fallback: poll individually or use mock data
    const kinds: MonitorKind[] = ['cpu', 'memory', 'disk', 'network', 'gpu', 'battery', 'temperature']
    const state: Partial<MonitoringState> = {}

    for (const kind of kinds) {
      state[kind] = await this.getSnapshot(kind)
    }

    return {
      ...(state as MonitoringState),
      updatedAt: new Date().toISOString(),
    }
  }
}
