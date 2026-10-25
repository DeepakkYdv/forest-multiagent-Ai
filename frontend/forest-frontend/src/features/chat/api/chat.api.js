import apiClient from "../../../lib/api-client";

export const getConversations = async () => {
  const { data } = await apiClient.get("/chat/conversations");
  return data;
};

export const createConversation = async () => {
  const { data } = await apiClient.post("/chat/create-conversation");
  return data;
};

export const getMessages = async (conversationId) => {
  const { data } = await apiClient.get(
    `/chat/messages/${encodeURIComponent(conversationId)}`,
  );
  return data;
};

export const sendMessage = async ({ conversationId, prompt }) => {
  const { data } = await apiClient.post("/agent/chat", {
    conversationId,
    prompt,
  });
  return data;
};

export const renameConversation = async (id, title) => {
  const { data } = await apiClient.post("/chat/update-conversation", { id, title });
  return data;
};

export const deleteConversation = async (id) => {
  const { data } = await apiClient.delete(`/chat/delete-conversation/${id}`);
  return data;
};
