# TASKS.md

This is the execution checklist for building the production site. Complete tasks in order.

## Task 1: Bootstrap Project Foundation
- Objective: initialize Astro + TypeScript strict project and core scripts.
- Files to create/modify:
- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `src/env.d.ts`
- `src/pages/index.astro` (temporary scaffold)
- Acceptance criteria:
- Astro site runs locally and builds successfully.
- TypeScript strict mode is enabled.
- Scripts include `dev`, `build`, `preview`, `lint`, `typecheck`.
- Verification commands:
```bash
npm install
npm run build
npm run typecheck
```
- Definition of done: clean build + typecheck passes.

## Task 2: Implement Design Tokens and Base Shell
- Objective: establish dark minimal design system and global layout.
- Files to create/modify:
- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/utilities.css`
- `src/layouts/BaseLayout.astro`
- `src/components/layout/SiteHeader.astro`
- `src/components/layout/SiteFooter.astro`
- `src/pages/index.astro`
- Acceptance criteria:
- H1 on homepage is exactly `Shahmeer Athar`.
- Subtitle is `Landscape & Travel Photography`.
- Header/footer and spacing match `DESIGN.md` tokens.
- Verification commands:
```bash
npm run build
npm run lint
```
- Definition of done: shell is responsive and matches token spec.

## Task 3: Add Data Contracts and Validation Layer
- Objective: define and enforce data schemas for locations and photos.
- Files to create/modify:
- `src/types/content.ts`
- `src/types/map.ts`
- `src/data/locations.json`
- `src/data/photos.json`
- `src/lib/validation.ts`
- `src/lib/data.ts`
- Acceptance criteria:
- Required interfaces exactly match `STRUCTURE.md`.
- Build fails on invalid schema/data relationships.
- Data access helpers are implemented and typed.
- Verification commands:
```bash
npm run typecheck
npm run build
```
- Definition of done: validation executes at build and rejects invalid data.

## Task 4: Build Borderless World Map Renderer
- Objective: render land-only SVG world map with no political borders.
- Files to create/modify:
- `src/data/world-land-110m.json`
- `src/lib/map.ts`
- `src/components/map/mapProjection.ts`
- `src/components/map/WorldMap.astro`
- Acceptance criteria:
- Map renders from land geometry only.
- No country/admin boundaries are visible.
- Projection uses Natural Earth and scales responsively.
- Verification commands:
```bash
npm run build
npm run preview
```
- Definition of done: visible borderless map on desktop and mobile.

## Task 5: Implement Pin Interactions and URL Query Sync
- Objective: enable pin selection and deterministic URL state behavior.
- Files to create/modify:
- `src/components/map/MapPin.tsx`
- `src/lib/queryState.ts`
- `src/components/map/WorldMap.astro`
- `src/pages/index.astro`
- Acceptance criteria:
- Click/tap/Enter/Space on pin opens corresponding location context.
- URL updates with `?location=<slug>`.
- Invalid query slug is ignored safely.
- Escape closes active panel and restores focus.
- Verification commands:
```bash
npm run build
npm run lint
```
- Definition of done: interaction works with mouse, touch, and keyboard.

## Task 6: Build Gallery Panel and Responsive Photo Grid
- Objective: display photos by location with mobile/desktop-specific panel UX.
- Files to create/modify:
- `src/components/gallery/GalleryPanel.tsx`
- `src/components/gallery/PhotoGrid.astro`
- `src/pages/index.astro`
- Acceptance criteria:
- Desktop right drawer and mobile bottom sheet behaviors implemented.
- Photos sorted by `sortOrder`.
- Empty location state displays `No photos available yet.`.
- Verification commands:
```bash
npm run build
npm run typecheck
```
- Definition of done: panel is fully functional and responsive.

## Task 7: Add Static Location and About Pages
- Objective: support direct location URLs and author page.
- Files to create/modify:
- `src/pages/location/[slug].astro`
- `src/pages/about.astro`
- `src/components/seo/SeoHead.astro`
- Acceptance criteria:
- Valid location slugs build static pages.
- Invalid location slug resolves to 404.
- About page includes concise bio and contact/social links.
- Verification commands:
```bash
npm run build
npm run preview
```
- Definition of done: all routes render and link correctly.

## Task 8: Optimize Image Pipeline and Loading Behavior
- Objective: ensure fast loading and responsive image delivery.
- Files to create/modify:
- `src/components/gallery/PhotoGrid.astro`
- `src/pages/location/[slug].astro`
- `astro.config.mjs`
- `public/images/photos/*`
- Acceptance criteria:
- AVIF/WebP/JPEG variants available via Astro image pipeline.
- Non-critical images are lazy-loaded.
- No layout shift from image rendering.
- Verification commands:
```bash
npm run build
npm run preview
```
- Definition of done: image strategy meets performance constraints.

## Task 9: Complete Accessibility Pass
- Objective: enforce keyboard, focus, ARIA, and reduced-motion behavior.
- Files to create/modify:
- `src/components/map/MapPin.tsx`
- `src/components/gallery/GalleryPanel.tsx`
- `src/styles/global.css`
- Acceptance criteria:
- All interactive elements have visible focus states.
- Minimum hit area is 44x44 px.
- Dialog semantics and close interactions are correct.
- Reduced motion preference is respected.
- Verification commands:
```bash
npm run lint
npm run build
```
- Definition of done: keyboard-only user can complete all primary flows.

## Task 10: SEO and Machine-Readable Outputs
- Objective: finalize metadata and search/crawler outputs.
- Files to create/modify:
- `src/components/seo/SeoHead.astro`
- `src/pages/feed.xml.ts`
- `src/pages/sitemap-index.xml.ts`
- `public/robots.txt`
- Acceptance criteria:
- Home title is `Shahmeer Athar | Landscape & Travel Photography`.
- Location pages use `{Location Name} | Shahmeer Athar`.
- Sitemap includes home, about, and all location pages.
- Verification commands:
```bash
npm run build
```
- Definition of done: metadata and crawler files are generated correctly.

## Task 11: Quality Gate and Performance Verification
- Objective: confirm production readiness.
- Files to create/modify:
- none required unless defects found
- Acceptance criteria:
- `npm run lint`, `npm run typecheck`, `npm run build` all pass.
- Lighthouse mobile targets met:
- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 90
- Verification commands:
```bash
npm run lint
npm run typecheck
npm run build
```
- Definition of done: all quality and performance targets achieved.

## Task 12: Final Git Hygiene and PR Preparation
- Objective: finalize clean implementation branch for review.
- Files to create/modify:
- none (except final cleanup commits if required)
- Acceptance criteria:
- Commit history is atomic and descriptive.
- Branch rebased on latest `main`.
- No unrelated file changes.
- Verification commands:
```bash
git status --short
git log --oneline --decorate -n 20
```
- Definition of done: review-ready PR from `feature/portfolio-site-build` to `main`.

## Mandatory Release Checklist
- Map has no political boundaries.
- H1 is exactly `Shahmeer Athar`.
- Homepage query deep-linking works.
- Mobile layout verified at 360x800 and 390x844.
- All photo `alt` text present.
- Final branch has clean working tree.
