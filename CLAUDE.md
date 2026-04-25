# ActiveHive Gym Admin Web

Admin dashboard for the ActiveHive platform — manages gyms, gym owners, members, trainers, subscriptions, challenges, badges, and leaderboards. Built as a Vite SPA.

## Tech Stack

| Tool | Version | Role |
|------|---------|------|
| React | 19.2.1 | UI |
| TypeScript | 5.8.3 (strict) | Types |
| Vite + SWC | 6.3.5 | Build |
| React Router DOM | 7.6.3 | Routing (manual, not file-based) |
| TanStack Query | 5.90.8 | Server state + caching |
| TanStack Table | 8.21.3 | Data tables |
| Zustand | 5.0.8 | Client state (auth, UI) |
| Axios | 1.13.2 | HTTP client |
| React Hook Form | 7.66.0 | Forms |
| Yup | 1.7.1 | Form validation schemas |
| Zod | 3.25.67 | **Installed but unused** — do not introduce unless clarified |
| TailwindCSS | 4.1.10 (Vite plugin) | Styling |
| Radix UI | various | Accessible primitives |
| CVA | 0.7.1 | Component variants |
| Sonner | 2.0.5 | Toast (installed but see Toast section) |
| Framer Motion | 12.19.2 | Animations (auth carousel) |
| dnd-kit | 6.3.1 | Drag-and-drop in tables |
| Recharts | 3.0.2 | Charts |

## Key Commands

```bash
pnpm dev          # dev server
pnpm build        # tsc -b && vite build
pnpm lint         # eslint .
pnpm preview      # preview prod build
```

No test runner is installed. Do not add tests unless explicitly asked.

## Environment Variables

```
VITE_API_BASE_URL   # defaults to https://activehiveapi.onrender.com
```

## Project Structure

```
src/
├── app/                    # Route components — thin wrappers only
│   ├── (auth)/             # Parentheses = grouped routes (no URL segment)
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── admins/page.tsx
│   │   ├── gyms/page.tsx
│   │   ├── gyms/detail/page.tsx
│   │   └── ...             # One page.tsx per route
│   └── profile/page.tsx
│
├── features/               # Feature modules — all real logic lives here
│   └── [feature]/
│       ├── components/     # Feature UI (page, table, dialogs, forms/)
│       ├── services/
│       │   ├── api.ts      # Raw API calls via apiClient
│       │   ├── queries.ts  # useQuery hooks + queryKeys factory
│       │   ├── mutations.ts# useMutation hooks
│       │   └── index.ts    # Re-exports
│       ├── types/index.ts  # Feature types
│       ├── lib/            # Feature-specific helpers (display transforms)
│       └── constants/      # Static lists, enums
│
├── components/
│   ├── ui/                 # Radix + Tailwind atoms (shadcn pattern)
│   ├── molecules/          # Composite shared components
│   ├── data-table/         # TanStack Table wrapper (drag, sort, filter)
│   ├── layouts/            # auth-layout.tsx
│   ├── loader/             # block-loader, inline-loader, page-skeleton
│   ├── toast/              # Legacy — see Toast section
│   └── icons/
│
├── hooks/
│   ├── use-toast.ts        # useToast() — canonical toast hook
│   ├── use-upload.ts       # File upload (single + multi)
│   └── use-mobile.ts       # 768px breakpoint hook
│
├── lib/
│   ├── api-client.ts       # Axios instance (returns response.data directly)
│   ├── utils.ts            # cn(), formatDate()
│   ├── table-filters.ts    # rowMatchesSearch(), rowMatchesDateField()
│   └── site-header-title.ts# Route → page title map
│
├── store/
│   ├── auth.store.ts       # useAuthStore — user session + token
│   ├── ui.store.ts         # useUIStore — sidebar open state
│   └── gym-owner-registration.store.ts
│
├── providers/
│   ├── toast-context.tsx   # ToastContext definition
│   ├── toast-provider.tsx  # ToastProvider (wraps app in main.tsx)
│   └── index.ts
│
├── App.tsx                 # BrowserRouter + all Routes (manual registration)
├── main.tsx                # createRoot + providers
└── index.css               # Tailwind + OKLCH tokens + Satoshi font
```

## Routing — Critical

Routes are **manually registered** in `src/App.tsx`. The `src/app/` folder structure mirrors the routes visually but is NOT auto-scanned. When adding a route you must:

1. Create `src/app/[path]/page.tsx` (thin wrapper importing from features/)
2. Add a `lazy()` import in `App.tsx`
3. Add a `<Route>` element in `App.tsx`

Skipping step 2 or 3 = route 404s silently. The Next.js-style folder structure is cosmetic.

## API Client

`src/lib/api-client.ts` — the Axios interceptor unwraps `response.data` before returning. **Do not call `.data` on the result** — you already have the payload.

```typescript
// Correct
const gyms = await apiClient.get<Gym[]>("/api/admin/gyms");

// Wrong — double-unwraps
const gyms = await apiClient.get<{ data: Gym[] }>("/api/admin/gyms").data;
```

Auth: token read from `localStorage` key `activehive_token` on every request. 401 responses clear the token automatically.

## Feature Services Pattern

### API module (`services/api.ts`)
```typescript
const basePath = "/api/admin/[feature]";

export const featureApi = {
  getAll: (): Promise<Item[]> => apiClient.get(basePath),
  getById: (id: string): Promise<ItemDetail> => apiClient.get(`${basePath}/${id}`),
  create: (data: CreateDto): Promise<Item> => apiClient.post(basePath, data),
  update: (id: string, data: UpdateDto): Promise<Item> => apiClient.patch(`${basePath}/${id}`, data),
  delete: (id: string): Promise<void> => apiClient.delete(`${basePath}/${id}`),
};
```

### Query keys factory (`services/queries.ts`)
```typescript
export const featureQueryKeys = {
  all: ["feature"] as const,
  list: () => [...featureQueryKeys.all, "list"] as const,
  detail: (id: string) => [...featureQueryKeys.all, "detail", id] as const,
};
```

### Query hook
```typescript
export const useFeatureQuery = () =>
  useQuery<Item[]>({
    queryKey: featureQueryKeys.list(),
    queryFn: () => featureApi.getAll(),
  });
```

### Mutation hook (`services/mutations.ts`)
```typescript
export const useCreateFeatureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDto) => featureApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.list() });
    },
  });
};
```

## State Management

| Concern | Solution |
|---------|----------|
| Server data | TanStack Query |
| User session | `useAuthStore` (Zustand) |
| Sidebar open | `useUIStore` (Zustand) |
| Toast messages | `useToast()` context hook |
| Form state | React Hook Form |
| Local UI state | `useState` |

`useAuthStore` mirrors token to `localStorage` (`activehive_token`). Both the store and the Axios interceptor read from localStorage — they are separate concerns and must stay in sync.

## Toast — Three Surfaces (Ambiguous)

There are three toast implementations:
1. `src/providers/toast-context.tsx` + `src/hooks/use-toast.ts` — **canonical**. Use `useToast()` everywhere.
2. `src/components/toast/` — legacy, do not use.
3. `src/components/ui/sonner.tsx` — Sonner wrapper (installed), not wired in providers. Do not use until the team decides.

```typescript
// Standard toast usage
const { showSuccess, showError, showInfo } = useToast();
showSuccess("Title", "Description message");
showError("Title", error.message);
```

## Form Pattern

```typescript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const schema = yup.object({ field: yup.string().required("Required") });
type FormValues = yup.InferType<typeof schema>;

export function MyForm() {
  const form = useForm<FormValues>({ resolver: yupResolver(schema), defaultValues: { field: "" } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="field" render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  );
}
```

Always use Yup (not Zod) for form validation — zod is installed but not used.

## Component Conventions

| Type | Location | Export | Naming |
|------|----------|--------|--------|
| UI primitive | `components/ui/` | Named | `Button`, `Input` |
| Shared molecule | `components/molecules/` | Named | `TableFilterBar` |
| Feature page | `features/[x]/components/[x]-page.tsx` | Named | `GymsPage` |
| Feature table | `features/[x]/components/[x]-table.tsx` | Named | `GymsTable` |
| Feature dialog | `features/[x]/components/[x]-dialog.tsx` | Named | `ConfirmGymStatusDialog` |

File naming: kebab-case. Component naming: PascalCase. No default exports from feature components.

Import alias: `@/` → `src/`. Always use it.

SVG: `import Icon from "@/assets/file.svg?react"` (SVGR via vite-plugin-svgr).

## Page Component Structure

Every dashboard page follows this shell:

```typescript
export function FeaturePage() {
  // 1. Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // 2. Server data
  const { data, isLoading } = useFeatureQuery();

  // 3. Transform + client-side filter
  const rows = useMemo(() => (data ?? []).map(toDisplayRow), [data]);
  const filtered = useMemo(() => rows.filter(/* rowMatchesSearch etc */), [rows, searchQuery, dateFilter]);

  // 4. Layout
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
          {isLoading ? <Skeleton /> : (
            <>
              <SummaryCards />
              <TableFilterBar ... />
              <FeatureTable data={filtered} ... />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## Styling

- TailwindCSS v4 (Vite plugin, no `tailwind.config.js` needed)
- OKLCH color tokens in `index.css` — prefer CSS variables over hardcoded colors
- Dark mode via `.dark` class
- Fonts: Satoshi (body, 5 weights), Bebas Neue (headings)
- Merge classes with `cn()` from `@/lib/utils`
- Component variants with CVA from `class-variance-authority`

## Data Table

`src/components/data-table/data-table.tsx` — TanStack Table wrapper.

```typescript
<DataTable
  data={rows}
  columns={columns}
  isLoading={isLoading}
  searchQuery={searchQuery}
  renderToolbar={() => <TableFilterBar ... />}
  enableDrag={false}
  enableSelection={false}
/>
```

Column definitions live in the feature's `components/` folder as a `columns.tsx` or inline in the table component.

## Known Ambiguities / Things to Flag

- **`zod` installed but unused** — forms use Yup. Clarify with the team before using Zod anywhere.
- **`unknown` types in domain models** — `Gym.operatingHours`, `Gym.amenities`, `Gym.facilities`, `Gym.trainers` are typed `unknown`. Tighten when you touch these fields.
- **`rowMatchesSearch` in `lib/table-filters.ts`** uses `JSON.stringify(row).includes(query)` — matches IDs and timestamps, not just visible fields. Prefer explicit field lists for new features.
- **`AuthResponse` has four possible token shapes** (`token`, `access_token`, `accessToken`, `data.token`). Always use the `resolveSession()` helper in `features/auth/` — never manually pluck the token.
- **`features/dashboard/services/data.json`** — mock data fallback for the dashboard. Not a pattern to replicate elsewhere.
- **`src/components/toast/`** — exists but is legacy. The canonical toast is `useToast()`.

## Auth — Two Sources of Truth

`activehive_token` in `localStorage` is the auth source of truth for the Axios interceptor. `useAuthStore` mirrors it in-memory. They stay in sync **only** if you go through `useAuthStore.setSession()` and `useAuthStore.logout()` — those functions call `persistToken()` which handles localStorage. Never write to `localStorage` for auth directly, never call `useAuthStore.setState()` for auth fields, and never clear the token except via `logout()`. Bypassing these breaks either the interceptor (requests go unauthenticated) or the Zustand store (UI shows wrong auth state).

## Known Pre-existing Issues

- `src/components/ui/button.tsx:75` has a TypeScript error (`disabled` prop type mismatch with Radix Slot). It exists in the committed code. `pnpm tsc -b --noEmit` reports it — don't be alarmed when the end-of-session typecheck surfaces it. Fix only when touching that file.

## What NOT to Do

- Do not add routes by only creating a `page.tsx` — you must also register in `App.tsx`.
- Do not call `.data` on `apiClient` responses — data is already unwrapped.
- Do not use Sonner (`components/ui/sonner.tsx`) or the legacy `components/toast/` — use `useToast()`.
- Do not use Zod for form schemas — use Yup.
- Do not put business logic in `src/app/*/page.tsx` — those files import and render the feature component only.
- Do not use `JSON.stringify` search in new table implementations — use explicit field lists.
- Do not add a test file unless explicitly asked — no test runner is configured.
- Do not use default exports for feature/page components — named exports only.
