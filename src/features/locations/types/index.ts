import type { GymAddress } from "@/features/gyms/types";

export type LocationAddress = GymAddress;

export type LocationGym = {
  id: string;
  name: string;
  [key: string]: unknown;
};

export type Location = {
  id: string;
  gymId: string;
  locationName: string;
  address: LocationAddress | null;
  phone: string | null;
  email: string | null;
  images: unknown | null;
  paymentAccount: unknown | null;
  isHeadquarters: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  gym: LocationGym | null;
  staff: unknown[];
};
