# Test Cyclops Client

A Progressive Web App (**PWA**) for displaying data received from a Cyclops device over Bluetooth Low Energy (**BLE**).

## Important Points of the Cyclops Device and Its Working

### BLE Connection

- A Cyclops device can only maintain one **BLE** connection at a time.

### Low Battery

- If the battery is low, some functionality may not work properly.
- Replace the battery before troubleshooting other issues.

### Device Does Not Connect

If the device does not connect:

1. Press and hold the button for **5 seconds**.
2. Release the button.
3. Press it again for **1 second**.
4. Try connecting again.

---

# About BLE

**BLE** communication in this project uses the **GATT (Generic Attribute Profile)** protocol.

Reference:

Introduction to Bluetooth Low Energy (https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt)


## BLE Communication Flow

1. Request the Bluetooth device using:
   ```ts
   navigator.bluetooth.requestDevice()
   ```
2. Obtain the **GATT Server**.
3. Use `getPrimaryService()` to retrieve the required BLE service.
4. Use `getCharacteristics()` to retrieve the characteristics of the selected service.
5. Using these characteristics, the application can:
   - Read data from the device.
   - Write data to the device.
   - Subscribe to notifications from the device.

---

# About Parsing

For parsing data, refer to:

- Cyclops Device Documentation
- `src/ble/parser.ts`

The device sends data in binary format as a `DataView` object.

Each binary packet follows the protocol defined in the Cyclops documentation.


---

# About PWA

Since the application is a Progressive Web App (**PWA**), it provides offline capabilities and persistent storage.

## IndexedDB

The application uses **IndexedDB** to:

- Persist data even after the browser is closed.
- Support offline usage.

## Network Detection

The application continuously checks the network status to determine whether it is online or offline.

## Service Worker

The Service Worker is responsible for:

- Caching application code.
- Caching static assets.
- Enabling offline functionality.

This allows the application to continue working even when the network is unavailable.

## Manifest

The `manifest.json` file defines the metadata of the installed PWA, including:

- Application name
- Icons
- Theme settings
- Display mode
- Other installation metadata

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite + Rolldown |
| Bluetooth Protocol | Web Bluetooth API (BLE) |
| Offline Support | Workbox (`vite-plugin-pwa`) |

---

# Getting Started

## Prerequisites

- Node.js (see `.nvmrc`)
- pnpm
- A Chromium-based browser with Web Bluetooth support:
  - Google Chrome
  - Microsoft Edge

> **Note**
>
> Apple Safari and Mozilla Firefox do not natively support the Web Bluetooth API.
>
> Use a Chromium-based browser when running the application.

---

# Installation

From the monorepo root:

```bash
pnpm install
```

---

# Running the Application

Start the development server from the monorepo root:

```bash
pnpm --filter test-cyclops dev
```

Or run directly inside the `apps/test-cyclops` folder:

```bash
pnpm run dev
```

The application starts in development mode at:

```
http://localhost:3002
```

---

# Key Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Starts the local development server on port **3002**. |
| `pnpm run build` | Builds the production PWA bundle using Vite. |
| `pnpm run preview` | Previews the production build locally on port **3002**. |