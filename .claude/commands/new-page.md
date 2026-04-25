---
description: Add a new route — creates src/app/ wrapper and registers it in App.tsx
allowed-tools: Read, Edit, Write, Bash
---

Add a new page and route for: **$ARGUMENTS**

Parse `$ARGUMENTS` as: `<url-path> <FeatureComponentName>`
Example: `dashboard/reports ReportsPage` → route `/dashboard/reports`, component `ReportsPage`

From the component name, infer the feature folder name (e.g. `ReportsPage` → `reports`).

Steps:

1. **Read `src/App.tsx`** to see the current lazy imports and Route list.

2. **Create `src/app/<url-path>/page.tsx`** as a thin wrapper:
```typescript
import { FeatureComponent } from "@/features/<feature>/components/<feature>-page";

export default function Page() {
  return <FeatureComponent />;
}
```

3. **Edit `src/App.tsx`** — two changes:
   - Add a `const FeatureComponent = lazy(() => import("@/app/<url-path>/page"))` near the other lazy imports, keeping alphabetical grouping
   - Add `<Route path="/<url-path>" element={<FeatureComponent />} />` in the correct position — more-specific paths (e.g. `/dashboard/foo/:id`) must appear before less-specific ones (e.g. `/dashboard/foo`)

4. Print a summary of exactly what was added, including the final Route line.

If the feature component doesn't exist yet, say so and suggest running `/new-feature` first before this command.
