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
  bio?: string | null;
  specialization?: string | null;
  address?: ProfileAddress | null;
  [key: string]: unknown;
};

export type ProfileAddress = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  specialization?: string;
  address?: ProfileAddress;
  profileImage?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
