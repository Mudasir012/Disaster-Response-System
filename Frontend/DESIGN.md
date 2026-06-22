---
name: Sentinel
description: Real-time global disaster monitoring and alerting platform
register: product
theme: light
colors:
  deep-slate: oklch(0.985 0.004 255)
  surface: oklch(0.995 0.003 255)
  card-bg: oklch(0.99 0.003 255)
  landing-bg: oklch(0.985 0.004 255)
  section-alt: oklch(0.965 0.006 255)
  glacier-white: oklch(0.26 0.022 255)
  cool-gray: oklch(0.46 0.018 255)
  on-accent: "#ffffff"
  crisis-red: "#e94560"
  signal-blue: "#0f7ddb"
  status-teal: "#0d9488"
  amber: "#d97706"
  safe-green: "#16a34a"
  ai-purple: "#7c3aed"
typography:
  display:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "var(--color-crisis-red)"
    textColor: "var(--color-on-accent)"
    rounded: "var(--rounded-full)"
    padding: "8px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "var(--color-glacier-white)"
    rounded: "var(--rounded-full)"
    padding: "8px 24px"
    border: "1px solid oklch(0.26 0.022 255 / 0.14)"
  input-text:
    backgroundColor: "var(--color-surface)"
    textColor: "var(--color-glacier-white)"
    rounded: "var(--rounded-lg)"
    padding: "6px 12px"
    border: "1px solid oklch(0.26 0.022 255 / 0.10)"
  card-default:
    backgroundColor: "var(--color-surface)"
    textColor: "var(--color-glacier-white)"
    rounded: "var(--rounded-2xl)"
    padding: "16px"
    border: "1px solid oklch(0.26 0.022 255 / 0.08)"
  bento-tile:
    backgroundColor: "var(--color-surface)"
    border: "1px solid oklch(0.26 0.022 255 / 0.08)"
    rounded: "16px"
    padding: "24px"
    hover: "border oklch(0.26 0.022 255 / 0.16) + lift shadow"
  nav-link:
    backgroundColor: "transparent"
    textColor: "var(--color-cool-gray)"
    rounded: "var(--rounded-md)"
    padding: "6px 12px"
  nav-link-active:
    backgroundColor: "oklch(0.26 0.022 255 / 0.08)"
    textColor: "var(--color-glacier-white)"
    rounded: "var(--rounded-md)"
    padding: "6px 12px"
---

# Design System: Sentinel (Light)

## 1. Creative North Star

**The Situational Room — daylight edition.** The same calm, authoritative command interface, now on a cool near-white surface for field tablet use and outdoor glare. Alert Crimson stays the ≤10% attention signal; neutrals are tinted toward the brand's cool-blue hue (hue 255). No warm cream — the background is a true near-white at low chroma toward cool-blue. Every surface is flat at rest, with shadows appearing only on interaction.

The landing page uses a **bento grid** — asymmetric, purpose-varied tiles communicating "dense, real, operational" rather than a marketing scroll. The dashboard remains map-centric with orbiting panels.

## 2. Colors (OKLCH)

### Neutrals (cool-blue tinted, hue 255)
- **deep-slate** `oklch(0.985 0.004 255)`: Page background (near-white)
- **surface** `oklch(0.995 0.003 255)`: Card / input surface (whiter for subtle elevation)
- **card-bg** `oklch(0.99 0.003 255)`: Secondary card surface
- **section-alt** `oklch(0.965 0.006 255)`: Alternating section background
- **glacier-white** `oklch(0.26 0.022 255)`: Primary text / foreground (ink)
- **cool-gray** `oklch(0.46 0.018 255)`: Muted secondary text
- **on-accent** `#ffffff`: True white text on accent fills

### Accents (unchanged hues)
- **crisis-red** `#e94560`: Primary CTAs, critical alerts (≤10% of viewport)
- **signal-blue** `#0f7ddb`: Interactions, severity 2, secondary links
- **status-teal** `#0d9488`: Operational, connected, tsunami
- **amber** `#d97706`: Warning states, severity 3
- **ai-purple** `#7c3aed`: AI features, confidence
- **safe-green** `#16a34a`: Resolved, green states

### Named Rules
- **The One Voice Rule**: Alert Crimson is the only danger signal
- **The 10% Rule**: Alert Crimson ≤10% of any viewport
- **Flat-By-Default**: Surfaces flat at rest; shadows on interaction only

## 3. Typography

- **Display**: Sora (800, clamp(2.5rem, 5vw, 4.5rem))
- **Headline**: Sora (700, clamp(1.5rem, 3vw, 2.25rem))
- **Body**: Geist (400, 0.875rem, 1.5 line-height, max 70ch)
- **Mono**: JetBrains Mono (for timestamps, coordinates, data)
- **text-wrap: balance** on h1-h3, **pretty** on prose

## 4. Elevation

- Flat at rest (no ambient shadows)
- Hover lift: `0 12px 40px -16px oklch(0.26 0.022 255 / 0.18)` with -2px Y
- CTA shadow: `0 12px 30px -8px oklch(0.58 0.21 15 / 0.2)`
- Overlays: `0 12px 40px -12px oklch(0.26 0.022 255 / 0.2)`

## 5. Components

### Buttons
- Primary: Crimson bg, on-accent text, 12px radius, 8px 28px padding. Hover: invert to white bg + crimson text. Active: scale 0.97.
- Secondary: Transparent, ink text, dark border at 14% opacity, subtle dark bg on hover.

### Bento Tiles
- `surface` bg, 1px border at 8% ink, 16px radius, 24px padding.
- Hover: border deepens to 16%, subtle lift shadow.

### Cards / Containers
- `surface` bg, 8% ink border, 16px radius (xl).
- Flat at rest; hover lift on interactive cards.

### Maps (Leaflet)
- Light CARTO tiles: `light_all`
- Markers: White discs with colored 2px border, colored icons, subtle shadow
- Selected: 3px colored border + outer ring 4px at 8% ink + glow
- Controls: Light floating panels with backdrop blur
- Legend chips: `surface/90` with dark border, backdrop blur

## 6. Technical Notes

### Color Token Override
`--color-white` is overridden to ink (oklch 0.26) in `@theme`. All `white/[0.0X]` opacity utilities (skeletons, borders, hovers) auto-convert to subtle dark-on-light marks. True white on accent fills uses `--color-on-accent` (white).

### Contrast
- Primary text (ink) on bg: ≥7:1 (AAA)
- Muted text at /80 opacity: ≥4.5:1 (AA)
- Cool-gray opacity values bumped: /30→/65, /40→/70, /50→/75, /20→/70, /60→/70

### Reduced Motion
All animations respect `@media (prefers-reduced-motion: reduce)`. Scroll progress bar, grid overlay, CTA dot/arrow hidden; split-word transform disabled.
