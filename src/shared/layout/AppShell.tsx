import { useEffect, useState, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useAppStore } from '../store/appStore'
import { MonitoringManager } from '../monitoring/MonitoringManager'
import { ThemeToggle } from '../components/ThemeToggle'
import { Onboarding } from '../components/Onboarding'

const monitoringManager = new MonitoringManager()

export function AppShell() {
  const addTelemetrySnapshot = useAppStore((state) => state.addTelemetrySnapshot)
  const theme = useAppStore((state) => state.theme)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const tickRef = useRef(addTelemetrySnapshot)
  tickRef.current = addTelemetrySnapshot

  useEffect(() => {
    let active = true

    const tick = async () => {
      const state = await monitoringManager.refreshAll()
      if (active) {
        tickRef.current(state)
      }
    }

    void tick()
    const interval = window.setInterval(() => {
      window.requestAnimationFrame(() => {
        void tick()
      })
    }, 3000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-background text-text-primary transition-colors duration-300 dark:bg-background-dark dark:text-text-primary-dark">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
        <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            <div key={location.pathname} className="page-enter">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <ThemeToggle />
    </div>
  )
}
