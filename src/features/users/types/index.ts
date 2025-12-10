export * from "./role";

export type UserAddress = {
  city: string;
  state: string;
  street: string;
  country: string;
  zipCode: string;
};

export type OwnedGym = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  address: UserAddress | null;
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
};

export type User = {
  id: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  profileImage: string | null;
  role: string;
  status: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  passwordSetupToken: string | null;
  passwordSetupExpires: string | null;
  gymId: string | null;
  specialization: string | null;
  bio: string | null;
  address: unknown | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  ownedGyms: OwnedGym[];
  gym: unknown | null;
  trainerGyms: unknown[];
};
