---
description: Create a new custom hook in src/hooks/
allowed-tools: Read, Edit, Write, Bash
---

Create a new custom hook named **$ARGUMENTS**.

Steps:

1. **Read `src/hooks/`** to check existing hooks and avoid duplication.

2. **Create `src/hooks/use-$ARGUMENTS_kebab.ts`**:
   - Name follows `use-` prefix + kebab-case (e.g. `use-pagination.ts`)
   - Named export: `export function usePagination(...) { ... }`
   - TypeScript: define a return type interface
   - No default exports

3. Standard hook structure:
```typescript
import { useState, useCallback } from "react";

type UseXxxOptions = {
  // input config
};

type UseXxxResult = {
  // return shape
};

export function useXxx(options: UseXxxOptions = {}): UseXxxResult {
  // implementation
}
```

Rules:
- Hooks that consume context must throw with a helpful message if used outside their provider
- Hooks depending on external data (API) should use TanStack Query, not raw useEffect + fetch
- Do not create a hook for logic that belongs in a component's local useState
- File in `src/hooks/` only for hooks reused across ≥2 features; otherwise colocate in the feature

After creating, read the file back and check for TypeScript issues.
