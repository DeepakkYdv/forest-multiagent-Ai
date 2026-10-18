import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import { authKeys } from "../auth.keys";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      if (result.user) queryClient.setQueryData(authKeys.currentUser(), result.user);
      else queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
  });
}
