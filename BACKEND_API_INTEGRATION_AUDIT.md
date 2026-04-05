# Activehive Admin Web — remaining API work

Forward-looking only: what is still needed so the app can be **fully** integrated end-to-end. Pages with no remaining backend gaps are not listed.

---

### Dashboard (`/dashboard`)

**APIs to be updated**

- **`GET /dashboard/recent-activities`** (current client path) — expose the canonical **admin** route (typically under `/api/admin/...`), return a stable `RecentActivity`-shaped payload, and ensure production does not rely on silent fallback to static JSON when the request fails.

**APIs to be provided**

- **Dashboard time-series: “Gyms over time”** — data feeding the revenue/gyms chart (today hardcoded in the UI).
- **Dashboard time-series: “Participants over time”** — data feeding the participants chart (today hardcoded in the UI).
- **Dashboard “Active Challenges” tile** — if the product should reflect real platform data, provide counts (and optional trend inputs) so the fourth card can drop dummy values.

---

### Gym detail (`/dashboard/gyms/:id`)

**APIs to be updated**

- **Gym / registration aggregate stats** (whatever backs `registration.stats` and `gym.memberCount`) — ensure **all** header KPIs can be sourced without hardcoded defaults: include **total classes**, **check-ins today**, and **trainer counts** (or document a single **gym metrics** payload) so the UI does not fall back to placeholder numbers when stats are missing.

**APIs to be provided**

- **Gym-scoped members list** — for the Members tab table (replaces inline demo rows).
- **Gym-scoped audit / activity feed** — for the Activity tab (replaces demo rows).
- **Gym-scoped trainers list** — for the Trainers tab (replaces demo rows).
- **RC validation** — endpoint the “Validate RC” action calls to run or record validation (and optional proof URL / status fields), replacing the current “coming soon” toast-only behavior.

---

### Subscription detail (`/dashboard/subscriptions/:id`)

**APIs to be provided**

- **`GET` subscription by id** — full detail for the placeholder screen: gym, owner, status, plan, pricing, trial/end dates, and any lifecycle fields the UI should show instead of em dashes.

---

### Challenges (`/dashboard/challenges`)

**APIs to be provided**

- **Platform challenges REST** — list/create/update/delete (or equivalent), with filters matching the UI (type, status, date) and server-side pagination if volumes grow.

---

### Badges (`/dashboard/badges`)

**APIs to be provided**

- **Platform badges REST** — list/create/update/delete and any media/metadata fields the admin UI collects.

---

### Leaderboards (`/dashboard/leaderboards`)

**APIs to be provided**

- **Platform leaderboards REST** — list/create/update/delete (scope, metric, period, status) with data that replaces the demo dataset.

---

### Global / scalability (optional but recommended)

**APIs to be updated**

- **Existing admin list endpoints** (gyms, users, members, trainers, subscriptions, etc.) — add **server-side** `page`, `limit`, `sort`, and filter parameters where the UI currently loads full arrays and filters in the browser, so integration holds at scale.
