---
name: Sentinel
description: Real-time global disaster monitoring and alerting platform
colors:
  deep-slate: "#0d1117"
  surface: "#1c2333"
  card-bg: "#1a2030"
  crisis-red: "#e94560"
  signal-blue: "#0f7ddb"
  status-teal: "#0d9488"
  amber: "#d97706"
  safe-green: "#16a34a"
  ai-purple: "#7c3aed"
  glacier-white: "#f8fafc"
  cool-gray: "#94a3b8"
  navy: "#0f3460"
typography:
  display:
    fontFamily: "Sora, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  "2xl": "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.crisis-red}"
    textColor: "{colors.glacier-white}"
    rounded: "{rounded.xl}"
    padding: "8px 32px 8px 32px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.glacier-white}"
    rounded: "{rounded.xl}"
    padding: "8px 32px 8px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cool-gray}"
    rounded: "{rounded.md}"
    padding: "6px 12px 6px 12px"
  input-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.glacier-white}"
    rounded: "{rounded.lg}"
    padding: "6px 12px 6px 12px"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.glacier-white}"
    rounded: "{rounded.xl}"
    padding: "16px 16px 16px 16px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.cool-gray}"
    rounded: "{rounded.md}"
    padding: "6px 12px 6px 12px"
  nav-link-active:
    backgroundColor: "rgba(255,255,255,0.1)"
    textColor: "{colors.glacier-white}"
    rounded: "{rounded.md}"
    padding: "6px 12px 6px 12px"
  badge:
    backgroundColor: "rgba(233,69,96,0.15)"
    textColor: "{colors.crisis-red}"
    rounded: "{rounded.full}"
    padding: "2px 10px 2px 10px"
---

# Design System: Sentinel

## 1. Overview

**Creative North Star: "The Situational Room"**

DisasterTracker is a calm, authoritative command interface for emergency responders. It rejects the clichés of dark-theme dashboards — no floating widgets, no decorative glassmorphism, no gradient text. Instead it offers a focused operational environment where data commands attention through hierarchy and contrast, not animation or color noise.

Every screen is built for glancing comprehension under pressure. High contrast text (glacier-white on deep-slate), generous type, and unambiguous severity coding. The interface doesn't compete with the data; it disappears behind it. Controls feel tactile and confident — buttons lift on hover, cards respond to interaction — but the resting state is flat and quiet. The map is the hero; everything else orbits it.

**Key Characteristics:**

- Data-forward: the map, stats, and incident lists dominate visual priority
- Restrained color hierarchy: Alert Crimson only for critical signals, neutrals tinted cool-blue everywhere else
- Glassmorphism reserved for overlays (detail panel, mobile sidebar) where content must float above the map — never on cards or containers
- No gradient text, no side-stripe borders, no hero-metric templates
- Tactile micro-interactions on interactive elements confirm action without distraction

## 2. Colors

The palette is built around a cool, dark backdrop with a single vivid alert accent. Low chroma across neutrals maintains readability in both dim command centers and bright field conditions.

### Primary

- **Alert Crimson** (`#e94560` / `oklch(0.58 0.21 15)`): Primary CTAs, severity 4+ indicators, critical status badges, active incident counts. Used sparingly so its appearance always means "pay attention."

### Secondary

- **Signal Blue** (`#0f7ddb` / `oklch(0.55 0.18 255)`): Interactive elements (filter toggles, subscribe buttons, region select), severity 2 indicators, secondary links. The calm counterpart to Alert Crimson.

### Tertiary

- **AI Purple** (`#7c3aed` / `oklch(0.50 0.20 300)`): AI-powered features, Gemini classification summaries, confidence indicators. Reserved for machine-intelligence context.
- **Amber** (`#d97706` / `oklch(0.65 0.14 70)`): Warning states, severity 3, moderate alerts. Bridges minor and critical.
- **Status Teal** (`#0d9488` / `oklch(0.60 0.12 190)`): Operational status, connected indicators, "alive" signals, severity 5 (tsunami).

### Neutral

- **Deep Slate** (`#0d1117` / `oklch(0.10 0.008 250)`): Primary background. The darkest value, tinted slightly cool-blue to avoid dead black.
- **Surface** (`#1c2333` / `oklch(0.16 0.015 255)`): Card backgrounds, input fields, secondary surfaces. One step off deep-slate for subtle layering.
- **Card BG** (`#1a2030` / `oklch(0.15 0.012 255)`): Glass-card backgrounds beneath blur.
- **Glacier White** (`#f8fafc` / `oklch(0.97 0.003 250)`): Primary text, headings, high-emphasis content. Tinted fractionally cool.
- **Cool Gray** (`#94a3b8` / `oklch(0.68 0.025 250)`): Secondary text, muted labels, icon defaults.

### Named Rules

**The One Voice Rule.** Alert Crimson is the only accent used for danger/attention signals. Never layer amber or purple on a critical alert; dilution erodes trust.

**The 10% Rule.** Alert Crimson covers ≤10% of any given screen. Its rarity is the signal. If more than one element in a viewport is red, the user can't tell which one matters.

## 3. Typography

**Display Font:** Sora (with Inter fallback)
**Body Font:** Inter (with system-ui fallback)
**Label/Mono Font:** JetBrains Mono (for coordinates, timestamps, code values)

**Character:** Sora brings a geometric, authoritative presence to the brand voice — slightly tighter letter-spacing, squared curves, confident weight. Inter handles the body with neutrality and readability. The pairing says "operational tool" not "tech blog."

### Hierarchy

- **Display** (800 weight, `clamp(2.5rem, 5vw, 4.5rem)`, 1.1 line-height, `-0.025em` tracking): Hero headings on landing. Never used inside the product surfaces.
- **Headline** (700 weight, `clamp(1.5rem, 3vw, 2.25rem)`, 1.2 line-height): Page titles on dashboard, analytics, alerts. The strongest in-product type.
- **Title** (600 weight, `1rem`, 1.3 line-height): Card titles, section headers, incident names.
- **Body** (400 weight, `0.875rem`, 1.5 line-height): Paragraphs, descriptions, summaries. Capped at 70ch.
- **Label** (600 weight, `0.6875rem`, 1.2 line-height, `0.05em` tracking, uppercase): Eyebrow text, table headers, metadata, severity labels. The smallest readable size.

## 4. Elevation

The system uses tonal layering for structural depth and reserved shadows for interactive states. At rest, surfaces are flat — no floating cards, no ambient shadows. Depth is communicated through background color stepping: deep-slate (page) → surface (container) → surface at reduced opacity (overlay). Shadows appear only as a response to interaction.

### Shadow Vocabulary

- **Hover Lift** (`0 8px 30px rgba(0,0,0,0.3)`): Applied on interactive cards and panels during hover. Accompanied by a `-2px` Y translation.
- **CTA Shadow** (`0 20px 25px -5px rgba(233,69,96,0.25)`): Applied to primary CTAs. Tinted Alert Crimson to reinforce the call to action.
- **Overlay Shadow** (`0 8px 32px rgba(0,0,0,0.5)`): Applied to floating panels (detail panel, mobile sidebar, map popups).

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on hover, focus, or active state — never as a permanent elevation trait.

## 5. Components

### Buttons

- **Shape:** Rounded XL (12px radius). Generous padding for tactile confidence.
- **Primary:** Alert Crimson background, glacier-white text, 8px 32px padding. Hover: scale to 1.03, shadow deepens. Active: scale to 0.97.
- **Secondary:** Transparent background, glacier-white text, white border at 15% opacity. Hover: border increases to 30% opacity, background adds 5% white.
- **Ghost:** Transparent, cool-gray text, 6px 12px padding. Hover: glacier-white text, 5% white background. Used for icon-only actions (close, edit, delete).

### Cards / Containers

- **Corner Style:** Rounded XL (12px radius) for primary cards; Rounded (8px radius) for secondary and compact cards.
- **Background:** Surface (`#1c2333`) with subtle white border at 6–8% opacity.
- **Shadow Strategy:** Flat at rest. On interactive cards, hover triggers the Hover Lift shadow with `-2px` Y offset.
- **Internal Padding:** 16px (standard), 24px (generous), 12px (compact).

### Inputs / Fields

- **Style:** Surface background, 8px radius, 6px 12px padding, 10% white border.
- **Focus:** Border shifts to Signal Blue at 50% opacity. Outline ring at 60% Signal Blue opacity, 2px.
- **Error:** Crisis-red border at 30% opacity.
- **Disabled:** Reduced opacity (50%), no interactive states.

### Navigation

- **Style:** Fixed top bar, 56px height, deep-slate background at 90% opacity with backdrop blur. Bottom border at 6% white.
- **Links:** Cool-gray default, glacier-white active. Active link has 10% white background pill.
- **Mobile:** Full-width search expands below bar; hamburger menu on map page.

### Chips / Badges

- **Shape:** Fully rounded (9999px).
- **Severity Badge:** 2px 10px padding. Background at 15–20% opacity of the severity color, text at full opacity.
- **Filter Chip:** 8px 12px padding, surface background, 10% white border. Selected: background fills to Signal Blue at 100%, text turns white.

### The Incident Card (signature)

- **Shape:** Rounded (8px radius), compact at 280px width.
- **Background:** Surface at 60% opacity with backdrop blur, 6% white border.
- **Top bar:** 4px color stripe matching severity. No side-stripe borders.
- **Internal layout:** Type label → location (semibold, glacier-white) → summary (2-line clamp) → timestamp + link.

### The Detail Panel (signature)

- **Shape:** Full-height fixed panel, 380px width, slides in from right. Rounded left edge (optional, not used — squared to edge).
- **Background:** Deep-slate at 95% with strong backdrop blur, 6% white left border.
- **Sections:** Sticky header with close button, AI summary card (purple-tinted gradient), stats grid (2-column), action buttons.
- **AI Summary Card:** Subdued purple gradient (`#1a1040` to `#110a2e`), AI Purple border at 20% opacity, left border 4px AI Purple. Keeps AI context visually distinct without shouting.

## 6. Do's and Don'ts

### Do:

- **Do** use Alert Crimson sparingly — ≤10% of any viewport. Its rarity IS the urgency signal.
- **Do** use tonal layering for depth: deep-slate → surface → surface at reduced opacity. No shadows at rest.
- **Do** use backdrop blur on floating overlays only (detail panel, sidebar, map popups). Cards and containers stay opaque.
- **Do** use JetBrains Mono for coordinates, timestamps, and data values where precision matters.
- **Do** prefer inline expansion and progressive disclosure over modals.

### Don't:

- **Don't** use gradient text (`background-clip: text`). Emphasis comes from weight and size, not color gradients.
- **Don't** use side-stripe borders (border-left or border-right > 1px as a colored accent). Use full borders, background tints, or the top-bar pattern from incident cards.
- **Don't** use glassmorphism on cards or containers. Blur is for overlays that must float above the map.
- **Don't** use hero-metric templates (big number, small label, supporting stats, gradient accent). Stats are presented flat and clean.
- **Don't** use identical card grids with icon + heading + text repeated endlessly. Vary card structure by purpose.
- **Don't** reach for a modal first. Exhaust inline expansion, progressive disclosure, and side panels first.
- **Don't** use em dashes. Use commas, colons, semicolons, or periods.
- **Don't** use dead black (`#000`) or pure white (`#fff`). Tint every neutral toward the brand's cool-blue hue.
