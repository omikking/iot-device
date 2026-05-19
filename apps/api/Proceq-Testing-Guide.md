# Proceq Flow — Testing Guide

> Step-by-step guide to set up and test the Proceq data synchronization pipeline locally.

---

## Prerequisites

| Requirement | Details |
|---|---|
| **Node.js / pnpm** | Installed and available in PATH |
| **PostgreSQL** | Running locally (or via Docker) |
| **`.env` configured** | All `PROCEQ_*` variables set (see [Environment Variables](#5-environment-variables-reference)) |
| **Screening Eagle account** | Valid credentials for the Proceq OAuth login |

---

## 0. Set the Operator Email

Before running any steps, open `src/proceq/proceq-auth.service.ts` and set the `OPERATOR_EMAIL` constant to the email address associated with your **Screening Eagle** account:

```typescript
private readonly OPERATOR_EMAIL = 'your-email@sandvik.com';
```

**Why is this needed?**

The Proceq auth service uses `OPERATOR_EMAIL` as the **unique key** to store and retrieve OAuth tokens in the `proceq_tokens` table. When the service starts, `initializeTokenFromDB()` looks up a token row matching this email. If it's left empty (`''`), the service won't be able to persist or reload your token across server restarts, and every sync cycle will fail with an authentication error.

> [!IMPORTANT]
> This is a **temporary hardcoded value**. In a future iteration it will be replaced with dynamic per-user resolution so that each authenticated user's token is managed independently.

---

## 1. Database Setup

### 1.1 Run Migrations (empty DB)

If your database is empty or freshly created, apply all Prisma migrations first:

```bash
cd apps/api
npx prisma migrate dev
```

This creates all required tables: `proceq_data`, `proceq_readings`, `proceq_tokens`, `proceq_attachments`, `banshee_requests`, `banshee_session_stats`, `bolt_type_constants`, etc.

### 1.2 Seed Dummy Data

Seed some dummy `BansheeRequest` records and a `BoltTypeConstant` entry:

```bash
cd apps/api/prisma
npx ts-node seed-banshee.ts
```

> [!IMPORTANT]
> The seed file requires an existing **Company → Site → Level → Drive → Location** hierarchy in the DB. If you haven't seeded core data yet, run the main seed first:
> ```bash
> npx ts-node seed.ts
> ```

**What the seed creates:**
- Multiple `BansheeRequest` records with serial numbers (e.g. `MDX-U-50`, `MD-95001`, `corrosion grid001`, etc.)
- At least one `BoltTypeConstant` record (used for elongation & status calculations)

---

## 2. Start the Development Server

```bash
cd apps/api
pnpm run start:dev
```

The server starts on **`http://localhost:3000`**.

---

## 3. First-Time Authentication (Store Token in DB)

### 3.1 Trigger OAuth Login

Open your browser and navigate to:

```
http://localhost:3000/proceq/auth/login
```

This redirects you to the **Screening Eagle** OAuth2 login page.

### 3.2 Login & Callback

1. Sign in with your Screening Eagle account credentials.
2. After successful login, the OAuth flow redirects to `http://localhost:3000/callback?code=...`
3. The callback handler:
   - Exchanges the authorization code for an **access token** and **refresh token**
   - Stores the token in the `proceq_tokens` table in the DB
   - Returns `{ "status": "ok", "message": "Proceq authentication completed successfully" }`

> [!NOTE]
> The token is stored in the `ProceqToken` model with fields: `operatorEmail`, `accessToken`, `refreshToken`, and `expiresAt`. On subsequent server restarts, the service reads the stored token from the DB automatically via `initializeTokenFromDB()`.

---

## 4. Sync Process (Automatic)

### 4.1 Cron Scheduler

Once the token is stored, the **sync process starts automatically** via a cron job that runs **every 5 minutes**:

```
@Cron('0 */5 * * * *')   // every 5 minutes
```

> [!TIP]
> You do **not** need to manually trigger the sync. Just wait ~5 minutes after login and the first sync cycle will begin.

### 4.2 Key Sync Details

| Aspect | Detail |
|---|---|
| **Concurrency guard** | `isSyncing` flag prevents overlapping sync runs |
| **Batch size** | 100 measurements per export batch |
| **Export timeout** | 5 minutes (`300,000 ms`) per batch |
| **Export poll interval** | 3 seconds between status checks |
| **Attachment concurrency** | 5 measurements processed in parallel |
| **Re-sync detection** | Measurements with changed `updatedAt` timestamps are re-synced |

---

## 5. Environment Variables Reference

Ensure these are set in `apps/api/.env`:

```env
PROCEQ_CLIENT_ID=sandvik-integration-prod-kIjx9WT0z7
PROCEQ_CLIENT_SECRET=<your-secret>
PROCEQ_SCOPE=openid email profile offline
PROCEQ_WORKSPACE_DOMAIN=io.screeningeagle.com
PROCEQ_REGIONAL_DOMAIN=sg-io.screeningeagle.com
PROCEQ_REDIRECT_URI=http://localhost:3000/callback
```

> For **staging**, use the `stg-` prefixed domains from `.env.example`.

---

## 6. Where to Find the Data

### 6.1 Prisma Studio (DB Viewer)

```bash
cd apps/api
pnpm run prisma:studio
```

Opens at **`http://localhost:4444`**. Check these tables:

| Table | What to Look For |
|---|---|
| `proceq_tokens` | Stored OAuth token (access + refresh) |
| `proceq_data` | Synced measurement records with `fileName`, `operatorEmail`, `comments`, `temperature`, `status` |
| `proceq_readings` | Individual reading data per measurement (frequency, gain, velocity, gate1 values, elongation, status) |
| `proceq_attachments` | Downloaded attachment metadata (file path, size, type) |
| `banshee_requests` | Check `isProceqSynced` = `true` for linked records |
| `banshee_session_stats` | Daily aggregated stats (totalMeasured, notMeasurable, broken) |
| `bolt_type_constants` | Bolt constants used for elongation/status calculations |

### 6.2 Local File System

Two folders are created in `apps/api/` (both are **gitignored**):

#### `logs/` — Downloaded Export Archives

```
apps/api/logs/
├── <export-id>.zip          ← Original ZIP from Proceq server
└── <export-id>/             ← Extracted folder
    └── JSON_<name>/         ← Contains measurement subdirectories
        ├── <measurement-1>/
        │   └── <measurement>.json    ← Full measurement log
        ├── <measurement-2>/
        │   └── <measurement>.json
        └── ...
```

#### `proceq-data/` — Attachments & Raw Data

```
apps/api/proceq-data/
├── attachments/
│   └── <measurementId>/
│       ├── photo1.jpg       ← User photos from measurements
│       ├── photo2.png
│       └── audio.mp3        ← Audio recordings (if any)
└── raw-data/
    ├── <measurementId>_raw.json   ← Raw ultrasonic waveform data
    └── <measurementId>_raw.zip    ← Compressed version of raw data
```

---

## 7. Verifying the Sync Worked

### Checklist

- [ ] **Token stored**: `proceq_tokens` table has a row with your email
- [ ] **Measurements synced**: `proceq_data` table has new rows
- [ ] **Readings populated**: `proceq_readings` linked to each `proceq_data` record
- [ ] **BansheeRequest linked**: `banshee_requests` with matching `serialNumber` have `isProceqSynced = true`
- [ ] **Stats updated**: `banshee_session_stats` has entries for the measurement dates
- [ ] **Attachments downloaded**: `proceq-data/attachments/` has folders with images/audio
- [ ] **Raw data saved**: `proceq-data/raw-data/` has `.json` and `.zip` files
- [ ] **Logs folder**: `logs/` has the downloaded and extracted export archives
- [ ] **Status computed**: `proceq_readings` have `status` values (PASS/FAIL/etc.) where applicable
- [ ] **Elongation calculated**: `proceq_readings` have `elongation` values where `gate1SoundPathDistanceInTimeUnit` is present

### Console Logs to Watch

During sync, the server console shows progress like:

```
[ProceqSchedulerService] Triggered Proceq data synchronization
[ProceqSyncService] Starting Proceq data synchronization
[ProceqSyncService] Found 450 total measurements, 5 pages to process
[ProceqSyncService] Total measurements processed: 450, New: 12, Updated: 3
[ProceqSyncService] Starting batch processing with batch size 100 for 15 measurements
[ProceqSyncService] Progress: 100.00% (15/15)
[ProceqSyncService] Sync completed in 45230ms. New: 12, Updated: 3, Failed batches: 0
[ProceqSchedulerService] Proceq sync completed in 45230ms — scanned: 450, new: 12
```

---

## 8. Troubleshooting

| Issue | Solution |
|---|---|
| **"Proceq sync was skipped (already running)"** | Previous sync is still in progress. Wait for it to finish. |
| **Token expired / 401 errors** | The service auto-refreshes tokens. If refresh fails, re-login at `/proceq/auth/login`. |
| **"No BansheeRequest found for serial"** | The measurement's `serialNumber` doesn't match any seeded `BansheeRequest`. This is normal for unlinked measurements — they are still saved. |
| **Export timeout** | Large batches may take time. The 5-min timeout per batch should be sufficient. Check network connectivity. |
| **Missing readings/status** | Some measurements may not have readings (empty `readings[]` array). Status is only computed when `gate1SoundPathDistanceInTimeUnit` is present. |
| **"PROCEQ_REGIONAL_DOMAIN environment variable is not set"** | Ensure `.env` file is properly configured with all `PROCEQ_*` variables. |

---

