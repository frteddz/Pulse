import { memo, useEffect, useState, useMemo } from 'react'
import { Search, Loader2, CircleAlert, Trash2, ArrowUpDown } from 'lucide-react'
import type { ProcessInfo } from '../../shared/types/process'

const mockProcesses: ProcessInfo[] = [
  { pid: 1403, name: 'Chrome', cpu: 12.4, mem: 4.8, state: 'running', user: 'user' },
  { pid: 2891, name: 'Spotify', cpu: 1.2, mem: 1.2, state: 'sleeping', user: 'user' },
  { pid: 9021, name: 'Slack', cpu: 0.5, mem: 2.1, state: 'sleeping', user: 'user' },
  { pid: 4810, name: 'Discord', cpu: 2.8, mem: 1.6, state: 'sleeping', user: 'user' },
  { pid: 512, name: 'WindowServer', cpu: 5.1, mem: 0.9, state: 'running', user: 'root' },
  { pid: 1205, name: 'Pulse', cpu: 1.8, mem: 1.1, state: 'running', user: 'user' },
  { pid: 6103, name: 'Node.js', cpu: 8.2, mem: 2.5, state: 'running', user: 'user' },
  { pid: 7490, name: 'Docker', cpu: 0.1, mem: 8.4, state: 'sleeping', user: 'root' },
]

type SortField = 'cpu' | 'mem' | 'name' | 'pid'

export const ProcessesPage = memo(function ProcessesPage() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('cpu')
  const [sortAsc, setSortAsc] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [terminatingPids, setTerminatingPids] = useState<Record<number, boolean>>({})

  const fetchProcesses = async () => {
    try {
      const electronApi = (window as any).electronAPI
      if (electronApi?.getProcesses) {
        const list = await electronApi.getProcesses()
        setProcesses(list)
      } else {
        const simulated = mockProcesses.map((p) => ({
          ...p,
          cpu:
            Math.random() > 0.3
              ? Math.round((p.cpu + (Math.random() - 0.5) * 2) * 10) / 10
              : p.cpu,
          mem:
            Math.random() > 0.4
              ? Math.round((p.mem + (Math.random() - 0.5) * 0.4) * 10) / 10
              : p.mem,
        }))
        setProcesses(simulated)
      }
      setErrorMsg(null)
    } catch (e: any) {
      console.error('Failed to get processes:', e)
      setErrorMsg('Could not fetch process diagnostics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchProcesses()
    const interval = window.setInterval(() => {
      void fetchProcesses()
    }, 2500)

    return () => window.clearInterval(interval)
  }, [])

  const handleKill = async (pid: number) => {
    setTerminatingPids((prev) => ({ ...prev, [pid]: true }))
    try {
      const electronApi = (window as any).electronAPI
      if (electronApi?.killProcess) {
        const result = await electronApi.killProcess(pid)
        if (result.success) {
          setProcesses((prev) => prev.filter((p) => p.pid !== pid))
        } else {
          alert(`Failed to kill process ${pid}: ${result.error || 'Access Denied'}`)
        }
      } else {
        setProcesses((prev) => prev.filter((p) => p.pid !== pid))
      }
    } catch (e: any) {
      alert(`Error terminating process: ${e.message}`)
    } finally {
      setTerminatingPids((prev) => {
        const copy = { ...prev }
        delete copy[pid]
        return copy
      })
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const filteredProcesses = useMemo(() => {
    return processes
      .filter((p) => {
        const term = search.toLowerCase()
        return p.name.toLowerCase().includes(term) || p.pid.toString().includes(term)
      })
      .sort((a, b) => {
        let valA = a[sortField]
        let valB = b[sortField]
        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()

        if (valA < valB) return sortAsc ? -1 : 1
        if (valA > valB) return sortAsc ? 1 : -1
        return 0
      })
  }, [processes, search, sortField, sortAsc])

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown
      size={14}
      className={`transition-opacity duration-200 ${
        sortField === field ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-50'
      }`}
    />
  )

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Process Explorer</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-secondary-dark">
          View active system processes, analyze resource consumption, and safely terminate unresponsive
          software.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="group flex w-full items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5 text-sm text-text-muted transition-colors focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 dark:border-border-dark dark:bg-surface-dark dark:focus-within:border-accent sm:max-w-md">
          <Search size={16} className="shrink-0 text-text-muted dark:text-text-muted-dark" />
          <input
            className="w-full bg-transparent outline-none placeholder:text-text-muted dark:placeholder:text-text-muted-dark text-text-primary dark:text-text-primary-dark"
            placeholder="Search process name or PID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {loading && processes.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark">
            <Loader2 size={16} className="animate-spin" />
            Loading process map...
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          <CircleAlert size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark" style={{ contain: 'content' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-xs font-semibold uppercase tracking-wider text-text-muted dark:border-border-dark dark:bg-surface-alt-dark dark:text-text-muted-dark">
                <th
                  onClick={() => handleSort('pid')}
                  className="group cursor-pointer px-6 py-4 select-none transition-colors hover:text-text-primary dark:hover:text-text-primary-dark"
                >
                  <div className="flex items-center gap-1">
                    PID <SortIcon field="pid" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="cursor-pointer px-6 py-4 select-none transition-colors hover:text-text-primary dark:hover:text-text-primary-dark"
                >
                  <div className="flex items-center gap-1">
                    Process Name <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cpu')}
                  className="cursor-pointer px-6 py-4 select-none transition-colors hover:text-text-primary dark:hover:text-text-primary-dark"
                >
                  <div className="flex items-center gap-1">
                    CPU <SortIcon field="cpu" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('mem')}
                  className="cursor-pointer px-6 py-4 select-none transition-colors hover:text-text-primary dark:hover:text-text-primary-dark"
                >
                  <div className="flex items-center gap-1">
                    Memory <SortIcon field="mem" />
                  </div>
                </th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-secondary dark:divide-border-dark dark:text-text-secondary-dark">
              {filteredProcesses.length > 0 ? (
                filteredProcesses.map((p) => (
                  <tr key={p.pid} className="transition-colors hover:bg-surface-alt dark:hover:bg-surface-alt-dark">
                    <td className="px-6 py-3.5 font-mono text-xs">{p.pid}</td>
                    <td className="px-6 py-3.5 font-medium text-text-primary dark:text-text-primary-dark">{p.name}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-alt dark:bg-surface-alt-dark">
                          <div
                            className={`h-full rounded-full ${
                              p.cpu > 50
                                ? 'bg-red-400'
                                : p.cpu > 15
                                  ? 'bg-amber-400'
                                  : 'bg-violet-400'
                            }`}
                            style={{ width: `${Math.min(p.cpu, 100)}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-xs">{p.cpu.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-alt dark:bg-surface-alt-dark">
                          <div
                            className={`h-full rounded-full ${
                              p.mem > 5
                                ? 'bg-red-400'
                                : p.mem > 2
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(p.mem * 10, 100)}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-xs">{p.mem.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs capitalize">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 font-medium ${
                          p.state === 'running'
                            ? 'bg-emerald-400/10 text-emerald-500'
                            : 'bg-text-muted/10 text-text-muted dark:bg-text-muted-dark/10 dark:text-text-muted-dark'
                        }`}
                      >
                        {p.state}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-text-secondary dark:text-text-secondary-dark">{p.user}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        disabled={terminatingPids[p.pid]}
                        onClick={() => handleKill(p.pid)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all duration-200 hover:bg-red-400/20 disabled:opacity-50"
                      >
                        {terminatingPids[p.pid] ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                        <span>End Process</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-text-muted italic dark:text-text-muted-dark">
                    No active processes match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
})
