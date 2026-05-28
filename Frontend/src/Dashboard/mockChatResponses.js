export const suggestedQuestions = [
  'Summarize current emergencies near me',
  'What should I do during an earthquake?',
  'How to prepare for a hurricane?',
  'Latest severity assessment',
]

export function getChatResponse(message, context) {
  const q = message.toLowerCase()

  if (q.includes('earthquake')) {
    return {
      severity: 'Critical',
      summary: 'Earthquakes require immediate action. Drop, Cover, and Hold On. Stay indoors until shaking stops. Be prepared for aftershocks.',
      steps: [
        'Drop to your hands and knees to prevent being knocked over',
        'Cover your head and neck under a sturdy table or desk',
        'Hold On until the shaking stops',
        'Stay away from windows, glass, and exterior walls',
        'If outdoors, move away from buildings, streetlights, and utility wires',
      ],
      badge: '#e94560',
    }
  }

  if (q.includes('hurricane') || q.includes('cyclone') || q.includes('typhoon')) {
    return {
      severity: 'Severe',
      summary: 'Hurricanes bring dangerous winds, storm surge, and flooding. Preparation is key. Follow evacuation orders immediately when issued.',
      steps: [
        'Monitor local weather alerts and evacuation orders',
        'Secure outdoor objects or bring them inside',
        'Fill vehicles with gas and prepare emergency kits',
        'Move to higher ground if in a flood-prone area',
        'Stay in an interior room away from windows during the storm',
      ],
      badge: '#d97706',
    }
  }

  if (q.includes('flood') || q.includes('flooding')) {
    return {
      severity: 'Severe',
      summary: 'Flooding is one of the deadliest natural disasters. Never attempt to walk or drive through floodwaters. Move to higher ground immediately.',
      steps: [
        'Move to the highest floor or roof if trapped',
        'Avoid walking or driving through moving water',
        'Disconnect electrical appliances if safe to do so',
        'Listen for emergency alerts and evacuation instructions',
        'After flooding, avoid contact with floodwater as it may be contaminated',
      ],
      badge: '#d97706',
    }
  }

  if (q.includes('wildfire') || q.includes('fire')) {
    return {
      severity: 'Critical',
      summary: 'Wildfires spread rapidly, especially in dry and windy conditions. Early evacuation is critical. Protect yourself from smoke inhalation.',
      steps: [
        'Evacuate immediately if ordered by authorities',
        'Close all windows and doors to prevent smoke entry',
        'Wear an N95 mask or cover nose and mouth with a damp cloth',
        'Pack emergency supplies including medications and documents',
        'Avoid driving through smoke-heavy areas',
      ],
      badge: '#e94560',
    }
  }

  if (q.includes('tsunami')) {
    return {
      severity: 'Critical',
      summary: 'Tsunamis are a series of powerful waves. If you feel a strong earthquake near the coast, move inland immediately. Do not wait for an official warning.',
      steps: [
        'Move immediately to high ground or inland',
        'Do not wait for an official warning if you feel strong shaking near the coast',
        'Stay away from the coast until authorities declare it safe',
        'A tsunami can arrive within minutes of the initial earthquake',
        'Listen for emergency broadcasts and follow evacuation routes',
      ],
      badge: '#0d9488',
    }
  }

  if (q.includes('summarize') || q.includes('current') || q.includes('near me') || q.includes('assessment')) {
    const activeCount = context?.activeCount || 5
    const types = context?.incidentTypes || ['Earthquake', 'Hurricane', 'Wildfire']
    return {
      severity: 'Multiple Events',
      summary: `There are currently ${activeCount} active incidents being monitored. The most critical events include ${types.slice(0, 3).join(', ')}. Severity levels range from moderate to critical across monitored regions.`,
      steps: [
        `Review the ${activeCount} active incidents in your dashboard`,
        'Configure region alerts for areas that affect you',
        `Prioritize response to ${types[0] || 'the most severe event'}`,
        'Check the Analytics page for trend data',
        'Enable notifications to stay updated on changes',
      ],
      badge: '#7c3aed',
    }
  }

  return {
    severity: 'Information',
    summary: 'I can help you understand current emergencies and provide safety guidance. Ask me about specific disaster types like earthquakes, hurricanes, floods, wildfires, or tsunamis, or request a general situation summary.',
    steps: [
      'Try asking: "Summarize current emergencies"',
      'Ask: "What should I do during an earthquake?"',
      'Or: "How to prepare for a hurricane?"',
      'I can also provide region-specific advice',
    ],
    badge: '#0f7ddb',
  }
}
