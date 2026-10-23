import { getModel } from "../config/llmModels"

export const router = async (state) => {
    const llm = getModel(agent)
    //prompt for agent router 
    const prompt = `
    You are an agent router.
    Available agents:
    - chat
    - search 
    - pdf
    - ppt
    - vision

    Rules:

    chat:
    General conversation,explanation, learning, questions.

    search:
    Current events, latest information, news, recent development, internet surfing.

    coding:
    Generate code, debug code, build projects, architecture, api design.

    pdf:
    Question about generate PDFs or documents ppt context

    pdf:
    Question about generate ppts or documents ppt context.

    vision:
    Generate image, create image

    return only one word:
    chat
    search
    coding
    pdf
    ppt
    vision

    User Query:
    ${state.prompt}
    `
    // invoked llm
    const response = await llm.invoke(prompt)
    return {
        ...state,
        agent: response.content.trim().toLowerCase()
    }

} 
