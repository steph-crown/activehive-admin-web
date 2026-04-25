---
description: Add a new TanStack Query mutation hook to an existing feature's mutations.ts
allowed-tools: Read, Edit, Write
---

Add a new mutation hook to the feature **$ARGUMENTS**.

Argument format: `feature-name MutationDescription` — e.g. `gyms ApproveGym`

Steps:

1. **Read `src/features/FEATURE/services/mutations.ts`** to see the existing mutation patterns.

2. **Read `src/features/FEATURE/services/api.ts`** — add the API method if it doesn't exist.

3. **Read `src/features/FEATURE/services/queries.ts`** — confirm which query keys to invalidate on success.

4. **Add to `mutations.ts`**:
```typescript
export const useXxxMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PayloadType) => featureApi.xxx(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.list() });
      // also invalidate detail if relevant:
      // queryClient.invalidateQueries({ queryKey: featureQueryKeys.detail(id) });
    },
  });
};
```

5. **Export from `services/index.ts`** if not already there.

Rules:
- Always invalidate at minimum the list query key on mutation success
- Invalidate detail key if the mutation affects a specific entity
- Do not optimistically update unless explicitly requested
- Error handling belongs in the calling component via try/catch around `mutateAsync()`
