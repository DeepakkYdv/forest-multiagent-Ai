import { StateGraph } from "@langchain/langgraph";
import { agentStates } from "./states.js";
import { router } from "./router.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { chatAgent } from "../agents/chat.agents.js";
import { pptAgent } from "../agents/ppt.agents.js";
import { searchAgent } from "../agents/search.agents.js";
import { codingAgent } from "../agents/coding.agents.js";
import { imageGenAgent } from "../agents/imageGen.agent.js";

const workflow = new StateGraph(agentStates)

// add nodes to the workflow
workflow.addNode("router", router)
workflow.addNode("chat", chatAgent)
workflow.addNode("pdf", pdfAgent)
workflow.addNode("ppt", pptAgent)
workflow.addNode("search", searchAgent)
workflow.addNode("coding", codingAgent)
workflow.addNode("vision", imageGenAgent)

//  add edges to the workflow
workflow.addEdge("__start__", "router")
workflow.addConditionalEdges("router", (state) => {
    switch (state.agent) {
        case "chat":
            return "chat";
        case "pdf":
            return "pdf";
        case "ppt":
            return "ppt";
        case "search":
            return "search";
        case "coding":
            return "coding";
        case "vision":
            return "vision";
        default:
            return "chat";
        // throw new Error(`Unknown agent: ${state.agent}`)
    }
}, {
    chat: "chat",
    pdf: "pdf",
    ppt: "ppt",
    search: "search",
    coding: "coding",
    vision: "vision",
})

// edges
workflow.addEdge("search", "chat")
workflow.addEdge("chat", "__end__")
workflow.addEdge("pdf", "__end__")
workflow.addEdge("ppt", "__end__")
workflow.addEdge("coding", "__end__")
workflow.addEdge("vision", "__end__")

// compilation
const graph = workflow.compile()

export { graph }