# DESIGN.md

## 1. Design Goal
Build a minimal, dark, high-performance photography portfolio where images are the primary visual element and the world map is the central interaction surface.

## 2. Brand & Voice
- Brand name and primary heading: `Shahmeer Athar`
- Tone: quiet, exploratory, field-journal aesthetic
- Visual priority order:
1. Photos
2. Map + pins
3. Metadata and text

## 3. Design Principles (Non-Negotiable)
- Minimize interface chrome and decorative UI.
- Preserve generous negative space around photographs.
- Use motion sparingly and only to reinforce hierarchy.
- Keep controls visible but visually recessive.
- Maintain strict dark theme (no light mode toggle).

## 4. Visual Tokens (Hard Values)

### 4.1 Color
```css
:root {
  --color-bg: #090b0d;
  --color-surface: #12161a;
  --color-surface-elevated: #1a2026;
  --color-text-primary: #f3f5f7;
  --color-text-secondary: #a8b0b8;
  --color-text-muted: #7d8791;
  --color-accent: #8ec5ff;
  --color-accent-strong: #5aa9ff;
  --color-pin-default: #9fb0bf;
  --color-pin-active: #8ec5ff;
  --color-pin-focus: #d7ecff;
  --color-border-subtle: #27313a;
  --color-overlay: rgba(0, 0, 0, 0.62);
}
```

### 4.2 Typography
- Heading font: `"Fraunces", "Iowan Old Style", "Times New Roman", serif`
- Body/UI font: `"Manrope", "Avenir Next", "Segoe UI", sans-serif`
- Monospace: `"IBM Plex Mono", "SFMono-Regular", monospace`
- Type scale:
- `--fs-900: clamp(2rem, 5vw, 4rem)`
- `--fs-700: clamp(1.5rem, 3vw, 2.25rem)`
- `--fs-500: 1.125rem`
- `--fs-400: 1rem`
- `--fs-300: 0.875rem`
- Line heights:
- Headings: `1.15`
- Body: `1.55`

### 4.3 Spacing + Shape
- Space scale: `4, 8, 12, 16, 24, 32, 48, 64, 96` px
- Border radius:
- Cards/panels: `14px`
- Pills/chips: `999px`
- Focus ring radius: `8px`
- Max content width: `1200px`
- Core layout padding:
- Mobile: `16px`
- Tablet: `24px`
- Desktop: `32px`

### 4.4 Motion
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Durations:
- Fast: `140ms`
- Medium: `220ms`
- Slow: `360ms`
- Reduced-motion: disable transforms/transitions; keep opacity changes <= `80ms`

### 4.5 Breakpoints
- `sm`: `480px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`

## 5. Page-Level Composition

### 5.1 Header
- Left: brand wordmark `Shahmeer Athar`
- Right: compact links (`About`)
- Height: `64px`
- Sticky with subtle translucent background and blur (`backdrop-filter: blur(8px)`)

### 5.2 Hero
- H1 text exactly: `Shahmeer Athar`
- Short intro (max 140 chars) above map fold

### 5.3 Map Section
- Centerpiece of homepage.
- Occupies 55-65vh on desktop, 42-50vh on mobile.
- Background: very subtle radial gradient over dark base.
- Map artwork: only land and coastlines; no country borders.

### 5.4 Gallery Panel
- Desktop: right-side drawer (`min(460px, 38vw)`).
- Mobile: bottom sheet (`min(72vh, 680px)`).
- Contains selected location title, coordinates label, photo count, and responsive grid.

### 5.5 Footer
- Minimal single-row footer with copyright and social link.

## 6. Component Specs

### 6.1 World Map
- Render via SVG for sharp vector output and low runtime cost.
- Land fill: `#151b21`; coastline stroke: `#2a3642` at `1px`.
- No political layers imported or drawn.

### 6.2 Pins
- Shape: circular marker with inner dot.
- Default size: `12px`, hover/focus/active: `16px`.
- Default fill: `var(--color-pin-default)`.
- Active fill + halo: `var(--color-pin-active)` + 14px soft glow.
- Must include keyboard focus style ring in `var(--color-pin-focus)`.

### 6.3 Photo Cards
- 2-column grid on mobile, 3-column on tablet+, fixed gap `8px`.
- Aspect strategy: preserve intrinsic ratio; no distortion.
- Hover: slight brightness lift only on pointer devices.

### 6.4 Captions & Metadata
- Caption below image in `--fs-300`, `--color-text-secondary`.
- Optional metadata chips for date/tag in muted surface style.

## 7. Interaction Behavior
- First meaningful paint: static hero + map appears immediately.
- Pin click/tap/Enter/Space opens corresponding gallery.
- Escape closes gallery panel and returns focus to active pin.
- Clicking backdrop closes panel.
- Invalid location query in URL falls back to no-open state.

## 8. Accessibility Rules
- Text contrast: minimum 4.5:1 for body, 3:1 for large headings.
- Interactive targets: minimum 44x44 px hit area.
- Full keyboard support for header links, pins, panel close button, and gallery navigation.
- All photos require non-empty `alt` text.
- Respect `prefers-reduced-motion`.

## 9. Performance Rules
- Dark theme and map visuals implemented with CSS/SVG, not canvas animation.
- Avoid custom webfont blocking; use `font-display: swap`.
- Limit client-side JavaScript to map interaction and panel state.
- No heavy animation libraries.

## 10. Acceptance Criteria
- Home page H1 is exactly `Shahmeer Athar`.
- Visual theme is dark and minimal on all pages.
- World map shows only land/water boundaries; no national borders.
- Photos remain the dominant visual element in every breakpoint.
- Layout and interaction quality remain intact on mobile widths down to 360px.
