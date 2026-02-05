import type { UserAddress } from "@/features/users/types";

export type ProfileOwnedGym = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  address: UserAddress | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

export type Profile = {
  id: string;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  profileImage: string | null;
  role: string;
  status: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  gym: unknown | null;
  ownedGyms: ProfileOwnedGym[];
  trainerGyms: unknown[];
  memberships: unknown[];
  fitnessGoals: unknown[];
  [key: string]: unknown;
};
