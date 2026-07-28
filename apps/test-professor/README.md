# Test Professor Client

A **Progressive Web App (PWA)** for displaying data received from a Professor device over **Bluetooth Low Energy (BLE)**.

# Important Points of Professor Device and Its Working

## BLE Connection

- A Professor device can only maintain **one BLE connection** at a time.

## macOS Compatibility

- The Professor device **does not work on MacBook/macOS** due to Web Bluetooth or device compatibility limitations.

## Power Management

When external power is removed, the Professor runs in **internal battery mode**.

The device has two configuration values that determine when it automatically powers off:

| Configuration | Description |
|--------------|-------------|
| `MinShutdownTimeout (12)` | The minimum amount of time the Professor waits before it can shut down. |
| `MaxShutdownTimeout (13)` | The maximum amount of time the Professor waits before it must shut down. |

Between the minimum and maximum timeout values, the Professor decides to shut down only if **all** of the following conditions are met:

- There is **no sensor status** or **message data** remaining in its queue.
- The device is **not connected to any BLE sensors**.

# About BLE

BLE communication in this project uses the **GATT (Generic Attribute Profile)** protocol.

**Reference:**

- Introduction to Bluetooth Low Energy (https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt)

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

- Professor Device Documentation
- `src/ble/parser.ts`

The device sends data in binary format as a **DataView** object.

Each binary packet follows the protocol defined in the Professor device documentation.

## Current Limitation

- Raw Hex History data parsing has **not yet been implemented**.

**Document Path:** *(Add document path here)*

# About PWA

Since the application is a **Progressive Web App (PWA)**, it supports offline usage and persistent storage.

## IndexedDB

The application uses **IndexedDB** to:

- Persist data even after the browser is closed.
- Store data for offline access.

## Network Detection

The application continuously checks whether the device is:

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
pnpm --filter test-professor dev
```

Or run directly inside the `apps/test-professor` folder:

```bash
pnpm run dev
```

The application starts in development mode at:

```text
http://localhost:3013
```

# Key Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Starts the local development server on port **3013** |
| `pnpm run build` | Builds the production PWA bundle using Vite |
| `pnpm run preview` | Previews the production build locally on port **3013** |