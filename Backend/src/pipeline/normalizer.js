export default function normalize(rawEvent) {
  const base = {
    source: rawEvent.source,
    event_id: rawEvent.event_id,
    raw_text: rawEvent.raw_text,
    raw_payload: rawEvent.raw_payload,
    timestamp: rawEvent.timestamp || new Date(),
    lat: rawEvent.lat || null,
    lng: rawEvent.lng || null,
    meta: {},
  }

  if (rawEvent.source === 'usgs') {
    base.meta.magnitude = rawEvent.magnitude
    base.meta.depth_km = rawEvent.depth_km
  }

  if (rawEvent.source === 'gdelt') {
    base.meta.domain = rawEvent.domain
    base.meta.url = rawEvent.url
  }

  return base
}
