# DECISIONS.md

## Architectural and Design Decisions Made During Implementation

### Task 1: Bootstrap Project Foundation
- Used Astro's standard TypeScript strict mode without additional custom configuration
- Chose ESLint with TypeScript parser for static analysis
- Kept package-lock.json tracked for reproducibility

### Task 2: Implement Design Tokens and Base Shell
- Moved year calculation in footer to server-side (Astro script) instead of client-side JS to minimize hydration
- Used system font stack with fallbacks to avoid webfont blocking (font-display: swap)

### Task 3: Add Data Contracts and Validation Layer
- Imported data.ts in index.astro to ensure validation runs during every build
- Used Node.js fs module for file existence validation of photo assets
- Created placeholder SVG images for validation purposes (will be replaced with real photos)
- Implemented comprehensive validation that fails build on invalid data

### Task 4: Build Borderless World Map Renderer
- Used topojson-client to convert TopoJSON to GeoJSON for d3-geo processing
- Chose geoNaturalEarth1 projection for balanced global representation
- Pre-processed world-atlas data to extract only land geometry (removed country borders)
- Used SVG rendering for sharp vector output and low runtime cost
- Implemented map heights per DESIGN.md: 42vh mobile, 50vh tablet, 60vh desktop
- Reduced hero section height to accommodate map above fold