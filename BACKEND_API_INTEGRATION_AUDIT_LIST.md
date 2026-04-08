# Activehive Admin Web — backend API checklist (list)

**Table format (same content):** [`BACKEND_API_INTEGRATION_AUDIT.md`](./BACKEND_API_INTEGRATION_AUDIT.md)

Same contract as the table version, in **nested lists** for easier reading. Audience: **backend only.**

---

## Dashboard (`/dashboard`)

### APIs to be updated

- **`GET /api/admin/dashboard/stats`**
  - **Response:** add optional **`activeChallengesCount`** (integer, ≥ 0). Omit or send `0` if the product does not track challenges yet.
  - **Request:** no change.

- **`GET /api/admin/dashboard/recent-activities`**
  - **Purpose:** canonical admin activity feed (if an older non-`/api/admin/...` path exists for the same data, implement this route and deprecate the old one).
  - **Response:** JSON **array**; each element must include **`id`** (number), **`action`** (string), **`target`** (string), **`admin`** (string), **`when`** (ISO 8601 string), **`status`** (string).
  - **Request (optional query):** `search` (string), `status` (string), `dateFrom` (ISO date), `dateTo` (ISO date), if you implement server-side filtering.

---

### APIs to be provided

- **`GET /api/admin/dashboard/charts/gyms-over-time`**
  - Time series for “Gyms over time”. Response: ordered points with at least **`monthLabel`** (string) and **`count`** (integer). Query **`range`** or **`months`** as you standardize.

- **`GET /api/admin/dashboard/charts/participants-over-time`**
  - Time series for “Participants over time”. Response: **`monthLabel`** (string), **`count`** (integer). Same date-range conventions as other admin charts.

---

## Gym detail (`/dashboard/gyms/:id`)

### APIs to be updated

- **`GET /api/admin/gyms/{gymId}`**
  - **Response:** on **`gym`**, always return when computable (non-null): **`memberCount`** (integer), **`activeMemberCount`** (integer), **`revenue`** (string, display-ready, e.g. formatted currency).
  - **Request:** no change.

- **`GET /api/gym/{gymId}/registration-status`**
  - **Response:** on **`stats`**, add **`totalClasses`** (integer) and **`checkInsToday`** (integer). Keep **`totalMembers`**, **`totalTrainers`**, **`totalLocations`**, **`activeMemberships`** populated when computable ( **`activeMemberships`** is shown as active members count in the UI).
  - **Request:** no change.

---

### APIs to be provided

- **`GET /api/admin/gyms/{gymId}/members`**
  - Paginated members for the **Members** tab. Query: **`page`**, **`limit`**, optional **`search`**, **`status`**. Rows: at least name, email, status, join date, last check-in (match table columns).

- **`GET /api/admin/gyms/{gymId}/activity`**
  - Paginated audit/activity log for the **Activity** tab. Query: **`page`**, **`limit`**, optional **`dateFrom`**, **`dateTo`**.

- **`GET /api/admin/gyms/{gymId}/trainers`**
  - Trainers for the **Trainers** tab. Query: **`page`**, **`limit`**, optional **`status`**.

- **`POST /api/admin/gyms/{gymId}/rc-validation`**
  - Triggers RC validation for that gym’s registration. Response: **`status`** (e.g. pending/succeeded/failed), optional **`verified`** (boolean), **`proofUrl`** (string), **`message`** (string).

---

## Subscription detail (`/dashboard/subscriptions/:id`)

### APIs to be provided

- **`GET /api/admin/subscriptions/{subscriptionId}`**
  - Full detail: gym (id, name), owner (id, name, email), **status**, plan (id, name), **pricing** (amount, currency, billing period), **trial** start/end, **subscription** start/end, **nextPaymentDate**, **autoRenew**, cancellation fields as your domain defines.

---

## Challenges (`/dashboard/challenges`)

### APIs to be provided

- **`GET /api/admin/challenges`** — list. Query: **`page`**, **`limit`**, optional **`type`**, **`status`**, **`dateFrom`**, **`dateTo`**, **`search`**.
- **`POST /api/admin/challenges`** — create (body aligned with admin UI: name, slug, type, description, schedule, rewards, etc.).
- **`PATCH /api/admin/challenges/{challengeId}`** — partial update.
- **`DELETE /api/admin/challenges/{challengeId}`** — delete or archive (per product rules).

---

## Badges (`/dashboard/badges`)

### APIs to be provided

- **`GET /api/admin/badges`** — list with filters/pagination per UI.
- **`POST /api/admin/badges`** — create.
- **`PATCH /api/admin/badges/{badgeId}`** — update.
- **`DELETE /api/admin/badges/{badgeId}`** — delete or archive.

---

## Leaderboards (`/dashboard/leaderboards`)

### APIs to be provided

- **`GET /api/admin/leaderboards`** — list; filters: scope, metric, period, status; pagination.
- **`POST /api/admin/leaderboards`** — create.
- **`PATCH /api/admin/leaderboards/{leaderboardId}`** — update.
- **`DELETE /api/admin/leaderboards/{leaderboardId}`** — delete or archive.

---

## Optional: list endpoints (scalability)

### APIs to be updated

- **`GET /api/admin/gyms`** — request: **`page`**, **`limit`**, optional **`sort`**, **`order`**, **`search`**, **`approvalStatus`**, **`isActive`**. Response: paginated envelope **`items`**, **`total`**, **`page`**, **`pageSize`** (or your standard).
- **`GET /api/admin/members`** — same pagination + filters pattern; paginated envelope.
- **`GET /api/admin/users`** — same.
- **`GET /api/admin/trainers`** — same.
- **`GET /api/admin/subscriptions`** — same.
- **`GET /api/admin/locations`** — same.
- **`GET /api/admin/staff`** — same.

---

## Audit scope

This checklist is the **backend contract** for **known** integration gaps in the admin app at audit time. Anything **not** listed is **out of scope** for this document. New screens or contract changes require a new pass.
