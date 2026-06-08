import Groq from 'groq-sdk'

export const pipelineClient = new Groq({ apiKey: process.env.GROQ_API_KEY })
export const chatClient = new Groq({ apiKey: process.env.GROQ_CHAT_KEY || process.env.GROQ_API_KEY })

export const PIPELINE_MODEL = 'llama-3.3-70b-versatile'
export const CHAT_MODEL = 'llama-3.3-70b-versatile'
