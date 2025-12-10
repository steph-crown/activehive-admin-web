export enum UserRole {
  GYM_OWNER = "gym_owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export const roleDisplayMap: Record<UserRole, string> = {
  [UserRole.GYM_OWNER]: "Gym Owner",
  [UserRole.ADMIN]: "Admin",
  [UserRole.MEMBER]: "Member",
};
