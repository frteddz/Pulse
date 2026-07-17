import { memo, useEffect, useState, useMemo } from 'react'
import { HardDrive } from 'lucide-react'

interface DiskInfo {
  name: string
  total: number
  used: number
  free: number
  filesystem: string
  mount: string
}

export const StoragePage = memo(function StoragePage() {
  const [disks, setDisks] = useState<DiskInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchDisks = async () => {
      try {
        const electronApi = (window as any).electronAPI
        if (electronApi?.getDisks) {
          const list = await electronApi.getDisks()
          if (!cancelled) {
            const mapped = list.map((d: any) => ({
              name: d.fs || d.mount || 'Unknown Volume',
              total: Math.round(d.size / 1024 / 1024 / 1024),
              used: Math.round(d.used / 1024 / 1024 / 1024),
              free: Math.round(d.available / 1024 / 1024 / 1024),
              filesystem: d.fs || '',
              mount: d.mount || '',
            }))
            setDisks(mapped)
          }
        }
      } catch (e) {
        console.error('Failed to load disks:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchDisks()
    const interval = window.setInterval(fetchDisks, 5000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [])

  const totalUsed = useMemo(() => disks.reduce((sum, d) => sum + d.used, 0), [disks])
  const totalSize = useMemo(() => disks.reduce((sum, d) => sum + d.total, 0), [disks])
  const totalFree = useMemo(() => disks.reduce((sum, d) => sum + d.free, 0), [disks])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Storage Analysis</h2>
            <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
              Real-time disk usage across all connected volumes.
            </p>
          </div>
          {!loading && disks.length > 0 && (
            <div className="flex gap-4 text-sm">
              <div className="rounded-xl border border-border bg-surface-alt px-3 py-2 dark:border-border-dark dark:bg-surface-alt-dark">
                <span className="text-text-muted dark:text-text-muted-dark">Total</span>
                <span className="ml-2 font-semibold text-text-primary dark:text-text-primary-dark">{totalSize} GB</span>
              </div>
              <div className="rounded-xl border border-border bg-surface-alt px-3 py-2 dark:border-border-dark dark:bg-surface-alt-dark">
                <span className="text-text-muted dark:text-text-muted-dark">Used</span>
                <span className="ml-2 font-semibold text-accent">{totalUsed} GB</span>
              </div>
              <div className="rounded-xl border border-border bg-surface-alt px-3 py-2 dark:border-border-dark dark:bg-surface-alt-dark">
                <span className="text-text-muted dark:text-text-muted-dark">Free</span>
                <span className="ml-2 font-semibold text-emerald-400">{totalFree} GB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
          <p className="text-sm text-text-muted dark:text-text-muted-dark">Scanning storage devices...</p>
        </div>
      ) : disks.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark">
          <p className="text-sm text-text-muted dark:text-text-muted-dark">No storage devices detected.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {disks.map((disk) => {
            const usedPercent = disk.total > 0 ? Math.round((disk.used / disk.total) * 100) : 0
            const freePercent = disk.total > 0 ? Math.round((disk.free / disk.total) * 100) : 0

            return (
              <div
                key={disk.mount + disk.filesystem}
                className="rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-accent/10 p-2 text-accent">
                      <HardDrive size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-primary dark:text-text-primary-dark">{disk.name}</h3>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark">{disk.filesystem} • {disk.mount}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">{usedPercent}% Used</span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 overflow-hidden rounded-full bg-surface-alt dark:bg-surface-alt-dark">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-alt dark:bg-surface-alt-dark">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${freePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-sm text-text-secondary dark:text-text-secondary-dark">
                  <span>{disk.used} GB used</span>
                  <span>{disk.free} GB free</span>
                  <span>{disk.total} GB total</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
})
