// setup redis
import redis from "../../../shared/redis/redis.js";
import { getAllMessages } from "../utils/getMessages.js"

export const getMemory = async (conversationId) => {
    const key = `memmory-${conversationId}`
    const cached = await redis.get(key)
    if (cached) {
        return JSON.parse(cached)
    }
    const messages = await getAllMessages(conversationId);
    await redis.set(key, JSON.stringify(messages), 'EX', 24 * 60 * 60)
    return messages;
}

export const addMessages = async (conversationId, role, content) => {
    const key = `memmory-${conversationId}`
    const rawMessages = await redis.get(key)
    const messages = rawMessages ? JSON.parse(rawMessages) : []
    messages.push({ role, content })
    if (messages.length > 20) {
        messages.shift()
    }
    // update in redis
    await redis.set(key, JSON.stringify(messages), 'EX', 24 * 60 * 60)
}