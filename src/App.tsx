import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './shared/layout/AppShell'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { PerformancePage } from './features/performance/PerformancePage'
import { StoragePage } from './features/storage/StoragePage'
import { StartupPage } from './features/startup/StartupPage'
import { ProcessesPage } from './features/processes/ProcessesPage'
import { SettingsPage } from './features/settings/SettingsPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/startup" element={<StartupPage />} />
          <Route path="/processes" element={<ProcessesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
