import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js";
import { Responseformate } from "../utils/systemsprompts.js";

export const chatAgent = async (state) => {
    const llm = await getModel('chat')
    const history = await getMemory(state.conversationId)
    const systemPrompt = `You are forest of  ai's and intelligent multi-model ai assistent built by deepak yadav ${Responseformate}`
    const message = [new SystemMessage(systemPrompt)]
    console.log(history)
    for (const msg of history) {
        if (msg.role == "user"){ message.push(new HumanMessage(msg.content))}
        else {message.push(new AIMessage(msg.content))}
    }
    message.push(new HumanMessage(state.prompt))

    const response = await llm.invoke(message)

    return {
        ...state,
        aiResponse: response.content
    }
}