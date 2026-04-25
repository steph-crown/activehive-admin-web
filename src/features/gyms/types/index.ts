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

export type GymTrainer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  status: string;
  profileImage: string | null;
  specialties: string[] | null;
  bio: string | null;
  onboardingCompleted: boolean;
};

export type GymMembershipMember = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  [key: string]: unknown;
};

export type GymMembership = {
  id: string;
  memberId: string;
  gymId: string;
  type: string;
  status: string;
  price: string | null;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  member: GymMembershipMember | null;
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
  socialLinks?: {
    instagram?: string | null;
    facebook?: string | null;
    twitterX?: string | null;
  } | null;
  operatingHours: unknown | null;
  amenities: unknown | null;
  facilities: unknown | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: GymOwner | null;
  trainers: GymTrainer[];
  approvalStatus?: "pending" | "approved" | "rejected" | null;
  /** When provided by the API; otherwise the list view uses placeholders. */
  memberCount?: number | null;
  activeMemberCount?: number | null;
  subscriptionPlanName?: string | null;
  revenue?: string | null;
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
  memberships: GymMembership[];
  subscription: GymSubscription | null;
  memberCount?: number;
  activeMemberCount?: number;
  revenue?: string;
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
  documents: {
    rcNumber?: string | null;
    companyRegNo?: string | null;
    addressProof?: string | null;
    governmentIdType?: string | null;
    governmentId?: string | null;
    rcValidation?: {
      verified?: boolean;
      proofUrl?: string | null;
    } | null;
    addressProofDate?: string | null;
    additionalDocuments?: string[] | null;
    [key: string]: unknown;
  } | null;
  currentStep: string | null;
  stepData: GymRegistrationStepData;
  isApproved: boolean;
  approvalDetails?: {
    reviewedBy?: string | null;
    reviewedAt?: string | null;
  } | null;
  rejectionReason?: string | null;
  adminComments?: string | null;
  canResubmit?: boolean;
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
  totalClasses?: number;
  checkInsToday?: number;
};

export type GymRegistrationStatusResponse = {
  gym: Gym;
  owner: GymRegistrationStatusOwner;
  registration: GymRegistrationStatusRegistration;
  stats: GymRegistrationStatusStats;
};
