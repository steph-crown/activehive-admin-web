/** Client-side helpers for list pages using TableFilterBar. */

export function rowMatchesSearch(row: unknown, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return JSON.stringify(row).toLowerCase().includes(q);
}

/**
 * When `filterDate` is empty, all rows pass.
 * When the row has no ISO date, the date filter is ignored (row still passes).
 */
export function rowMatchesDateField(
  iso: string | null | undefined,
  filterDate: string,
): boolean {
  if (!filterDate) return true;
  if (!iso) return true;
  try {
    return (
      new Date(iso).toLocaleDateString() ===
      new Date(filterDate).toLocaleDateString()
    );
  } catch {
    return false;
  }
}
