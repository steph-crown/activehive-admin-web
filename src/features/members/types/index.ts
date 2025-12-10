import type { User } from "@/features/users/types";

export type Member = Omit<User, "ownedGyms" | "trainerGyms"> & {
  memberships: unknown[];
};
