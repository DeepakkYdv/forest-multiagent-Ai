import { getModel } from "../config/llmModels"

export const chatAgent = async (state) => {
    const llm = await getModel('chat')
    const systemPrompt = `You are context ai and intelligent ai assistent`
    const response = await llm.invoke([
        {
            "role": "system",
            "content": systemPrompt
        },
        {
            "role": "human",
            "contnet": state.prompt
        }
    ])

    return {
        ...state,
        aiResponse: response.content
    }
}