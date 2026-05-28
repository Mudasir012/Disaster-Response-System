const now = Date.now()
const MIN = 60000

let nextId = 1
function notif(type, message, timeAgo, read = false) {
  return { id: `N-${nextId++}`, type, message, timestamp: now - timeAgo, read }
}

const notifications = [
  notif('critical', 'Critical earthquake detected near Tokyo. Magnitude 7.8. Immediate response advised.', 2 * MIN),
  notif('warning', 'Hurricane path updated. Projected to make landfall near Miami within 48 hours.', 15 * MIN),
  notif('info', 'New incident report: Wildfire in Santa Monica Mountains, 12,000 acres burning.', 35 * MIN),
  notif('warning', 'Tsunami advisory issued for Bali coast following 6.9 magnitude offshore earthquake.', 75 * MIN),
  notif('info', 'Severity upgraded for Karachi flood event. Casualties now reported at 45.', 120 * MIN, true),
  notif('info', 'Monitored region alert: Moderate earthquake near Thebes, Greece. Magnitude 6.4.', 240 * MIN, true),
  notif('critical', 'Critical: Category 4 hurricane approaching Florida coast. Evacuation orders issued.', 320 * MIN, true),
  notif('info', 'New monitoring region added: Central America corridor.', 400 * MIN, true),
]

const STYLES = {
  critical: { dot: '#e94560', bg: 'rgba(233,69,96,0.08)' },
  warning: { dot: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  info: { dot: '#0f7ddb', bg: 'rgba(15,125,219,0.08)' },
}

export { notifications, STYLES }
