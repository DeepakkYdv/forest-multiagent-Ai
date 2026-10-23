import axios from 'axios';
import { graph } from '../graph/graph';
export const agent = async (req, res) => {
    try {
        const { conversationId, prompt } = req.body
        axios.post(`${process.env.CHAT_SERVICES}/save-message`, {
            conversationId, role: "user", content: prompt
        })//saving the prompt to chat services

        const result = await graph.invoke({
            prompt, conversationId
        })
        const response = result.aiResponse
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: `agent error ${error}` })
    }
}