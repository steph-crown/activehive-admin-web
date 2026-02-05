import type { User, UserAddress } from "@/features/users/types";

export type Staff = User;

export type StaffGym = {
  id: string;
  name: string;
  address?: UserAddress | null;
  phoneNumber?: string | null;
  email?: string | null;
  [key: string]: unknown;
};
