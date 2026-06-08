import { pipelineClient, PIPELINE_MODEL } from '../config/groq.js'
import { AILog } from '../models/AILog.js'
import normalize from './normalizer.js'

export default async function processWithAI(normalisedEvent) {
  const systemInstruction = `You are a disaster classification analyst. Given text about a potential disaster event,
extract structured data. Return ONLY valid JSON with no markdown, no code fences,
no preamble. Use exactly these keys:
{
  "event_type": one of ["earthquake","flood","wildfire","cyclone","tsunami","severe_weather","unknown"],
  "location_name": "most specific place name mentioned, or null",
  "severity": integer 1-5 based on: 1=minor/no injuries, 2=property damage, 3=significant damage/possible fatalities, 4=major disaster/confirmed deaths, 5=catastrophic/mass casualties,
  "summary": "plain English summary max 60 words",
  "ai_confidence": float 0.0-1.0 representing your confidence in this classification
}`

  const start = Date.now()

  const attempt = async (prompt, retry = false) => {
    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: retry ? `${prompt}\n\nYou must return only a JSON object, nothing else.` : prompt },
    ]
    const completion = await pipelineClient.chat.completions.create({
      model: PIPELINE_MODEL,
      messages,
    })
    return completion.choices[0]?.message?.content || ''
  }

  let parsed
  let success = false
  let error = null
  let textResult = ''

  try {
    textResult = await attempt(normalisedEvent.raw_text)
    parsed = JSON.parse(textResult)
    success = true
  } catch (err) {
    error = err.message
    try {
      textResult = await attempt(normalisedEvent.raw_text, true)
      parsed = JSON.parse(textResult)
      success = true
      error = null
    } catch (err2) {
      error = err2.message
      parsed = {
        event_type: 'unknown',
        location_name: null,
        severity: 1,
        summary: (normalisedEvent.raw_text || '').slice(0, 100),
        ai_confidence: 0.1,
      }
    }
  }

  const duration = Date.now() - start

  await AILog.create({
    prompt_tokens: 0,
    completion_tokens: 0,
    duration_ms: duration,
    success,
    error,
    result_summary: `SEV-${parsed.severity} ${parsed.event_type}, ${parsed.location_name || 'unknown'}`,
  })

  return {
    event_type: parsed.event_type,
    location_name: parsed.location_name,
    severity: parsed.severity,
    summary: parsed.summary,
    ai_confidence: parsed.ai_confidence,
    duration,
  }
}
