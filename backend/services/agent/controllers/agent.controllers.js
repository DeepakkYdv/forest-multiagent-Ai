import axios from 'axios';
import { graph } from '../graph/graph.js';
import { addMessages } from '../config/memory.js';
export const agent = async (req, res) => {
    try {
        const { conversationId, prompt } = req.body ?? {};
        const userId = req.headers["x-user-id"];
        if (!userId || typeof conversationId !== "string" || !conversationId ||
            typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({ message: "A conversation and prompt are required" });
        }
        addMessages(conversationId, "user", prompt);

        const headers = { "x-user-id": userId };
        const chatServiceUrl = process.env.CHAT_SERVICES;
        if (!chatServiceUrl) {
            throw new Error("CHAT_SERVICES is not configured");
        }

        const { data: userMessage } = await axios.post(`${chatServiceUrl}/save-message`, {
            conversationId, role: "user", content: prompt.trim()
        }, { headers });
        const result = await graph.invoke({
            prompt: prompt.trim(), conversationId
        });
        const response = result.aiResponse;
        if (typeof response !== "string" || !response.trim()) {
            throw new Error("Agent returned an empty response");
        }
        const { data: assistantMessage } = await axios.post(`${chatServiceUrl}/save-message`, {
            conversationId, role: "assistant", content: response
        }, { headers });

        addMessages(conversationId, "assistant", response);
        return res.status(200).json({
            response,
            messages: [userMessage, assistantMessage],
        });
    } catch (error) {
        console.error("Agent chat failed:", error);
        return res.status(500).json({ message: "Unable to process the conversation message" });
    }
}