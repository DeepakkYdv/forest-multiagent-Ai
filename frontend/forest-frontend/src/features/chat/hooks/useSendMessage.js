import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../api/chat.api";
import { chatKeys } from "../chat.keys";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: async (result, { conversationId }) => {
      const queryKey = chatKeys.messages(conversationId);
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, (messages = []) => [
        ...messages,
        ...result.messages,
      ]);
      await queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
    },
  });
}
