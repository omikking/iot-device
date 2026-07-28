# Test Hydra Client

A **Progressive Web App (PWA)** for displaying data received from a Hydra device over **Bluetooth Low Energy (BLE)**.

# Important Points of Hydra Device and Its Working

## BLE Connection

- A Hydra device can only maintain **one BLE connection** at a time.

## Continuous Power Supply

- The Hydra device operates **only when connected to a continuous power supply**.
- The device will not function when external power is disconnected.

# About BLE

BLE communication in this project uses the **GATT (Generic Attribute Profile)** protocol.

Reference:

Introduction to Bluetooth Low Energy (https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt)


## BLE Communication Flow

1. Request the Bluetooth device using:

   ```ts
   navigator.bluetooth.requestDevice()
   ```

2. Obtain the **GATT Server**.
3. Use `getPrimaryService()` to access the required BLE service.
4. Use `getCharacteristics()` to retrieve the characteristics of the selected service.
5. Using these characteristics, the application can:
   - Read data from the device
   - Write data to the device
   - Subscribe to notifications from the device

# About Parsing

For parsing data, refer to:

- Hydra Device Documentation
- `src/ble/parser.ts`

The device sends data in binary format as a **DataView** object.

Each binary packet follows the protocol defined in the Hydra device documentation.


# About PWA

Since the application is a **Progressive Web App (PWA)**, it supports offline usage and persistent storage.

## IndexedDB

The application uses **IndexedDB** to:

- Persist data even after the browser is closed.
- Store data for offline access.

## Network Detection

The application continuously checks whether it is:

- Online
- Offline

## Service Worker

The Service Worker:

- Caches application assets.
- Caches JavaScript, CSS, and other static resources.
- Allows the application to continue working without an internet connection.

## Manifest

The `manifest.json` file defines the installed PWA metadata, including:

- Application name
- Icons
- Theme information
- Display mode

# Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite + Rolldown |
| Bluetooth | Web Bluetooth API (BLE) |
| Offline Support | Workbox (`vite-plugin-pwa`) |

# Getting Started

## Prerequisites

- Node.js (see `.nvmrc`)
- pnpm
- A Chromium-based browser with Web Bluetooth support:
  - Google Chrome
  - Microsoft Edge

> **Note**
>
> Apple Safari and Mozilla Firefox do **not** natively support the Web Bluetooth API.
>
> Use a Chromium-based browser when running the application.

# Installation

From the monorepo root:

```bash
pnpm install
```

# Running the Application

Start the development server from the monorepo root:

```bash
pnpm --filter test-hydra dev
```

Or run directly inside the `apps/test-hydra` folder:

```bash
pnpm run dev
```

The application starts in development mode at:

```text
http://localhost:3012
```

# Key Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Starts the local development server on port **3012** |
| `pnpm run build` | Builds the production PWA bundle using Vite |
| `pnpm run preview` | Previews the production build locally on port **3012** |