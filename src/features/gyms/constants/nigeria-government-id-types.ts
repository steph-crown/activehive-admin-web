export type GovernmentIdTypeOption = {
  readonly value: string;
  readonly label: string;
};

// Keep `label` user-facing and `value` backend-facing.
export const NIGERIA_GOVERNMENT_ID_TYPES: GovernmentIdTypeOption[] = [
  { value: "PASSPORT", label: "Passport" },
  { value: "DRIVERS_LICENSE", label: "Driver's License" },
  { value: "NIN", label: "National Identification Number (NIN)" },
  { value: "VOTERS_CARD", label: "Voter's Card" },
  { value: "BVN", label: "Bank Verification Number (BVN)" },
  { value: "RESIDENCE_PERMIT", label: "Residence Permit" },
];

export const GOVERNMENT_ID_TYPE_LABEL_BY_VALUE = NIGERIA_GOVERNMENT_ID_TYPES.reduce(
  (acc, item) => {
    acc[item.value] = item.label;
    return acc;
  },
  {} as Record<string, string>,
);

export const getGovernmentIdTypeLabel = (
  value: string | null | undefined,
) => {
  if (!value) return null;
  return GOVERNMENT_ID_TYPE_LABEL_BY_VALUE[value] ?? value;
};

