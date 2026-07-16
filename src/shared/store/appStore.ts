import { create } from 'zustand'

interface AppState {
  activeRoute: string
  setActiveRoute: (route: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeRoute: 'dashboard',
  setActiveRoute: (route) => set({ activeRoute: route }),
}))
