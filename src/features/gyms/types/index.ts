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

export type GymLocationAddress = UserAddress;

export type GymLocation = {
  id: string;
  gymId: string;
  locationName: string;
  address: GymLocationAddress | null;
  phone: string | null;
  email: string | null;
  isHeadquarters: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

export type GymSubscription = {
  id: string;
  gymId: string;
  status: string;
  monthlyPrice: string | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  nextPaymentDate: string | null;
  isTrial: boolean;
  autoRenew: boolean;
  [key: string]: unknown;
};

export type GymDetailResponse = {
  gym: Gym;
  locations: GymLocation[];
  staffMembers: unknown[];
  memberships: unknown[];
  subscription: GymSubscription | null;
};

export type GymRegistrationStatusOwner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  status: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
};

export type GymRegistrationStepData = Record<string, unknown>;

export type GymRegistrationStatusRegistration = {
  status: string;
  submittedAt: string | null;
  completedAt: string | null;
  documents: unknown | null;
  currentStep: string | null;
  stepData: GymRegistrationStepData;
  isApproved: boolean;
  subscriptionStatus: {
    hasSubscription: boolean;
    isExpired: boolean;
    status: string;
    trialEndDate: string | null;
    subscriptionEndDate: string | null;
  } | null;
};

export type GymRegistrationStatusStats = {
  totalMembers: number;
  totalTrainers: number;
  totalLocations: number;
  activeMemberships: number;
};

export type GymRegistrationStatusResponse = {
  gym: Gym;
  owner: GymRegistrationStatusOwner;
  registration: GymRegistrationStatusRegistration;
  stats: GymRegistrationStatusStats;
};
