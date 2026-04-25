---
description: Add a new TanStack Query hook to an existing feature's queries.ts
allowed-tools: Read, Edit, Write
---

Add a new query hook to the feature **$ARGUMENTS**.

Argument format: `feature-name QueryDescription` — e.g. `gyms GymsByOwner`

Steps:

1. **Read `src/features/FEATURE/services/queries.ts`** to see the existing queryKeys factory and hook patterns.

2. **Read `src/features/FEATURE/services/api.ts`** to see what API methods exist. If the required API method doesn't exist, add it there first.

3. **Add to `queries.ts`**:
   - Add a new key to the `featureQueryKeys` factory if needed (e.g. `byOwner: (ownerId: string) => [...]`)
   - Add the new `useXxxQuery` hook following the exact pattern of the existing hooks
   - Enable/disable pattern: accept optional `enabled` param if the query depends on an ID

4. **Add to `src/features/FEATURE/services/index.ts`** if the hook isn't already exported.

Standard hook pattern:
```typescript
export const useXxxQuery = (param: string | undefined, enabled = true) =>
  useQuery<ReturnType>({
    queryKey: featureQueryKeys.xxx(param ?? ""),
    queryFn: () => featureApi.getXxx(param!),
    enabled: Boolean(param) && enabled,
  });
```

Do not invent a new query key shape — extend the existing factory object.
