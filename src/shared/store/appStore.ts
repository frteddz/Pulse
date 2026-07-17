import { create } from 'zustand'
import type { MonitoringState } from '../types/monitoring'

interface AppState {
  currentTelemetry: MonitoringState | null
  telemetryHistory: MonitoringState[]
  addTelemetrySnapshot: (state: MonitoringState) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pulse-theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  return 'dark'
}

export const useAppStore = create<AppState>((set) => ({
  currentTelemetry: null,
  telemetryHistory: [],
  theme: getInitialTheme(),
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
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('pulse-theme', next)
      return { theme: next }
    }),
  setTheme: (theme) => {
    localStorage.setItem('pulse-theme', theme)
    set({ theme })
  },
}))
