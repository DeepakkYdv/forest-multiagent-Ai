import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";
import { authKeys } from "../auth.keys";

export function useCurrentUser(options = {}) {
  return useQuery({ queryKey: authKeys.currentUser(), queryFn: getCurrentUser, ...options });
}
