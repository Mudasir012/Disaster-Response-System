import { GoogleGenerativeAI } from '@google/generative-ai'

// Pipeline model — used for raw event classification (high volume)
const pipelineAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
export const pipelineModel = pipelineAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

// Chat model — used for the user-facing AI assistant (low volume)
// Use a separate API key (GEMINI_CHAT_KEY) to avoid the pipeline exhausting chat quota
const chatAI = new GoogleGenerativeAI(process.env.GEMINI_CHAT_KEY || process.env.GEMINI_API_KEY)
export const chatModel = chatAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

// Default export (backwards compat with aiProcessor.js)
export default pipelineModel
