import { config } from '../../config/index.js'
import { AIProcessingLog } from '../../models/AIProcessingLog.js'

async function callAI(system, userText, maxTokens = 500) {
  let lastError = null

  if (config.geminiApiKey) {
    try {
      const start = Date.now()
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }],
            systemInstruction: { parts: [{ text: system }] },
            generationConfig: { maxOutputTokens: maxTokens, temperature: 0.1 },
          }),
        }
      )

      const duration = Date.now() - start
      const data = await res.json()

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status} ${data.error?.message || JSON.stringify(data)}`)
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const usage = {
        input_tokens: data.usageMetadata?.promptTokenCount || 0,
        output_tokens: data.usageMetadata?.candidatesTokenCount || 0,
      }

      return { text, usage, duration, provider: 'gemini' }
    } catch (err) {
      lastError = err
      console.warn('[AI] Gemini failed, falling back to Groq:', err.message)
    }
  }

  if (config.groqApiKey) {
    try {
      const start = Date.now()
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.groqApiKey}`,
        },
        body: JSON.stringify({
          model: config.groqModel,
          max_tokens: maxTokens,
          temperature: 0.1,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userText },
          ],
        }),
      })

      const duration = Date.now() - start
      const data = await res.json()

      if (!res.ok) {
        throw new Error(`Groq API error: ${res.status} ${data.error?.message || JSON.stringify(data)}`)
      }

      const text = data.choices?.[0]?.message?.content || ''
      const usage = {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      }

      return { text, usage, duration, provider: 'groq' }
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('No AI provider configured (set GEMINI_API_KEY or GROQ_API_KEY)')
}

export async function processIncidentWithAI(normalisedText) {
  const system = `You are a disaster analyst. Extract structured data from these reports.
Return ONLY valid JSON — no prose, no markdown — with these exact keys:
{ "event_type": string, "location_name": string, "severity": int 1-5,
  "summary": string (max 60 words), "confidence": float 0-1 }`

  const result = await callAI(system, normalisedText)
  const parsed = JSON.parse(result.text)

  return {
    event_type: parsed.event_type,
    location_name: parsed.location_name,
    severity: parsed.severity,
    summary: parsed.summary,
    confidence: parsed.confidence,
    usage: result.usage,
    duration: result.duration,
    provider: result.provider,
  }
}

export async function extractLocationFromText(text) {
  const system = `Extract the single most specific geographic location mentioned in this text.
Return ONLY the place name as a plain string — nothing else.`

  const result = await callAI(system, text, 50)
  return result.text.trim()
}

export async function logAIProcessing(incidentId, { prompt_tokens, completion_tokens, duration_ms, success, error, result_summary }) {
  return AIProcessingLog.create({
    incident_id: incidentId,
    prompt_tokens,
    completion_tokens,
    duration_ms,
    success,
    error,
    result_summary,
  })
}
