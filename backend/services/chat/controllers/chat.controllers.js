import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("User ID from header:", userId);
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the header" });
        }
        const conversation = await Conversation.create({ userId });
        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Error creating conversation", error });
    }
}

export const updateConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the header" });
        }
        const { id, title } = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id, { title });
        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Error updating conversation", error });
    }
}

export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the header" });
        }
        const conversation = await Conversation.find({ userId }).sort({
            updatedAt: -1
        });
        res.status(200).json(conversation);
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "Error getting conversation", error });
    }
}

export const saveMessage = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the header" });
        }
        const { content, role, conversationId } = req.body;
        if (!conversationId) {
            return res.status(400).json({ message: "conversationId required" })
        }
        const message = await Message.create({ content, role, conversationId });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Error saving message", error });
    }
}

export const getMessages = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the header" });
        }
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({
            createdAt: 1
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error getting messages", error });
    }
}

export const delMessage = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the header" });
        }
        const { messageId } = req.params;
        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting message", error });
    }
}

export const delConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the header" });
        }
        const { conversationId } = req.params;
        await Conversation.findByIdAndDelete(conversationId);
        res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting conversation", error });
    }
}
