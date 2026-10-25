import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../api/chat.api";
import { chatKeys } from "../chat.keys";

export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: getConversations,
  });
}
