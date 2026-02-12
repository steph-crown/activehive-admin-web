# ActiveHive Gym Web

> Frontend for ActiveHive Gym built with Vite + React 19, TanStack Query, Axios, and Zustand.

## Architecture

The app mirrors the modular layout in `idea-hub/`:

```
src/
├─ app/                      # File-based routing, grouped folders `(auth)`
│  ├─ (auth)/login/page.tsx  # Each page imports its feature entry component
│  └─ dashboard/page.tsx
├─ components/               # Shared UI: atoms, icons, layouts, loaders, toast, shadcn ui
├─ features/                 # Feature modules (auth, dashboard)
│  ├─ auth/
│  │  ├─ components/         # Forms + page shells per route
│  │  ├─ services/           # Axios/TanStack Query mutations
│  │  └─ types/
│  └─ dashboard/
│     ├─ components/         # Dashboard-only UI
│     ├─ services/           # Axios API + Query hooks + mock data
│     └─ store/              # Feature scoped Zustand stores
├─ hooks/                    # Reusable hooks (e.g. `use-toast`)
├─ lib/
│  ├─ api-client.ts          # Axios instance + interceptors
│  └─ utils.ts
├─ providers/                # Context providers (toast, etc.)
├─ store/                    # App-wide Zustand stores
└─ assets/                   # Static assets
```

### Conventions

- **Folder & file names** use kebab-case (except React components like `App.tsx`).
- **Routes** live in `src/app`, using parentheses folders when grouping should not contribute to the URL (`(auth)`).
- **Features** own their `components/`, `services/`, `store/`, and `types/` slices.
- **Data fetching**: TanStack Query (`@tanstack/react-query`) + Axios (`src/lib/api-client.ts`).
- **State management**: Zustand stores in `src/store` and feature-level stores where needed.
- **Shared UI** lives in `src/components`, organized into `atoms`, `icons`, `layouts`, `loader`, `toast`, and `ui`.

in subscriptions page, i am at a dilemma as to the architecture to use. currently i have a tab of subscription and subscription plans. but thing is, there's two types of subscription plans - for gym owner and for trainer (three actually - and for members of a gym). but in the subscriptions page, i want to put everything about trainer and gym owner sub. in gym owner details page, that's where i want to put the subscription plans for gym owner. same goes for trainer details page. So in subscriptions page, we have for gym owner alone
