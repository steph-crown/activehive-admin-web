import type { AuthUser } from "@/store/auth.store";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupPayload = AuthCredentials & {
  firstName: string;
  lastName: string;
};

export type OtpPayload = {
  code: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
