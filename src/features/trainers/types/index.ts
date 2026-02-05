import type { User, UserAddress } from "@/features/users/types";

export type Trainer = User;

export type TrainerGym = {
  id: string;
  name: string;
  address?: UserAddress | null;
  phoneNumber?: string | null;
  email?: string | null;
  [key: string]: unknown;
};
