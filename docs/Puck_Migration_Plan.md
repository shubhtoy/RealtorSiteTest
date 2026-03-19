# Full-Site Puck Migration Plan

## Scope
Transform the site into a fully editable, schema-driven Puck system with layered content models, preview/publish workflow, and cleaned architecture.

## Confirmed Decisions
- Persistence: Local JSON file in repo (git-tracked)
- Editing scope: Entire site, including gallery/media collections
- Workflow: Preview + Publish (draft and published states)

## Phase 1: Stabilize and Baseline
1. Remove broken editor prototype and all Storyblok remnants from runtime and build graph.
2. Inventory all rendered content fields across Home, Gallery, Contact, Header, Footer, and SEO.
3. Add strict parse/validation for editable payloads with safe fallback behavior.
4. Deliverable: clean build and canonical field map for migration.

## Phase 2: Layered Content Architecture
1. Define Layer 1 Global model: brand, nav, footer, contact, reusable CTAs, SEO defaults.
2. Define Layer 2 Page model: page composition, section order, per-page toggles.
3. Define Layer 3 Section model: editable section payloads (hero, stats, plans, amenities, testimonials, FAQ, gallery hero, contact blocks).
4. Define Layer 4 Collection model: gallery media, floor plan cards, FAQ entries, testimonials, neighborhood highlights.
5. Add schema versioning + migration function for forward compatibility.
6. Deliverable: versioned schema contract and defaults.

## Phase 3: Draft/Preview/Publish System
1. Implement content store with `draft` and `published` documents.
2. Public site reads `published`; admin preview reads `draft`.
3. Add save draft, revert draft, validate on publish, publish action.
4. Persist JSON in repo-friendly format with import/export helper support.
5. Deliverable: reliable editorial flow with rollback safety.

## Phase 4: Unified Puck Studio
1. Replace one-off hero editor with one studio route for global/pages/sections/collections.
2. Add custom fields for nested CTA objects, arrays, media objects, and section ordering.
3. Add section visibility toggles and reorder support.
4. Keep current password gate as baseline; isolate editor state from public routes.
5. Deliverable: single source editing UI for entire site.

## Phase 5: Full Page Migration to Editable Rendering
1. Refactor HomePage to render entirely from layered data models.
2. Refactor GalleryPage to render hero/categories/media CTA from editable collections.
3. Refactor ContactPage to render hero, office data, and form copy/options from editable config.
4. Keep SiteHeader/SiteFooter bound to global layer only.
5. Deliverable: no hardcoded marketing content in page components.

## Phase 6: Cleanup and Hardening
1. Remove dead modules and duplicate content paths after migration.
2. Consolidate data utilities and context loading paths.
3. Enforce strict typing for editor payloads and renderer contracts.
4. Split editor bundle from public bundle to reduce public payload.
5. Deliverable: maintainable, type-safe, performance-conscious architecture.

## Phase 7: Verification and Release Readiness
1. Automated checks: typecheck, build, schema validation, migration tests.
2. Manual checks: full draft/preview/publish flow across all pages.
3. Regression checks: lightbox, SEO updates, nav/footer consistency, contact flow.
4. Deliverable: production-ready editable site with tested workflows.

## Dependency Order
1. Phase 1 must complete first.
2. Phase 2 must complete before Phase 3.
3. Phase 3 must complete before full Phase 4 and Phase 5 rollout.
4. Phase 6 follows major page migration completion.
5. Phase 7 runs continuously and gates final release.

## Non-Goals in This Pass
- Multi-user role management backend
- External CMS integration
- Server-side auth redesign (can be added later)

## Key Risks and Mitigations
- Risk: malformed editor payloads can break pages.
	Mitigation: strict schema validation + fallback to last valid published JSON.
- Risk: editor dependencies bloat public bundles.
	Mitigation: route-level code splitting and editor-only imports.
- Risk: migration drift between old constants and new schema.
	Mitigation: one-time canonical mapping checklist and cutover cleanup.

## Definition of Done
1. Every visible content section is editable via Puck.
2. Gallery media add/remove/reorder is editable and persists.
3. Draft/preview/publish works and protects live content.
4. Public build passes cleanly with no Storyblok remnants.
5. Legacy content duplication is removed.
