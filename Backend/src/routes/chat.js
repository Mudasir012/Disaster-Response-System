import { Router } from 'express'
import { chatClient, CHAT_MODEL } from '../config/groq.js'
import { Incident } from '../models/Incident.js'
import { aiRateLimiter } from '../middleware/rateLimiter.js'
import logger from '../utils/logger.js'


const router = Router()

router.post('/', aiRateLimiter, async (req, res, next) => {
  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Fetch active/monitoring incidents from DB as context
    const recentIncidents = await Incident.find({
      status: { $in: ['active', 'monitoring'] },
    })
      .sort({ severity: -1, created_at: -1 })
      .limit(15)
      .lean()

    const contextStr = recentIncidents.map(inc => (
      `- [Severity ${inc.severity}] ${inc.event_type.toUpperCase()} in ${inc.location?.name || inc.location?.country || 'Unknown'}. Summary: ${inc.summary}. Status: ${inc.status}.`
    )).join('\n')

    const systemInstruction = `You are a disaster response AI assistant. Answer user queries about disasters, emergencies, and safety procedures using active context where relevant.
Current active incidents context:
${contextStr || 'No active incidents currently reported.'}

You must return your response as a valid JSON object. Do not include any markdown styling, no backticks, no code block markers (like \`\`\`json), and no preamble.
Use exactly this JSON schema:
{
  "severity": "e.g., Critical, Severe, Moderate, Info, or Multiple Events",
  "summary": "Plain English markdown-formatted answer summary",
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "badge": "color hex code (e.g., #e94560 for Critical, #d97706 for Severe, #0d9488 for Tsunami/Special, #0f7ddb for Moderate/Info, #7c3aed for Multiple)"
}
`

    const prompt = `User Query: "${message}"\n\nReturn JSON response:`

    const completion = await chatClient.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ],
    })

    let text = (completion.choices[0]?.message?.content || '').trim()

    // Clean markdown code blocks if the model wrapped them
    if (text.startsWith('```')) {
      text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim()
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (err) {
      logger.error('Failed to parse Groq chat response as JSON. Raw text: ' + text)
      // Fallback response format if JSON parsing failed
      parsed = {
        severity: 'Information',
        summary: text,
        steps: [
          'Monitor local authorities for real-time alerts.',
          'Secure your shelter and check emergency kits.',
          'Avoid travelling near impacted zones.',
        ],
        badge: '#0f7ddb',
      }
    }

    res.json(parsed)
  } catch (err) {
    logger.error('Chat error: ' + err.message)
    next(err)
  }
})

export default router
