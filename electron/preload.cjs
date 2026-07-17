const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getCpuSnapshot: () => ipcRenderer.invoke('get-cpu-snapshot'),
  getMemorySnapshot: () => ipcRenderer.invoke('get-memory-snapshot'),
  getDiskSnapshot: () => ipcRenderer.invoke('get-disk-snapshot'),
  getNetworkSnapshot: () => ipcRenderer.invoke('get-network-snapshot'),
  getGpuSnapshot: () => ipcRenderer.invoke('get-gpu-snapshot'),
  getBatterySnapshot: () => ipcRenderer.invoke('get-battery-snapshot'),
  getTemperatureSnapshot: () => ipcRenderer.invoke('get-temperature-snapshot'),
  getTelemetry: () => ipcRenderer.invoke('get-telemetry'),
  getProcesses: () => ipcRenderer.invoke('get-processes'),
  killProcess: (pid) => ipcRenderer.invoke('kill-process', pid),
  getDisks: () => ipcRenderer.invoke('get-disks'),
})
