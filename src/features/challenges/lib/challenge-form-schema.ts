import * as yup from "yup";

import { isFutureDateInput } from "./challenge-form-utils";
import type { ChallengeStatus, ChallengeType } from "../types";

export const CHALLENGE_TYPES: ChallengeType[] = [
  "fitness",
  "weight_loss",
  "attendance",
  "steps",
  "custom",
];

export const CHALLENGE_STATUSES: ChallengeStatus[] = [
  "draft",
  "active",
  "completed",
  "cancelled",
  "archived",
];

export const challengeStatusLabel: Record<ChallengeStatus, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
  archived: "Archived",
};

const dateFields = {
  startsAt: yup
    .string()
    .required("Start date is required")
    .test("future", "Start date must be in the future", (value) =>
      value ? isFutureDateInput(value) : false,
    ),
  endsAt: yup
    .string()
    .required("End date is required")
    .test("future", "End date must be in the future", (value) =>
      value ? isFutureDateInput(value) : false,
    )
    .test(
      "after-start",
      "End date must be after start date",
      function (endsAt) {
        const { startsAt } = this.parent as { startsAt?: string };
        if (!startsAt || !endsAt) return true;
        return endsAt > startsAt;
      },
    ),
};

const sharedFields = {
  name: yup.string().required("Name is required"),
  description: yup.string().nullable(),
  type: yup
    .mixed<ChallengeType>()
    .oneOf(CHALLENGE_TYPES)
    .required("Type is required"),
  ...dateFields,
  rewardPoints: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Reward must be a number")
    .required("Reward is required")
    .min(0, "Reward cannot be negative"),
};

export const createChallengeFormSchema = yup.object(sharedFields);

export const editChallengeFormSchema = yup.object({
  ...sharedFields,
  status: yup
    .mixed<ChallengeStatus>()
    .oneOf(CHALLENGE_STATUSES)
    .required("Status is required"),
});

export type ChallengeFormValues = {
  name: string;
  description: string | null | undefined;
  type: ChallengeType;
  startsAt: string;
  endsAt: string;
  rewardPoints: number | "";
  status?: ChallengeStatus;
};

export const emptyChallengeFormValues: ChallengeFormValues = {
  name: "",
  description: "",
  type: "fitness",
  startsAt: "",
  endsAt: "",
  rewardPoints: "",
};
