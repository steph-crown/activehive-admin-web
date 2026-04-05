# Activehive Admin Web — backend API checklist

Audience: **backend only.** Each table states what to **change on an existing API** or what **new API** to ship. No frontend implementation notes.

---

## Dashboard (`/dashboard`)

### APIs to be updated

| Endpoint | Method | Change to response body | Change to request (query / path) |
| -------- | ------ | ------------------------ | ---------------------------------- |
| `/api/admin/dashboard/stats` | GET | Add optional field **`activeChallengesCount`** (integer, ≥ 0). Omit or send `0` if the product does not track challenges yet. | — |
| `/api/admin/dashboard/recent-activities` | GET | **New canonical path** for the admin activity feed. Return a **JSON array**; each element **must** include: **`id`** (number), **`action`** (string), **`target`** (string), **`admin`** (string), **`when`** (ISO 8601 string), **`status`** (string). | **Optional query params** (if you implement server-side filtering): `search` (string), `status` (string), `dateFrom` (ISO date), `dateTo` (ISO date). |

**Note:** If anything today is exposed at a non-`/api/admin/...` path for the same feed, treat this row as “implement **`GET /api/admin/dashboard/recent-activities`** with the body above” and deprecate the old route.

---

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/dashboard/charts/gyms-over-time` | Time series for the admin dashboard “Gyms over time” chart. Response: ordered points with at least **`monthLabel`** (string) and **`count`** (integer). Support query **`range`** or **`months`** as you standardize. |
| GET | `/api/admin/dashboard/charts/participants-over-time` | Time series for “Participants over time”. Response: ordered points with **`monthLabel`** (string) and **`count`** (integer). Same date-range conventions as other admin charts. |

---

## Gym detail (`/dashboard/gyms/:id`)

### APIs to be updated

| Endpoint | Method | Change to response body | Change to request |
| -------- | ------ | ------------------------ | ----------------- |
| `/api/admin/gyms/{gymId}` | GET | On the **`gym`** object, always return when computable (non-null): **`memberCount`** (integer), **`activeMemberCount`** (integer), **`revenue`** (string, display-ready, e.g. formatted currency). | — |
| `/api/gym/{gymId}/registration-status` | GET | On **`stats`**, add **`totalClasses`** (integer) and **`checkInsToday`** (integer). Continue returning **`totalMembers`**, **`totalTrainers`**, **`totalLocations`**, **`activeMemberships`** (used as active members count in the UI); all should be populated when computable. | — |

---

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/gyms/{gymId}/members` | Paginated members for the gym detail **Members** tab. Query: **`page`**, **`limit`**, optional **`search`**, **`status`**. Each row: at least name, email, status, join date, last check-in (match what the table columns need). |
| GET | `/api/admin/gyms/{gymId}/activity` | Paginated audit/activity log for the **Activity** tab. Query: **`page`**, **`limit`**, optional **`dateFrom`**, **`dateTo`**. |
| GET | `/api/admin/gyms/{gymId}/trainers` | Trainers for the **Trainers** tab. Query: **`page`**, **`limit`**, optional **`status`**. |
| POST | `/api/admin/gyms/{gymId}/rc-validation` | Triggers RC validation for that gym’s registration payload. Response: **`status`** (e.g. pending/succeeded/failed), optional **`verified`** (boolean), optional **`proofUrl`** (string), optional **`message`** (string). |

---

## Subscription detail (`/dashboard/subscriptions/:id`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/subscriptions/{subscriptionId}` | Full subscription detail: gym (id, name), owner (id, name, email), **status**, plan (id, name), **pricing** (amount, currency, billing period), **trial** start/end, **subscription** start/end, **nextPaymentDate**, **autoRenew**, any cancellation fields your domain uses. |

---

## Challenges (`/dashboard/challenges`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/challenges` | List challenges. Query: **`page`**, **`limit`**, optional **`type`**, **`status`**, **`dateFrom`**, **`dateTo`**, **`search`**. |
| POST | `/api/admin/challenges` | Create challenge. Body: name, slug, type, description, schedule, rewards, etc. (align with admin UI). |
| PATCH | `/api/admin/challenges/{challengeId}` | Partial update. |
| DELETE | `/api/admin/challenges/{challengeId}` | Delete or archive (per product rules). |

---

## Badges (`/dashboard/badges`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/badges` | List with filters/pagination as needed by the admin UI. |
| POST | `/api/admin/badges` | Create. |
| PATCH | `/api/admin/badges/{badgeId}` | Update. |
| DELETE | `/api/admin/badges/{badgeId}` | Delete or archive. |

---

## Leaderboards (`/dashboard/leaderboards`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/leaderboards` | List with filters (scope, metric, period, status) + pagination. |
| POST | `/api/admin/leaderboards` | Create. |
| PATCH | `/api/admin/leaderboards/{leaderboardId}` | Update. |
| DELETE | `/api/admin/leaderboards/{leaderboardId}` | Delete or archive. |

---

## Optional: list endpoints (scalability)

### APIs to be updated

| Endpoint | Method | Change to request | Change to response |
| -------- | ------ | ----------------- | ------------------ |
| `/api/admin/gyms` | GET | Add **`page`**, **`limit`**, optional **`sort`**, **`order`**, **`search`**, **`approvalStatus`**, **`isActive`**. | Paginated envelope: **`items`**, **`total`**, **`page`**, **`pageSize`** (or your standard). |
| `/api/admin/members` | GET | Same pattern for pagination + filters. | Paginated envelope. |
| `/api/admin/users` | GET | Same pattern. | Paginated envelope. |
| `/api/admin/trainers` | GET | Same pattern. | Paginated envelope. |
| `/api/admin/subscriptions` | GET | Same pattern. | Paginated envelope. |
| `/api/admin/locations` | GET | Same pattern. | Paginated envelope. |
| `/api/admin/staff` | GET | Same pattern. | Paginated envelope. |

---

## Audit scope

This checklist is the **backend contract** for **known** integration gaps in the admin app at audit time. Anything **not** listed above is **out of scope** for this document. New screens or contract changes require a new pass.
