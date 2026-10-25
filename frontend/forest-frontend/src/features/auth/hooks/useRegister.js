import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../api/auth.api";
import { authKeys } from "../auth.keys";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: (result) => {
      if (result.user) {
        queryClient.setQueryData(authKeys.currentUser(), result.user);
      } else {
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      }
    },
  });
}
