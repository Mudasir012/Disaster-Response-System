const labels = { 1: 'MINOR', 2: 'LOW', 3: 'MODERATE', 4: 'HIGH', 5: 'CRITICAL' }
export default (severity) => labels[severity] || 'UNKNOWN'
