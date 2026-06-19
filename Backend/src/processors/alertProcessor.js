import { Resend } from 'resend'
import { AlertSubscription } from '../models/AlertSubscription.js'
import GUIDANCE from '../utils/safetyGuidance.js'

const resend = new Resend(process.env.RESEND_API_KEY)

function buildSafetyHtml(eventType) {
  const guidance = GUIDANCE[eventType]
  if (!guidance) return ''

  function listItems(items, icon) {
    return items.map((item) => `<tr><td style="padding:4px 0;font-size:13px;line-height:1.5;color:#cbd5e1;vertical-align:top;width:20px">${icon}</td><td style="padding:4px 0;font-size:13px;line-height:1.5;color:#cbd5e1">${item}</td></tr>`).join('')
  }

  return `
    <div style="margin:20px 0;padding:20px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.06)">
      <h2 style="font-size:15px;font-weight:700;margin:0 0 12px;color:#f1f5f9">${guidance.title} — What To Do</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td colspan="2" style="padding:0 0 4px;font-size:12px;font-weight:600;color:#22c55e">✓ DO</td></tr>
        ${listItems(guidance.do, '✓')}
        <tr><td colspan="2" style="padding:12px 0 4px;font-size:12px;font-weight:600;color:#ef4444">✗ DON'T</td></tr>
        ${listItems(guidance.dont, '✗')}
        <tr><td colspan="2" style="padding:12px 0 4px;font-size:12px;font-weight:600;color:#0f7ddb">◆ PREPARE</td></tr>
        ${listItems(guidance.prepare, '◆')}
      </table>
    </div>`
}

export default async function processAlertJob(job) {
  const { incident, subscription_email, rule } = job.data

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const subject = `[SEV-${incident.severity}] ${incident.event_type.toUpperCase()} — ${incident.location.name}`

  const sub = await AlertSubscription.findOne({ email: subscription_email })
  const unsubscribeUrl = sub ? `${frontendUrl}/alerts/manage?token=${sub.token}` : '#'

  const severityColors = { 1: '#64748b', 2: '#0f7ddb', 3: '#d97706', 4: '#e94560', 5: '#dc2626' }
  const color = severityColors[incident.severity] || '#64748b'
  const safetyHtml = buildSafetyHtml(incident.event_type)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a061e; color: #e2e8f0; padding: 24px; }
    .container { max-width: 560px; margin: 0 auto; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; color: white; background: ${color}; }
    h1 { font-size: 20px; margin: 16px 0 8px; }
    .meta { color: #94a3b8; font-size: 14px; }
    .summary { margin: 16px 0; padding: 16px; background: rgba(255,255,255,0.04); border-radius: 8px; line-height: 1.6; }
    .btn { display: inline-block; padding: 10px 20px; background: ${color}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 12px; }
    .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">SEVERITY ${incident.severity}</span>
    <h1>${incident.event_type.toUpperCase()} — ${incident.location.name}</h1>
    <div class="meta">
      ${incident.location.continent || ''} &middot; ${new Date(incident.first_seen).toLocaleString()}
    </div>
    <div class="summary">${incident.summary || 'No summary available.'}</div>
    ${safetyHtml}
    <a href="${frontendUrl}/incidents/${incident._id}" class="btn">View on Map</a>
    <div class="footer">
      <p>You received this alert because your subscription matches this event.</p>
      <p><a href="${unsubscribeUrl}" style="color: #e94560;">Unsubscribe or manage alerts</a></p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: process.env.EMAIL_FROM_ADDRESS || 'Sentinel <alerts@sentinel.app>',
    to: subscription_email,
    subject,
    html,
  })

  await AlertSubscription.updateOne(
    { email: subscription_email },
    { last_alert: new Date() }
  )
}
