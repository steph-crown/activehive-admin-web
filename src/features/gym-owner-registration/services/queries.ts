import { useQuery } from "@tanstack/react-query";
import { gymOwnerRegistrationApi } from "./api";

export const gymOwnerRegistrationQueryKeys = {
  all: ["gym-owner-registration"] as const,
  sessionStatus: (sessionId: string) =>
    [...gymOwnerRegistrationQueryKeys.all, "session-status", sessionId] as const,
  applicationStatus: (sessionId: string) =>
    [...gymOwnerRegistrationQueryKeys.all, "application-status", sessionId] as const,
};

export const useSessionStatusQuery = (sessionId: string | null) =>
  useQuery({
    queryKey: sessionId
      ? gymOwnerRegistrationQueryKeys.sessionStatus(sessionId)
      : ["gym-owner-registration", "session-status", "empty"],
    queryFn: () =>
      sessionId
        ? gymOwnerRegistrationApi.getSessionStatus(sessionId)
        : Promise.resolve(null),
    enabled: Boolean(sessionId),
  });

export const useApplicationStatusQuery = (sessionId: string | null) =>
  useQuery({
    queryKey: sessionId
      ? gymOwnerRegistrationQueryKeys.applicationStatus(sessionId)
      : ["gym-owner-registration", "application-status", "empty"],
    queryFn: () =>
      sessionId
        ? gymOwnerRegistrationApi.getApplicationStatus(sessionId)
        : Promise.resolve(null),
    enabled: Boolean(sessionId),
  });
