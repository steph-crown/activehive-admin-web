export const UserRole = {
  GYM_OWNER: "gym_owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const roleDisplayMap: Record<UserRole, string> = {
  [UserRole.GYM_OWNER]: "Gym Owner",
  [UserRole.ADMIN]: "Admin",
  [UserRole.MEMBER]: "Member",
};
