import { isoToDateInput } from "./challenge-form-utils";
import type {
  ApiChallengeWriteBody,
  ChallengeApi,
  CreateChallengePayload,
  PlatformChallenge,
  UpdateChallengePayload,
} from "../types";

function scheduleDurationDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
  const end = new Date(`${endDate}T00:00:00.000Z`).getTime();
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

function scheduleStartToIso(startDate: string): string {
  return new Date(`${startDate}T00:00:00.000Z`).toISOString();
}

function scheduleEndToIso(endDate: string): string {
  return new Date(`${endDate}T23:59:59.999Z`).toISOString();
}

export function toPlatformChallenge(raw: ChallengeApi): PlatformChallenge {
  const startDate = raw.schedule?.startDate ?? "";
  const endDate = raw.schedule?.endDate ?? startDate;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? null,
    type: raw.type,
    status: raw.status,
    startDate,
    endDate,
    durationDays:
      raw.schedule?.durationDays ?? scheduleDurationDays(startDate, endDate),
    startsAt: startDate ? scheduleStartToIso(startDate) : new Date().toISOString(),
    endsAt: endDate ? scheduleEndToIso(endDate) : new Date().toISOString(),
    rewardPoints: raw.rewards?.points ?? 0,
    participantCount: raw.participantCount ?? 0,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

function toApiWriteBody(
  payload: CreateChallengePayload,
  status?: UpdateChallengePayload["status"],
): ApiChallengeWriteBody {
  const startDate = isoToDateInput(payload.startsAt);
  const endDate = isoToDateInput(payload.endsAt);

  return {
    name: payload.name,
    slug: payload.slug,
    type: payload.type,
    description: payload.description ?? "",
    schedule: {
      startDate,
      endDate,
      durationDays: scheduleDurationDays(startDate, endDate),
    },
    rewards: {
      points: payload.rewardPoints,
    },
    metadata: {},
    ...(status ? { status } : {}),
  };
}

export function toApiCreateBody(
  payload: CreateChallengePayload,
): ApiChallengeWriteBody {
  return toApiWriteBody(payload);
}

export function toApiUpdateBody(
  payload: UpdateChallengePayload,
): ApiChallengeWriteBody {
  return toApiWriteBody(payload, payload.status);
}

/** Normalize list items that may arrive flat or partially nested. */
export function normalizeChallengeApi(raw: ChallengeApi): ChallengeApi {
  const schedule = raw.schedule ?? {
    startDate: "",
    endDate: "",
    durationDays: 0,
  };

  return {
    ...raw,
    schedule,
    rewards: raw.rewards ?? { points: 0 },
  };
}