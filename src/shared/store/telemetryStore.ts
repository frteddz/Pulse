import { create } from 'zustand'
import type { MonitoringState } from '../types/monitoring'

interface TelemetryState {
  currentTelemetry: MonitoringState | null
  telemetryHistory: MonitoringState[]
  addTelemetrySnapshot: (state: MonitoringState) => void
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  currentTelemetry: null,
  telemetryHistory: [],
  addTelemetrySnapshot: (state) =>
    set((prev) => {
      const history = [...prev.telemetryHistory, state]
      if (history.length > 60) {
        history.shift()
      }
      return {
        currentTelemetry: state,
        telemetryHistory: history,
      }
    }),
}))
