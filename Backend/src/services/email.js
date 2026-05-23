import { config } from '../config/index.js'

export async function sendAlertEmail({ to, subject, text, html }) {
  if (!config.resendApiKey) {
    console.log('[Email] No Resend API key, skipping:', subject, to)
    return
  }

  const res = await fetch(config.resendApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.emailFromAddress,
      to,
      subject,
      text,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[Email] Failed to send:', err)
  }
}
