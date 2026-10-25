export const chatKeys = {
  all: ["chat"],
  conversations: () => [...chatKeys.all, "conversations"],
  messages: (conversationId) => [...chatKeys.all, "messages", conversationId],
};
