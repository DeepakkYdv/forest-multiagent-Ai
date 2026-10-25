export const getAllMessages = async (conversationId) => {
    const chatServiceUrl = process.env.CHAT_SERVICES;
    if (!chatServiceUrl) {
        throw new Error("CHAT_SERVICES is not configured");
    }
    const data = await axios.get(`${chatServiceUrl}/messages/${conversationId}`,{ headers });
    return data;
}