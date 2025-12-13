import type { User } from "@/features/users/types";

export type Admin = User;

export type CreateAdminPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  secretKey: string;
};
