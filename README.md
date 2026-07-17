# Pulse

Pulse is a cross-platform desktop system monitoring application built with **Electron**, **React**, **TypeScript**, and **Vite**. It provides real-time information about your computer's performance through a modern, responsive interface.

> **Status:** Beta (v0.0.1)

---

## Features

- Real-time CPU monitoring
- Memory usage monitoring
- Disk usage monitoring
- Network monitoring
- System Health Score
- Performance analysis engine
- Live performance charts
- Process viewer
- Modern desktop UI

---

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- Electron Builder
- systeminformation

---

## Project Structure

```
Pulse/
├── electron/          # Electron main process
├── public/            # Static assets
├── src/
│   ├── features/      # Application pages
│   ├── shared/        # Shared components, services, types
│   └── assets/        # Images and icons
├── package.json
└── electron-builder.config.json
```

---

## Development

### Install dependencies

```bash
npm install
```

### Start development mode

```bash
npm run dev
```

---

## Packaging

### Development build

```bash
npm run package:dev
```

### Windows

```bash
npm run package:win
```

### Linux (.deb)

```bash
npm run package:linux
```

---

## Current Status

Pulse is currently in active development.

Implemented:

- Dashboard
- Health Engine
- Performance Analyzer
- CPU Monitoring
- Memory Monitoring
- Disk Monitoring
- Network Monitoring
- Process Viewer

Planned:

- Startup Apps Manager
- GPU Monitoring
- Temperature Monitoring
- Advanced Task Manager
- Historical Statistics
- Plugin Support

---

## Contributing

Issues, suggestions, and pull requests are welcome.

If you find a bug or have a feature request, please open an Issue on GitHub.

---

## License

This project is licensed under the MIT License.
