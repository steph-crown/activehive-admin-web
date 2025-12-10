import type { UserAddress } from "@/features/users/types";

export type GymAddress = UserAddress;

export type GymOwner = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  [key: string]: unknown;
};

export type Gym = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  address: GymAddress | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  operatingHours: unknown | null;
  amenities: unknown | null;
  facilities: unknown | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: GymOwner | null;
  trainers: unknown[];
};
