# Test Optic-Bolt Client

A **Progressive Web App (PWA)** for displaying data received from the **Optic-Bolt** database.

The application is used to visualize Optic-Bolt test data on the UI through interactive graphs and charts.

# Important Points of the Optic-Bolt Application

## Data Creation and Updates

- Data **cannot be created or updated from the UI**.
- Data creation and updates are currently supported only through API development platform.

# About the Optic-Bolt Database

The Optic-Bolt database stores:

- Optic-Bolt test results
- Optic-Bolt spectrum data
- HydraBolt data

## Data Relationships

Each **Optic-Bolt Test Result** contains:

- One or more **Optic-Bolt Spectrums**
- One associated **HydraBolt** record

# About PWA

Since the application is a **Progressive Web App (PWA)**, it supports offline usage and persistent storage.

## IndexedDB

The application uses **IndexedDB** to:

- Persist data even after the browser is closed.
- Store data for offline access.
- Cache API responses locally.

## Incremental Data Synchronization

The application stores the **lastTimestamp** value in IndexedDB.

During synchronization:

1. The application reads the saved `lastTimestamp`.
2. It requests only newly created or updated records from the server.
3. The new records are stored in IndexedDB.
4. The `lastTimestamp` is updated for the next synchronization.

This approach minimizes network usage and improves synchronization performance.

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
| Build Tool | Vite |
| Charts | Recharts |
| Offline Support | Workbox (`vite-plugin-pwa`) + IndexedDB (`idb`) |
| API Client | GraphQL (native `fetch` queries and mutations) |

# Getting Started

## Prerequisites

- Node.js (see the root `.nvmrc`)
- pnpm
- A running GraphQL backend (default endpoint):

```text
http://localhost:3333/graphql
```

# Environment Setup

Create a `.env` file in the project directory based on `.env.example`.

```env
VITE_GRAPHQL_URL=http://localhost:3333/graphql
VITE_API_ACCESS_TOKEN=your-access-token-here
```

# Installation

From the monorepo root:

```bash
pnpm install
```

# Running the Application

Start the development server from the monorepo root:

```bash
pnpm --filter test-optic-bolt dev
```

Or run directly inside the `apps/test-optic-bolt` folder:

```bash
pnpm run dev
```

The application starts in development mode at:

```text
http://localhost:3014
```

# Key Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Starts the local development server on port **3014** |
| `pnpm run build` | Builds the production PWA bundle using Vite |
| `pnpm run preview` | Previews the production build locally on port **3014** |