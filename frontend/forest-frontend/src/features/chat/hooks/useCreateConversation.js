import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation } from "../api/chat.api";
import { chatKeys } from "../chat.keys";

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversation,
    onSuccess: (conversation) => {
      queryClient.setQueryData(chatKeys.conversations(), (conversations = []) => [
        conversation,
        ...conversations.filter(
          (existing) => existing._id !== conversation._id,
        ),
      ]);
    },
  });
}
