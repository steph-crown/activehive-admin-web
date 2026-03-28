export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function dateInputToRangeIso(startsAt: string, endsAt: string): {
  startsAt: string;
  endsAt: string;
} {
  return {
    startsAt: new Date(`${startsAt}T00:00:00.000Z`).toISOString(),
    endsAt: new Date(`${endsAt}T23:59:59.999Z`).toISOString(),
  };
}

/** `YYYY-MM-DD` for `<input type="date" />` from an ISO timestamp. */
export function isoToDateInput(iso: string): string {
  return iso.slice(0, 10);
}
