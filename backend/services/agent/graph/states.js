import { Annotation } from "@langchain/langgraph";
export const agentStates = Annotation.Root({
    prompt: Annotation(),
    aiResponse: Annotation(),
    agent: Annotation(),
    conversationId: Annotation()
})