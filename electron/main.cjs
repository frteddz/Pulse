const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('node:path')
const fs = require('node:fs/promises')
const si = require('systeminformation')

const isDev = !app.isPackaged

const metricCache = {
  disk: { data: null, ts: 0 },
  gpu: { data: null, ts: 0 },
  temperature: { data: null, ts: 0 },
}
const CACHE_TTL = 10000

async function getCachedDisk() {
  const now = Date.now()
  if (!metricCache.disk.data || now - metricCache.disk.ts > CACHE_TTL) {
    metricCache.disk.data = await getDiskSnapshot()
    metricCache.disk.ts = now
  }
  return metricCache.disk.data
}

async function getCachedGpu() {
  const now = Date.now()
  if (!metricCache.gpu.data || now - metricCache.gpu.ts > CACHE_TTL) {
    metricCache.gpu.data = await getGpuSnapshot()
    metricCache.gpu.ts = now
  }
  return metricCache.gpu.data
}

async function getCachedTemperature() {
  const now = Date.now()
  if (!metricCache.temperature.data || now - metricCache.temperature.ts > CACHE_TTL) {
    metricCache.temperature.data = await getTemperatureSnapshot()
    metricCache.temperature.ts = now
  }
  return metricCache.temperature.data
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#050816',
    icon: path.join(__dirname, '../public/logo-rgba.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Remove the default Electron menu
  Menu.setApplicationMenu(null)

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

let cachedCpuInfo = null

async function getCpuInfo() {
  if (!cachedCpuInfo) {
    try {
      cachedCpuInfo = await si.cpu()
    } catch {
      cachedCpuInfo = { cores: 1, physicalCores: 1, brand: 'CPU' }
    }
  }
  return cachedCpuInfo
}

async function getCpuSnapshot() {
  try {
    const [load, cpuInfo] = await Promise.all([si.currentLoad(), getCpuInfo()])
    let usage = typeof load.currentLoad === 'number' ? load.currentLoad : 0
    if (load.cpus && load.cpus.length > 0) {
      const avgCpuLoad = load.cpus.reduce((sum, cpu) => sum + (cpu.load || 0), 0) / load.cpus.length
      if (avgCpuLoad > 0) {
        usage = Math.round(avgCpuLoad)
      }
    }
    const cores = cpuInfo?.physicalCores ?? cpuInfo?.cores ?? 1
    const model = cpuInfo?.brand || cpuInfo?.manufacturer || 'CPU'

    return {
      kind: 'cpu',
      value: usage,
      unit: '%',
      label: 'CPU usage',
      status: usage > 85 ? 'critical' : usage > 60 ? 'warning' : 'healthy',
      detail: `${cores} logical core${cores > 1 ? 's' : ''} • ${model}`,
    }
  } catch {
    return {
      kind: 'cpu',
      value: 0,
      unit: '%',
      label: 'CPU usage',
      status: 'warning',
      detail: 'CPU monitoring is unavailable on this platform.',
    }
  }
}

async function getMemorySnapshot() {
  try {
    const mem = await si.mem()
    const totalGb = (mem.total / 1024 / 1024 / 1024).toFixed(1)
    const actualUsed = mem.active || Math.max(0, mem.used - (mem.buffers || 0) - (mem.cached || 0))
    const usedGb = (actualUsed / 1024 / 1024 / 1024).toFixed(1)
    const freeGb = ((mem.total - actualUsed) / 1024 / 1024 / 1024).toFixed(1)
    const percentage = Math.round((actualUsed / mem.total) * 100)

    return {
      kind: 'memory',
      value: percentage,
      unit: '%',
      label: 'RAM usage',
      status: percentage > 85 ? 'critical' : percentage > 60 ? 'warning' : 'healthy',
      detail: `${usedGb} GB used • ${freeGb} GB free • ${totalGb} GB total`,
    }
  } catch {
    return {
      kind: 'memory',
      value: 0,
      unit: '%',
      label: 'RAM usage',
      status: 'warning',
      detail: 'Memory monitoring is unavailable on this platform.',
    }
  }
}

async function getDiskSnapshot() {
  try {
    const disks = await si.fsSize()
    const primaryDisk = disks.find((disk) => disk.use === 100 || disk.fs === '/' || disk.mount === '/') || disks[0]

    if (!primaryDisk) {
      throw new Error('No disk available')
    }

    const totalBytes = primaryDisk.size
    const usedBytes = primaryDisk.used
    const freeBytes = primaryDisk.available
    const percentage = Math.round((usedBytes / totalBytes) * 100)

    const formatBytes = (value) => {
      const gb = value / 1024 / 1024 / 1024
      if (gb >= 1000) {
        return `${(gb / 1000).toFixed(1)} TB`
      }
      return `${gb.toFixed(1)} GB`
    }

    return {
      kind: 'disk',
      value: percentage,
      unit: '%',
      label: 'Disk usage',
      status: percentage > 85 ? 'critical' : percentage > 70 ? 'warning' : 'healthy',
      detail: `${formatBytes(usedBytes)} used • ${formatBytes(freeBytes)} free • ${formatBytes(totalBytes)} total`,
    }
  } catch {
    return {
      kind: 'disk',
      value: 0,
      unit: '%',
      label: 'Disk usage',
      status: 'warning',
      detail: 'Disk monitoring is unavailable on this platform.',
    }
  }
}

async function getNetworkSnapshot() {
  try {
    const [netStats, netInterfaces] = await Promise.all([si.networkStats(), si.networkInterfaces()])
    const activeInterface = netInterfaces.find((iface) => iface.operstate === 'up' && iface.type !== 'virtual') || netInterfaces[0]
    const primaryStats = netStats[0]
    const upload = primaryStats?.tx_sec ?? 0
    const download = primaryStats?.rx_sec ?? 0
    const connected = Boolean(activeInterface && activeInterface.operstate === 'up')

    const formatSpeed = (value) => {
      const kb = value / 1024
      if (kb >= 1024 * 1024) {
        return `${(kb / 1024 / 1024).toFixed(2)} GB/s`
      }
      if (kb >= 1024) {
        return `${(kb / 1024).toFixed(2)} MB/s`
      }
      return `${kb.toFixed(1)} KB/s`
    }

    return {
      kind: 'network',
      value: Math.round(download / 1024),
      unit: 'KB/s',
      label: 'Network activity',
      status: connected ? 'healthy' : 'warning',
      detail: `${formatSpeed(upload)} ↑ • ${formatSpeed(download)} ↓ • ${activeInterface?.ifaceName || 'Unknown'}`,
    }
  } catch {
    return {
      kind: 'network',
      value: 0,
      unit: 'KB/s',
      label: 'Network activity',
      status: 'warning',
      detail: 'Network monitoring is unavailable on this platform.',
    }
  }
}

async function getGpuSnapshot() {
  try {
    const graphics = await si.graphics()
    const controller = graphics?.controllers?.[0]
    const model = controller?.model || 'GPU'
    const vram = controller?.vram || 0
    const usage = typeof controller?.utilizationGpu === 'number' ? Math.round(controller.utilizationGpu) : 0

    return {
      kind: 'gpu',
      value: usage,
      unit: '%',
      label: 'GPU usage',
      status: usage > 85 ? 'critical' : usage > 60 ? 'warning' : 'healthy',
      detail: `${model} • ${vram}MB VRAM`,
    }
  } catch {
    return {
      kind: 'gpu',
      value: 0,
      unit: '%',
      label: 'GPU usage',
      status: 'warning',
      detail: 'GPU monitoring is unavailable on this platform.',
    }
  }
}

async function getBatterySnapshot() {
  try {
    const battery = await si.battery()
    const hasBat = battery?.hasBattery
    const percent = battery?.percent ?? 0
    const isCharging = battery?.isCharging
    const acConnected = battery?.acConnected

    let detail = 'No battery detected'
    if (hasBat) {
      detail = `${percent}% • ${isCharging ? 'Charging' : acConnected ? 'Plugged in' : 'Discharging'}`
    } else if (acConnected) {
      detail = 'AC Power Connected'
    }

    return {
      kind: 'battery',
      value: percent,
      unit: '%',
      label: 'Battery',
      status: hasBat && percent < 15 && !isCharging ? 'critical' : hasBat && percent < 30 && !isCharging ? 'warning' : 'healthy',
      detail,
    }
  } catch {
    return {
      kind: 'battery',
      value: 0,
      unit: '%',
      label: 'Battery',
      status: 'warning',
      detail: 'Battery monitoring is unavailable on this platform.',
    }
  }
}

async function getTemperatureSnapshot() {
  try {
    const temp = await si.cpuTemperature()
    const mainTemp = temp?.main || 0

    return {
      kind: 'temperature',
      value: mainTemp,
      unit: '°C',
      label: 'Temperature',
      status: mainTemp > 80 ? 'critical' : mainTemp > 65 ? 'warning' : 'healthy',
      detail: `${mainTemp}°C • Max Core: ${temp?.max || mainTemp}°C`,
    }
  } catch {
    return {
      kind: 'temperature',
      value: 0,
      unit: '°C',
      label: 'Temperature',
      status: 'warning',
      detail: 'Temperature monitoring is unavailable on this platform.',
    }
  }
}

ipcMain.handle('get-cpu-snapshot', getCpuSnapshot)
ipcMain.handle('get-memory-snapshot', getMemorySnapshot)
ipcMain.handle('get-disk-snapshot', getDiskSnapshot)
ipcMain.handle('get-network-snapshot', getNetworkSnapshot)
ipcMain.handle('get-gpu-snapshot', getGpuSnapshot)
ipcMain.handle('get-battery-snapshot', getBatterySnapshot)
ipcMain.handle('get-temperature-snapshot', getTemperatureSnapshot)

ipcMain.handle('get-telemetry', async () => {
  const [cpu, memory, network, battery] = await Promise.all([
    getCpuSnapshot(),
    getMemorySnapshot(),
    getNetworkSnapshot(),
    getBatterySnapshot(),
  ])

  const [disk, gpu, temperature] = await Promise.all([
    getCachedDisk(),
    getCachedGpu(),
    getCachedTemperature(),
  ])

  return {
    cpu,
    memory,
    disk,
    network,
    gpu,
    battery,
    temperature,
    updatedAt: new Date().toISOString(),
  }
})

ipcMain.handle('get-processes', async () => {
  try {
    const data = await si.processes()
    return data.list.map((p) => ({
      pid: p.pid,
      name: p.name,
      cpu: Math.round(p.cpu * 10) / 10,
      mem: Math.round(p.mem * 10) / 10,
      state: p.state,
      user: p.user,
    }))
  } catch (e) {
    console.error('Failed to get processes:', e)
    return []
  }
})

ipcMain.handle('kill-process', async (event, pid) => {
  try {
    const cleanPid = parseInt(pid, 10)
    if (isNaN(cleanPid)) {
      throw new Error('Invalid PID')
    }
    process.kill(cleanPid)
    return { success: true }
  } catch (e) {
    console.error(`Failed to kill process ${pid}:`, e)
    return { success: false, error: e.message }
  }
})

async function getFolderSize(dirPath, depth = 0, maxDepth = 2) {
  let totalSize = 0
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        if (depth < maxDepth) {
          totalSize += await getFolderSize(fullPath, depth + 1, maxDepth)
        }
      } else if (entry.isFile()) {
        try {
          const stats = await fs.stat(fullPath)
          totalSize += stats.size
        } catch {}
      }
    }
  } catch {}
  return totalSize
}

async function scanDirectory(targetPath) {
  try {
    const entries = await fs.readdir(targetPath, { withFileTypes: true })
    const results = []
    for (const entry of entries) {
      const fullPath = path.join(targetPath, entry.name)
      if (entry.isDirectory()) {
        const size = await getFolderSize(fullPath, 0, 1)
        results.push({ name: entry.name, isDirectory: true, size })
      } else if (entry.isFile()) {
        try {
          const stats = await fs.stat(fullPath)
          results.push({ name: entry.name, isDirectory: false, size: stats.size })
        } catch {}
      }
    }
    return results.sort((a, b) => b.size - a.size)
  } catch (e) {
    console.error(e)
    return []
  }
}

ipcMain.handle('get-disks', async () => {
  try {
    return await si.fsSize()
  } catch (e) {
    console.error('Failed to get disks:', e)
    return []
  }
})

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (result.canceled) {
    return null
  }
  return result.filePaths[0]
})

ipcMain.handle('scan-directory', async (event, targetPath) => {
  if (!targetPath) return []
  return await scanDirectory(targetPath)
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
