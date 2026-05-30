export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateChallengeSlug(name: string): string {
  const base = slugifyName(name) || "challenge";
  return `${base}-${Date.now()}`;
}

/** Local `YYYY-MM-DD` for comparing against `<input type="date" />` values. */
export function todayDateInput(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isFutureDateInput(date: string): boolean {
  return date > todayDateInput();
}

/** Local calendar date (`YYYY-MM-DD`) for a challenge start ISO timestamp. */
export function challengeStartDateInput(startsAt: string): string {
  const d = new Date(startsAt);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Editable only while the start date is strictly in the future (not today). */
export function canEditChallenge(startsAt: string): boolean {
  return isFutureDateInput(challengeStartDateInput(startsAt));
}

export function minFutureDateInput(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function minEndDateInput(startsAt: string): string {
  const baseline = minFutureDateInput();
  if (!startsAt) return baseline;

  const d = new Date(`${startsAt}T12:00:00`);
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const dayAfterStart = `${year}-${month}-${day}`;

  return dayAfterStart > baseline ? dayAfterStart : baseline;
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
