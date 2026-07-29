# Banshee Backend Unit Tests

Jest unit tests for the Banshee backend service layer. They cover the backend
smoke cases in [`BANSHEE_SMOKE_TEST_CASES.md`](../../../BANSHEE_SMOKE_TEST_CASES.md)
(Part B) **and** extended branch coverage of the full service logic
(access control, hierarchy validation, order-item linking, batch fulfilment,
status recomputation, measurement classification, etc.).

**168 tests across 6 suites** — ~95% statement / 95% function coverage of the
six Banshee services (request, cart, order, template, stats, communication).

These tests run **in isolation** from the existing test setup:

- They use a dedicated config, [`jest.unit.config.js`](../jest.unit.config.js),
  and only discover specs inside this `unit-test/` folder.
- The default `pnpm test` (the `"jest"` key in `package.json`) is unchanged and
  does **not** pick these up, so nothing else in the codebase is affected.

## Running

```bash
pnpm --filter api test:unit          # run once
pnpm --filter api test:unit:watch    # watch mode
pnpm --filter api test:unit:cov      # with coverage
```

## Approach

Each test exercises a service directly with a fully **mocked PrismaService**
(see [`test-utils.ts`](./test-utils.ts)) — no database is required. Resolvers are
thin pass-throughs to the services and are not unit-tested separately. The
`$transaction` mock supports both the callback and array call styles used by the
services.

## Coverage map

| Smoke case | Test file                                  | What it verifies                                        |
| ---------- | ------------------------------------------ | ------------------------------------------------------- |
| BE-REQ-01  | `banshee/banshee-request.service.spec.ts`  | Create — happy path persists & returns an id            |
| BE-REQ-02  | "                                          | Paginated list honours offset/limit + totalRecords      |
| BE-REQ-03  | "                                          | Fetch by id (and NOT_FOUND error)                       |
| BE-REQ-04  | "                                          | Update touches only supplied fields                     |
| BE-REQ-05  | "                                          | Duplicate serial rejected, no row written               |
| BE-CRT-01  | `banshee/banshee-cart.service.spec.ts`     | Add mixed items; skip-with-reason; required-field guard |
| BE-CRT-02  | "                                          | List cart items scoped to company w/ relations          |
| BE-CRT-03  | "                                          | Update NEW_BANSHEE item + ownership/type guards         |
| BE-CRT-04  | "                                          | Delete single item; clear cart returns true             |
| BE-CRT-05  | "                                          | Stats aggregation (newBanshee/serviceExisting/total)    |
| BE-ORD-01  | `banshee/banshee-order.service.spec.ts`    | Submit order from cart, expand by qty, clear cart       |
| BE-ORD-02  | "                                          | List orders with status/company/date filters            |
| BE-ORD-03  | "                                          | Get by id + access scoping                              |
| BE-ORD-04  | "                                          | Cancel/Complete transitions + invalid transitions       |
| BE-ORD-05  | "                                          | Fulfil/Cancel item + order status recompute             |
| BE-TMP-01  | `banshee/banshee-template.service.spec.ts` | Create + duplicate-name rejection                       |
| BE-TMP-02  | "                                          | List by company                                         |
| BE-TMP-03  | "                                          | Fetch by id (NOT_FOUND error)                           |
| BE-TMP-04  | "                                          | Update fields                                           |
| BE-TMP-05  | "                                          | Delete + NOT_FOUND guard                                |
| BE-STT-01  | `banshee/banshee-stats.service.spec.ts`    | Session stats day-aligned date range                    |
| BE-STT-02  | "                                          | Filter by company + non-admin access denial             |
| BE-STT-03  | "                                          | Filter by site                                          |
| BE-STT-04  | "                                          | Empty range returns `[]`                                |
| BE-STT-05  | "                                          | Aggregation accuracy (increment/decrement, clamped)     |

## Extended coverage (beyond the smoke cases)

Each suite also covers, per service:

- **request:** relation validation (level/drive/location not-found & mismatch),
  order-item linking + its guards, invalid image type, generic error wrapping,
  list filters & non-admin scoping, `remove` (with stats roll-back),
  `getStatusDistribution` aggregation, `getEventLogs`.
- **cart:** non-existent request guard, empty input, partial-field updates.
- **order:** non-admin company scoping, ownership checks, default paging,
  `fulfillOrderItemsForBansheeRequests` (happy / ambiguous / no-pending),
  status recompute edge cases (PARTIALLY_COMPLETED, COMPLETED, no-op).
- **template:** non-admin access, hierarchy validation, rename-collision rules.
- **stats:** non-admin access matrix, measurement classification
  (broken / not-measurable / temperature-error / no-logs), create vs delete.

## Notes / behaviour observations (worth a follow-up)

- **BE-TMP-03 / BE-TMP-05:** the smoke doc says fetch-by-id returns `null` for a
  missing id. The service actually raises a `BANSHEE_TEMPLATE_NOTFOUND_ERROR`
  business error; the tests assert the **real** behaviour.
- **Access-denied errors are masked as generic errors.** In several
  `banshee-request` and `banshee-template` methods, the access-control
  `ForbiddenException` is thrown _inside_ a broad `try/catch` whose handler only
  re-throws `UserInputError`. The `ForbiddenException` is therefore swallowed and
  re-wrapped as a generic error:

  - `BansheeRequestsService.findAll` → `BANSHEE_REQUESTS_FETCH_ERROR`
  - `BansheeRequestsService.findOne` → `BANSHEE_REQUEST_FETCH_ERROR`
  - `BansheeTemplateService.createBansheeTemplate` → `BANSHEE_TEMPLATE_CREATION_ERROR_GENERIC`
  - `BansheeTemplateService.updateBansheeTemplate` (same pattern)

  The request is still correctly denied (no query runs), but the client receives
  a misleading generic error instead of an access-denied error. The tests assert
  the _current_ behaviour and mark these spots — consider re-throwing
  `ForbiddenException` from those catch blocks. (`remove`, `findBansheeTemplateById`
  and `getStatusDistribution` already propagate it correctly.)
