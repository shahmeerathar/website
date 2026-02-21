# AGENTS.md

## 1. Mission
Build the complete photography portfolio site for Shahmeer Athar using `DESIGN.md`, `STRUCTURE.md`, and `TASKS.md` as the single source of truth.

Do not ask the user for additional decisions. Implement exactly what is specified.

## 2. Non-Negotiables
- Site heading/H1 must be exactly `Shahmeer Athar`.
- Visual style must remain minimal and dark.
- World map must show land/water boundaries only.
- No national or political borders may be rendered.
- Photos are the top visual priority on all breakpoints.
- Performance and mobile UX are first-class requirements.

## 3. Locked Stack
- Astro (static output)
- TypeScript (strict)
- CSS (no UI framework)
- `d3-geo` + `topojson-client` for map path generation
- Local JSON data sources; no CMS/backend

Do not introduce alternative frameworks, backend services, map SDKs, or UI kits.

## 4. Implementation Protocol
1. Read `BRIEF.MD`, `DESIGN.md`, `STRUCTURE.md`, then `TASKS.md`.
2. Execute tasks in the specified order.
3. Deliver in vertical slices (data + UI + behavior + tests/checks per slice).
4. Run required verification commands before every commit.
5. If a conflict appears between files, precedence is:
- `TASKS.md` (execution detail)
- `STRUCTURE.md` (architecture contract)
- `DESIGN.md` (visual/interaction contract)
- `BRIEF.MD` (intent)

## 5. Coding Standards
- TypeScript strict mode enabled and clean.
- No `any` unless technically unavoidable (document inline if used).
- Prefer pure utility functions for data and query-state logic.
- Keep client hydration minimal and isolated to interactive islands.
- All interactive elements must be keyboard accessible.
- Keep code comments concise and only for non-obvious logic.

## 6. Accessibility Baseline
- Ensure visible focus states for all interactive controls.
- Min tap target: 44x44 px.
- Support keyboard open/close for map pin galleries.
- Respect `prefers-reduced-motion`.
- Ensure non-empty `alt` text for all photos.

## 7. Performance Baseline
- Homepage JS budget (gzip): <= 90KB.
- Optimize images and ship responsive sources.
- No blocking third-party scripts.
- No runtime map provider/API fetches.
- Keep hydration code scoped to map/panel interactions.

## 8. Git Workflow (Required)

### Branch Strategy
- Base branch: `main`
- Implementation branch: `feature/portfolio-site-build`

### Commit Strategy
- Use small atomic commits that each complete one logical unit.
- Use Conventional Commits.

Examples:
- `feat(shell): scaffold astro project and base layout`
- `feat(data): add location/photo schemas and validators`
- `feat(map): render borderless world map with pins`
- `feat(gallery): implement gallery panel and photo grid`
- `feat(routing): add location slug pages and about page`
- `perf(images): add responsive image optimization pipeline`
- `chore(qa): finalize metadata, sitemap, and robots`

### History Hygiene
- Rebase implementation branch onto latest `main` before opening PR.
- Keep PR focused; do not bundle unrelated changes.
- Do not force-push after review begins unless explicitly requested.
- Do not rewrite merge history.

## 9. Required Verification Commands
Run these at each milestone and before final PR:

```bash
npm run lint
npm run typecheck
npm run test # if test script exists
npm run build
```

Run Lighthouse (mobile preset) on production build and capture scores.

## 10. Done Criteria
The work is done only when all conditions are true:
- All tasks in `TASKS.md` are complete.
- Acceptance criteria in `DESIGN.md` and `STRUCTURE.md` are met.
- Build passes with no lint/type errors.
- Required accessibility interactions are verified.
- Lighthouse mobile targets are met.
- No unresolved TODO/FIXME markers remain.

## 11. Blocker Policy
If blocked by missing data/assets:
- Create a minimal placeholder that keeps build green.
- Document placeholder clearly in PR notes.
- Continue with remaining tasks.

Do not pause for preference questions if a specified default exists in the docs.
