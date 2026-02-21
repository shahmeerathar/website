# STRUCTURE.md

## 1. Architecture Decision
Use a static Astro site with minimal hydrated islands.

- Framework: Astro
- Language: TypeScript (strict)
- Styling: global CSS + component-scoped CSS
- Runtime interactivity: map pin interactions and gallery panel only
- Data source: local JSON files under `src/data`
- Map rendering: SVG with `d3-geo` and `topojson-client`

## 2. Final Project Tree
```text
.
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
│       └── photos/
│           ├── *.jpg
│           ├── *.webp
│           └── *.avif
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.astro
│   │   │   └── SiteFooter.astro
│   │   ├── map/
│   │   │   ├── WorldMap.astro
│   │   │   ├── MapPin.tsx
│   │   │   └── mapProjection.ts
│   │   ├── gallery/
│   │   │   ├── GalleryPanel.tsx
│   │   │   └── PhotoGrid.astro
│   │   └── seo/
│   │       └── SeoHead.astro
│   ├── data/
│   │   ├── locations.json
│   │   ├── photos.json
│   │   └── world-land-110m.json
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── data.ts
│   │   ├── map.ts
│   │   ├── queryState.ts
│   │   └── validation.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── location/
│   │   │   └── [slug].astro
│   │   ├── feed.xml.ts
│   │   └── sitemap-index.xml.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   └── utilities.css
│   ├── types/
│   │   ├── content.ts
│   │   └── map.ts
│   └── env.d.ts
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── AGENTS.md
├── BRIEF.MD
├── DESIGN.md
├── STRUCTURE.md
└── TASKS.md
```

## 3. Routes (Fixed)
- `/`
- `/about`
- `/location/[slug]`
- `/feed.xml`
- `/sitemap-index.xml`
- `/robots.txt`

### Route Rules
- Homepage (`/`) contains hero, map, and gallery panel interactions.
- `/location/[slug]` renders the same gallery context focused to one location for direct sharing.
- Invalid `/location/[slug]` returns 404.

## 4. Content Contracts (Required Types)

Create these interfaces in `src/types/content.ts`:

```ts
export interface Location {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  country: string;
  description: string;
  heroPhotoId: string;
}

export interface Photo {
  id: string;
  locationSlug: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  takenAt: string;
  tags: string[];
  featured: boolean;
  sortOrder: number;
}

export interface MapPinView {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  photoCount: number;
  heroSrc: string;
}
```

## 5. Validation Rules (Mandatory)
Implement strict validation in `src/lib/validation.ts`.

### Location validation
- `slug`: lowercase kebab-case, unique.
- `lat`: `-90 <= lat <= 90`.
- `lng`: `-180 <= lng <= 180`.
- `heroPhotoId` must exist in `photos.json`.

### Photo validation
- `id`: unique.
- `locationSlug` must exist in `locations.json`.
- `src` must resolve to existing file under `public/images/photos`.
- `width`, `height` > 0.
- `alt` must be non-empty.
- `takenAt` must be valid ISO date string.

### Failure behavior
- Validation failure throws during build and exits with non-zero status.

## 6. Data Flow
1. `src/lib/data.ts` loads and validates both JSON datasets at build time.
2. Build `MapPinView[]` by joining `locations` with grouped `photos`.
3. Sort photos per location by `sortOrder` ascending.
4. Sort pins by location name ascending for deterministic keyboard order.
5. Export utility getters:
- `getAllLocations()`
- `getLocationBySlug(slug)`
- `getPhotosByLocation(slug)`
- `getMapPins()`

## 7. Map Rendering (No Borders)
- Source topology file: `src/data/world-land-110m.json`.
- Only land geometry is rendered (`land` object from topology).
- Do not import or render `countries`, `admin-0`, or political boundaries.
- Render output is an SVG path projected with `geoNaturalEarth1`.

## 8. Query + UI State Contract
Implement in `src/lib/queryState.ts`.

- Query parameter key: `location`
- Valid example: `/?location=patagonia-torres-del-paine`

### Behavior
- If `location` is valid, open matching gallery on initial load.
- If invalid or missing, load map with no gallery open.
- Selecting a pin updates URL query using `history.replaceState`.
- Closing gallery removes `location` query key.

## 9. Interaction and Accessibility Contract
- Pins are focusable buttons in DOM order matching sorted pin data.
- `Enter`/`Space` on a pin opens gallery.
- `Escape` closes panel and returns focus to active pin.
- Gallery close button has `aria-label="Close gallery"`.
- Panel uses `role="dialog"` and `aria-modal="true"` on mobile sheet mode.

## 10. Image and Asset Pipeline
- Canonical source files in `public/images/photos`.
- Use Astro `Image` component for responsive derivatives.
- Formats: AVIF + WebP + fallback JPEG.
- Sizes:
- Grid thumbnails: 360, 720 px
- Feature/hero image: 960, 1440 px
- `loading="lazy"` for non-critical images.
- `decoding="async"` for all gallery images.

## 11. SEO and Metadata Structure
- `SeoHead.astro` centralizes title, description, canonical, OG/Twitter tags.
- Home title: `Shahmeer Athar | Landscape & Travel Photography`
- Location page title template: `{Location Name} | Shahmeer Athar`
- Generate sitemap from static routes + all location pages.
- `robots.txt` allows all crawlers and includes sitemap URL.

## 12. Error and Edge Cases
- Location with zero photos: show panel with message `No photos available yet.`
- Missing hero photo: fallback to first photo by sort order.
- Missing both hero and photos: render neutral placeholder block.
- Unknown query slug: ignore silently and keep page usable.
- Broken image path detected in validation: fail build.

## 13. Performance Budgets (Enforced)
- JavaScript on homepage (gzip) <= 90KB total.
- Largest optimized image payload per viewport <= 350KB.
- No third-party analytics scripts in initial version.
- No runtime map tile/API requests.

## 14. Acceptance Criteria
- `/` renders `Shahmeer Athar` H1 and map within first viewport.
- Map includes land/water only, no national borders.
- Deep link query opens correct gallery.
- `/location/[slug]` works for all valid slugs and 404s invalid slugs.
- Build fails on invalid data contracts.
- Mobile layout works at 360x800 without horizontal scroll.
