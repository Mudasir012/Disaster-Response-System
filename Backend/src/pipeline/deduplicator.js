import { RawEvent } from '../models/RawEvent.js'

export default async function isDuplicate(source, eventId) {
  const existing = await RawEvent.findOne({
    source,
    source_event_id: eventId,
  })
  return !!existing
}
