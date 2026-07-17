# Pulse

Pulse is an open-source desktop system monitoring application built with Electron, React, TypeScript, and Vite. It provides real-time monitoring of system resources through a modern, responsive interface, with a focus on clarity, performance, and ease of use.

> **Current Version:** v0.0.1 Beta

---

## Overview

Pulse provides a centralized dashboard for monitoring your computer's performance in real time. It combines system metrics with a rule-based health analysis engine to help users better understand the current state of their system.

The project is actively under development, with additional monitoring capabilities and diagnostic tools planned for future releases.

---

## Features

Current features include:

- Real-time CPU monitoring
- Memory usage monitoring
- Disk usage monitoring
- Network monitoring
- Overall system health score
- Rule-based performance analysis
- Live performance charts
- Process viewer
- Cross-platform desktop application

---

## Technology Stack

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- Electron Builder
- systeminformation

---

## Installation

### Download a Pre-built Release

If you simply want to use Pulse, download the latest release from the Releases page:

**https://github.com/frteddz/Pulse/releases/tag/v0.0.1-beta**

Currently supported platforms:

- Windows 10/11
- Linux (.deb)

---

### Build from Source

Pulse is fully open source. If you would like to inspect, modify, or contribute to the project, you can build it yourself.

Clone the repository:

```bash
git clone https://github.com/frteddz/Pulse.git
cd Pulse
```

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

---

## Packaging

Development build:

```bash
npm run package:dev
```

Windows installer:

```bash
npm run package:win
```

Linux (.deb):

```bash
npm run package:linux
```

---

## Project Structure

```
Pulse/
├── electron/          # Electron main process
├── public/            # Static assets
├── src/
│   ├── features/      # Application pages
│   ├── shared/        # Shared components, services, and utilities
│   └── assets/        # Images and icons
├── package.json
└── electron-builder.config.json
```

---

## Development Status

Pulse is currently in its first public beta release.

Implemented components include:

- Dashboard
- Health Engine
- Performance Analyzer
- CPU Monitoring
- Memory Monitoring
- Disk Monitoring
- Network Monitoring
- Process Viewer

The project is under active development, and additional features, optimizations, and platform improvements will continue to be added in future releases.

---

## Contributing

Contributions are welcome.

If you would like to improve Pulse, feel free to fork the repository, submit a pull request, or open an issue to report bugs or suggest new features.

---

## License

Pulse is released under the MIT License.
