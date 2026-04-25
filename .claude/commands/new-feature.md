---
description: Scaffold a complete feature module under src/features/ for a new domain
allowed-tools: Read, Edit, Write, Bash
---

Scaffold a new feature module for: **$ARGUMENTS**

The feature name `$ARGUMENTS` is in kebab-case (e.g. `gym-classes`). Derive from it:
- PascalCase for types and component names (e.g. `GymClass`, `GymClassesPage`)
- camelCase for object/function names (e.g. `gymClassesApi`, `useGymClassesQuery`)
- The URL segment is the same as `$ARGUMENTS` (e.g. `/dashboard/gym-classes`)

Read `src/features/gyms/` first to confirm the exact file patterns haven't drifted, then create:

**`src/features/$ARGUMENTS/types/index.ts`**
- Primary entity type with `id: string`, dates, and relevant fields
- A list-row display type for table rendering (flattened/stringified version of the entity)

**`src/features/$ARGUMENTS/services/api.ts`**
```typescript
import { apiClient } from "@/lib/api-client";
import type { PrimaryType } from "../types";

const basePath = "/api/admin/$ARGUMENTS";

export const featureApi = {
  getAll: (): Promise<PrimaryType[]> => apiClient.get(basePath),
  getById: (id: string): Promise<PrimaryType> => apiClient.get(`${basePath}/${id}`),
  create: (data: unknown): Promise<PrimaryType> => apiClient.post(basePath, data),
  update: (id: string, data: unknown): Promise<PrimaryType> => apiClient.patch(`${basePath}/${id}`, data),
  delete: (id: string): Promise<void> => apiClient.delete(`${basePath}/${id}`),
};
```

**`src/features/$ARGUMENTS/services/queries.ts`**
- `featureQueryKeys` factory with `all`, `list()`, `detail(id: string)` keys
- `useFeatureListQuery()` hook
- `useFeatureByIdQuery(id, enabled?)` hook

**`src/features/$ARGUMENTS/services/mutations.ts`**
- `useCreateFeatureMutation()` — POST + invalidate list on success
- `useUpdateFeatureMutation()` — PATCH + invalidate list + detail on success
- `useDeleteFeatureMutation()` — DELETE + invalidate list on success

**`src/features/$ARGUMENTS/services/index.ts`**
- Re-export everything from api, queries, mutations

**`src/features/$ARGUMENTS/components/$ARGUMENTS-page.tsx`**
- Named export for the page component
- Full dashboard layout: SidebarProvider + AppSidebar + SidebarInset + SiteHeader
- Filter state (searchQuery, dateFilter with useState)
- useQuery hook + useMemo for data transform + useMemo for client-side filtering via rowMatchesSearch and rowMatchesDateField
- Skeleton while loading, error state, then filters + table

**`src/features/$ARGUMENTS/components/$ARGUMENTS-table.tsx`**
- Named export for the table component
- Uses DataTable from `@/components/data-table/data-table`
- Inline ColumnDef array with appropriate columns

After creating all files, print this checklist for manual steps:
```
Manual steps required:
[ ] Create src/app/dashboard/$ARGUMENTS/page.tsx  (thin wrapper importing the page component)
[ ] Add const X = lazy(() => import("@/app/dashboard/$ARGUMENTS/page")) to src/App.tsx
[ ] Add <Route path="/dashboard/$ARGUMENTS" element={<X />} /> to the Routes in src/App.tsx
[ ] Add sidebar nav entry in src/features/dashboard/components/nav-main.tsx
```
