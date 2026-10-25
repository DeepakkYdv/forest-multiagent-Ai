import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../api/chat.api";
import { chatKeys } from "../chat.keys";

export function useMessages(conversationId) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: Boolean(conversationId),
  });
}
