import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";
import type { Profile } from "../types";

export const profileQueryKeys = {
  all: ["profile"] as const,
};

export const useProfileQuery = (enabled = true) =>
  useQuery<Profile>({
    queryKey: profileQueryKeys.all,
    queryFn: () => profileApi.getProfile(),
    enabled,
  });
