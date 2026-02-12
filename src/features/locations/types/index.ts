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

export type LocationDetailGymOwner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
};

export type LocationDetailGym = {
  id: string;
  name: string;
  isActive: boolean;
  owner: LocationDetailGymOwner;
};

export type LocationDetail = {
  id: string;
  locationName: string;
  address: LocationAddress | null;
  phone: string | null;
  email: string | null;
  images: unknown | null;
  isHeadquarters: boolean;
  isActive: boolean;
  gym: LocationDetailGym | null;
  createdAt: string;
  updatedAt: string;
};
