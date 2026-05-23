import { config } from '../../config/index.js'
import { AIProcessingLog } from '../../models/AIProcessingLog.js'

async function callClaude(system, userText, maxTokens = 500) {
  if (!config.anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const start = Date.now()
  const res = await fetch(config.anthropicUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.claudeModel,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userText }],
    }),
  })

  const duration = Date.now() - start
  const data = await res.json()

  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${data.error?.message || JSON.stringify(data)}`)
  }

  return { text: data.content[0].text, usage: data.usage, duration }
}

export async function processIncidentWithAI(normalisedText) {
  const system = `You are a disaster analyst. Extract structured data from these reports.
Return ONLY valid JSON — no prose, no markdown — with these exact keys:
{ "event_type": string, "location_name": string, "severity": int 1-5,
  "summary": string (max 60 words), "confidence": float 0-1 }`

  const result = await callClaude(system, normalisedText)
  const parsed = JSON.parse(result.text)

  return {
    event_type: parsed.event_type,
    location_name: parsed.location_name,
    severity: parsed.severity,
    summary: parsed.summary,
    confidence: parsed.confidence,
    usage: result.usage,
    duration: result.duration,
  }
}

export async function extractLocationFromText(text) {
  const system = `Extract the single most specific geographic location mentioned in this text.
Return ONLY the place name as a plain string — nothing else.`

  const result = await callClaude(system, text, 50)
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
