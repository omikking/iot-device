# Banshee Scheduler → Cart → Order → Fulfillment: Backend Implementation Spec

## 1. Overview

Build the backend for the Banshee scheduling workflow: a **Company User** selects or creates banshees in the Scheduler, adds them to a **Cart**, submits an **Order**, and a **Sandvik Technician (TSR)** fulfills that Order via the mobile app.

---

## 2. High-Level Flow

```
[Scheduler Page] → [Add to Cart] → [Cart Management] → [Submit Order] → [TSR Fulfillment]
```

### Step 1 — Banshee / Service Selection

The user navigates to the Scheduler page and clicks **"Add New Banshee."**

- **New Banshee request** — capture: `name`, `quantity`, `location`, `period`
- **Service existing Banshee** — user selects one or more existing banshees via checkboxes

### Step 2 — Add to Cart

- User clicks **"Add to Cart"**
- System stores the entry in the `CartItem` table, mapped to `companyId`

### Step 3 — Cart Management

- Cart = all `CartItems` for a given company
- Users can review items and delete items (removes row from `CartItem` table)

### Step 4 — Order Submission

On submit:

1. Create a new `Order`
2. Convert all `CartItems` → `OrderItems`
3. Clear / reset the cart

### Step 5 — TSR Workflow (Execution Layer)

- Order becomes visible to the TSR in the mobile app
- TSR can review assigned orders, then perform: register new banshees **or** service existing banshees

### Step 6 — Order Fulfillment

- Each `OrderItem` is marked `FULFILLED`
- Link generated data (e.g. `BansheeRequest`)
- Order status transitions to `COMPLETED` (all fulfilled) or `PARTIALLY_COMPLETED` (partial)

---

## 3. Architecture Decision

Use **separate Cart, Order, and OrderItem tables** (not a single table with status flags).

**Rationale:** clean separation of transient (cart) vs. permanent (order) data, better querying, and real-world domain mapping.

---

## 4. Database Schema

### 4.1 Enums

```prisma
enum CartItemType {
  NEW_BANSHEE
  SERVICE_EXISTING
}

enum OrderStatus {
  PENDING
  COMPLETED
  PARTIALLY_COMPLETED
  CANCELLED
}

enum OrderItemStatus {
  PENDING
  FULFILLED
  CANCELLED
}
```

### 4.2 Models

#### CartItem

```prisma
model CartItem {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  itemType  CartItemType

  // --- SERVICE_EXISTING ---
  bansheeRequestId String?

  // --- NEW_BANSHEE ---
  name     String?
  quantity Int      @default(1)
  location String?
  period   Int?

  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  companyId String

  bansheeRequest BansheeRequest? @relation(fields: [bansheeRequestId], references: [id], onDelete: SetNull)

  @@index([companyId])
  @@map("cart_items")
}
```

#### Order

```prisma
model Order {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  status      OrderStatus @default(PENDING)
  attachments String[]
  comment     String

  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  companyId String

  orderItems OrderItem[]

  @@index([companyId])
  @@index([status])
  @@map("orders")
}
```

#### OrderItem

```prisma
model OrderItem {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  itemType CartItemType
  status   OrderItemStatus @default(PENDING)

  bansheeRequestId String?

  // NEW_BANSHEE snapshot (copied from CartItem at submission time)
  name     String?
  quantity Int      @default(1)
  location String?
  period   Int?

  order   Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId String

  bansheeRequest BansheeRequest? @relation(fields: [bansheeRequestId], references: [id], onDelete: SetNull)

  @@index([orderId])
  @@index([status])
  @@map("order_items")
}
```

### 4.3 Relation Additions to Existing Models

Add these relations to the existing `Company` and `BansheeRequest` models:

```prisma
model Company {
  // ... existing fields ...
  cartItems CartItem[]
  orders    Order[]
}

model BansheeRequest {
  // ... existing fields ...
  cartItems  CartItem[]
  orderItems OrderItem[]
}
```

---

## 5. GraphQL API Design

### 5.1 Cart Mutations

| Mutation | Purpose |
|---|---|
| `addCartItems(input: [AddCartItemInput!]!)` | Add new or existing banshees to the cart |
| `deleteCartItem(id: ID!)` | Remove a single item from the cart |
| `clearCart` | Remove all cart items for the current company |

### 5.2 Cart Queries

| Query | Purpose |
|---|---|
| `cartItems` | Fetch all cart items for the current company |

### 5.3 Order Mutations

| Mutation | Caller | Purpose |
|---|---|---|
| `submitOrder(input: SubmitOrderInput!)` | Company User | Convert cart → order |
| `cancelOrder(id: ID!)` | Company User | Cancel an entire order |
| `fulfillOrderItem(id: ID!)` | TSR | Mark a single order item as fulfilled |
| `cancelOrderItem(id: ID!)` | TSR / Admin | Cancel a single order item |

### 5.4 Order Queries

| Query | Purpose |
|---|---|
| `orders(filter: OrderFilterInput)` | List orders (filterable by status, company, date range) |
| `order(id: ID!)` | Get a single order with its items |

---

## 6. Field Reference

### CartItem Fields

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `itemType` | `CartItemType` | `NEW_BANSHEE` or `SERVICE_EXISTING` |
| `bansheeRequestId` | UUID? | FK to `BansheeRequest` (only for `SERVICE_EXISTING`) |
| `name` | String? | Banshee name (only for `NEW_BANSHEE`) |
| `quantity` | Int | Default `1` |
| `location` | String? | Free-text location |
| `period` | Int? | Duration in days |
| `companyId` | UUID | FK to `Company` |

### Order Fields

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `status` | `OrderStatus` | `PENDING` / `COMPLETED` / `PARTIALLY_COMPLETED` / `CANCELLED` |
| `attachments` | String[] | File URLs or paths |
| `comment` | String | User-provided note |
| `companyId` | UUID | FK to `Company` |

### OrderItem Fields

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `itemType` | `CartItemType` | Copied from the source `CartItem` |
| `status` | `OrderItemStatus` | `PENDING` / `FULFILLED` / `CANCELLED` |
| `bansheeRequestId` | UUID? | FK to `BansheeRequest` |
| `name` | String? | Snapshot from cart |
| `quantity` | Int | Snapshot from cart |
| `location` | String? | Snapshot from cart |
| `period` | Int? | Snapshot from cart |
| `orderId` | UUID | FK to `Order` |

---

## 7. Mutation Flow Details

### 7.1 `addCartItems`

```
User → API: addCartItems(input)
  API → DB: Validate input (check bansheeRequestIds exist if SERVICE_EXISTING)
  API → DB: Insert CartItem rows for companyId
  DB → API: Created rows
API → User: CartItem[]
```

**Validation rules:**
- If `itemType = SERVICE_EXISTING`, `bansheeRequestId` is required and must reference a valid `BansheeRequest`
- If `itemType = NEW_BANSHEE`, `name` is required

### 7.2 `submitOrder`

```
User → API: submitOrder(input: { attachments, comment })
  API → DB: Fetch all CartItems for companyId
  API: Validate cart is not empty
  API → DB: BEGIN TRANSACTION
    API → DB: Create Order { status: PENDING, attachments, comment, companyId }
    API → DB: For each CartItem → create OrderItem (copy all fields, set orderId)
    API → DB: Delete all CartItems for companyId
  API → DB: COMMIT
API → User: Order (with orderItems)
```

**Important:** This must run in a **database transaction** to ensure atomicity — either all items move to the order and the cart is cleared, or nothing changes.

### 7.3 `fulfillOrderItem`

```
TSR → API: fulfillOrderItem(id)
  API → DB: Update OrderItem.status = FULFILLED
  API → DB: Check all sibling OrderItems for the parent Order
    - If ALL are FULFILLED → set Order.status = COMPLETED
    - If SOME are FULFILLED → set Order.status = PARTIALLY_COMPLETED
  API → TSR: Updated OrderItem
```

### 7.4 `cancelOrder`

```
User → API: cancelOrder(id)
  API → DB: Set Order.status = CANCELLED
  API → DB: Set all child OrderItems.status = CANCELLED
API → User: Updated Order
```

---

## 8. State Machines

### Order Lifecycle

```
         ┌──────────────────────────┐
         │                          │
         ▼                          │
  ┌─────────────┐    ┌─────────────────────────┐
  │   PENDING   │───▶│   PARTIALLY_COMPLETED   │
  └─────────────┘    └─────────────────────────┘
         │                          │
         │                          │
         ▼                          ▼
  ┌─────────────┐         ┌─────────────┐
  │  CANCELLED  │         │  COMPLETED  │
  └─────────────┘         └─────────────┘
```

Valid transitions:
- `PENDING` → `COMPLETED` (all items fulfilled at once)
- `PENDING` → `PARTIALLY_COMPLETED` (some items fulfilled)
- `PENDING` → `CANCELLED`
- `PARTIALLY_COMPLETED` → `COMPLETED` (remaining items fulfilled)

### OrderItem Lifecycle

```
  ┌─────────────┐
  │   PENDING   │
  └─────────────┘
       │    │
       │    │
       ▼    ▼
┌───────┐  ┌───────────┐
│CANCEL │  │ FULFILLED │
└───────┘  └───────────┘
```

Valid transitions:
- `PENDING` → `FULFILLED`
- `PENDING` → `CANCELLED`

---

## 9. Implementation Notes

- **Auth/Permissions:** Cart mutations should be scoped to the authenticated company user's `companyId`. Order fulfillment mutations should be restricted to TSR / Admin roles.
- **Snapshotting:** When converting `CartItem` → `OrderItem`, copy all fields (`name`, `quantity`, `location`, `period`) so the order is a permanent record even if the original `BansheeRequest` changes or is deleted.
- **Cascade behavior:** Deleting a `Company` cascades to both `CartItems` and `Orders`. Deleting a `BansheeRequest` sets the FK to null (`SetNull`) so historical records remain.
- **Transaction safety:** `submitOrder` must be wrapped in a Prisma `$transaction` to ensure cart-to-order conversion is atomic.
- **Order status auto-update:** After every `fulfillOrderItem` or `cancelOrderItem` call, recompute the parent `Order.status` based on the aggregate state of its `OrderItems`.
