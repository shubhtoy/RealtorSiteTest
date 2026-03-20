# Implementation Plan: Production-Grade Polish

## Overview

Incremental production-readiness pass on the Baba Flats React + TypeScript + Vite SPA and Express backend. Tasks are ordered so that foundational changes (env, cleanup, reorganization) land first, followed by feature work (error boundaries, validation, security, a11y, SEO, 404, content robustness, Studio UI), then testing, TypeScript strictness, and build readiness. Each task builds on the previous ones.

## Tasks

- [x] 1. Remove hardcoded secrets and centralize environment configuration
  - [x] 1.1 Remove the `"shubh123"` fallback from `server/env.mjs`, add `validateRequiredEnv()` that exits with a descriptive error when `STUDIO_PASSWORD` is missing, and call it at server startup
    - _Requirements: 1.1, 1.3, 13.1, 13.4_
  - [x] 1.2 Remove the `"shubh123"` fallback from `src/config/env.ts` so `studioPassword` returns empty string when `VITE_STUDIO_PASSWORD` is unset
    - _Requirements: 1.2, 13.2_
  - [x] 1.3 In `StudioPage.tsx`, render a configuration error panel (instead of the login form) when `appEnv.studioPassword` is empty
    - _Requirements: 1.4_
  - [x] 1.4 Update `.env.example` with placeholder values and descriptive comments for every env var used by both client and server
    - _Requirements: 1.5, 13.3_

- [x] 2. Clean up dead code, backup files, and legacy artifacts
  - [x] 2.1 Delete all `.bak` files in `src/`, empty directories (`src/components/site/`, `src/components/storyblok/`), legacy backup stubs (`src/legacy/pages/HomePage-backup.tsx`), and duplicate component files (`src/components/Accordion.tsx`, `src/components/Tabs.tsx`)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 2.2 Remove `framer-motion` from `package.json` and update all imports across the codebase to use `motion/react` (the canonical motion library)
    - Files: `GalleryPage.tsx`, `ContactPage.tsx`, `SitePreloader.tsx`, `motion.tsx`, `Parallax.tsx`, `ParallaxNew.tsx`
    - _Requirements: 2.4, 8.3_
  - [x] 2.3 Consolidate parallax components — keep `Parallax.tsx` as canonical, delete `ParallaxNew.tsx` if unused or merge functionality
    - _Requirements: 2.2_

- [x] 3. Standardize component organization and file structure
  - [x] 3.1 Move `SiteHeader.tsx`, `SiteFooter.tsx`, `SitePreloader.tsx` to `src/components/layout/` and update all imports
    - _Requirements: 3.2_
  - [x] 3.2 Move `src/components/motion.tsx` to `src/lib/motion.ts` (or `.tsx` if JSX is used) and update all imports
    - _Requirements: 3.3_
  - [x] 3.3 Ensure all internal imports across `src/` use the `@/` path alias consistently — replace any remaining relative imports
    - _Requirements: 3.5_
  - [x] 3.4 Verify no top-level files in `src/components/` duplicate functionality in `src/components/ui/`
    - _Requirements: 3.4_

- [x] 4. Checkpoint — Ensure the app builds and runs after cleanup and reorganization
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Add error boundaries and fallback UI
  - [x] 5.1 Create `src/components/layout/RouteErrorBoundary.tsx` — a class component with `getDerivedStateFromError`, a user-friendly fallback message, and a Retry button that resets error state
    - _Requirements: 4.1, 4.2_
  - [x] 5.2 Wrap each route in `App.tsx` with `<RouteErrorBoundary>` and `<Suspense>` for lazy-loaded pages
    - _Requirements: 4.1_
  - [x] 5.3 In `editable-content-store.ts`, add `console.warn` when `parseDocument` returns null and the system falls back to defaults
    - _Requirements: 4.3_
  - [x] 5.4 Add JSON parse error middleware in `server/index.mjs` that catches `entity.parse.failed` errors and returns 400 with a descriptive JSON message
    - _Requirements: 4.4_

- [x] 6. Harden contact form with client-side validation
  - [x] 6.1 Create `src/lib/validation.ts` with `validators` (required, email, phone) and a `validateField` function
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 6.2 Update `ContactPage.tsx` to use field-level validation on blur and submit, display inline error messages, disable submit while in-flight, and show a toast when the API is unreachable
    - Wire `aria-describedby` from each input to its error message element
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.4, 7.5_
  - [ ]* 6.3 Write property tests for form validators in `src/lib/validation.test.ts`
    - **Property 3: Empty required field triggers validation error**
    - **Property 4: Invalid email format triggers validation error**
    - **Property 5: Invalid phone number triggers validation error**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 7. Improve server-side security and input validation
  - [x] 7.1 Add security headers middleware (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) to all API responses
    - _Requirements: 6.1_
  - [x] 7.2 Add `express-rate-limit` to `/api/contact/submit` — max 10 requests per minute per IP
    - _Requirements: 6.2_
  - [x] 7.3 Add explicit 413 handling for oversized uploads in the multer error callback
    - _Requirements: 6.3_
  - [x] 7.4 Enhance filename sanitization in multer storage to strip `../`, `..\\`, `/`, `\\` sequences
    - _Requirements: 6.4_
  - [x] 7.5 Ensure all `/api/content/*` routes use `requireStudioAuth` middleware; return 401 with JSON error body on missing/invalid `x-studio-password`
    - _Requirements: 6.5_
  - [x] 7.6 Wrap `readJson` in `content-store.mjs` with try/catch for corrupted JSON files; return 500 with descriptive error from route handlers
    - _Requirements: 6.6_
  - [ ]* 7.7 Write property tests for server security in `server/__tests__/security.test.mjs`
    - **Property 2: Malformed JSON request body returns 400**
    - **Property 6: Security headers present on all API responses**
    - **Property 7: Oversized upload returns 413**
    - **Property 8: Filename sanitization removes path traversal**
    - **Property 9: Unauthenticated content requests return 401**
    - **Property 10: Corrupted JSON file on disk returns 500**
    - **Validates: Requirements 4.4, 6.1, 6.3, 6.4, 6.5, 6.6**

- [x] 8. Checkpoint — Ensure all tests pass after security and validation work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Improve accessibility across all pages
  - [x] 9.1 Add a skip-to-content link as the first focusable element in `SiteHeader`, targeting `#main-content`
    - _Requirements: 7.1_
  - [x] 9.2 Add `aria-expanded` and `aria-controls` attributes to the mobile nav toggle button in `SiteHeader`
    - _Requirements: 7.2_
  - [x] 9.3 Make gallery image cards keyboard-accessible — use `<button>` elements or add `role="button"`, `tabIndex={0}`, and `onKeyDown` (Enter/Space) handlers
    - _Requirements: 7.3_
  - [x] 9.4 Associate all contact form inputs with labels via `htmlFor`/`id` and link error messages via `aria-describedby`
    - _Requirements: 7.4, 7.5_
  - [x] 9.5 Ensure `SitePreloader` has `role="status"` and `aria-live="polite"` attributes
    - _Requirements: 7.6_
  - [x] 9.6 Add `useReducedMotion()` checks in `SitePreloader`, `Reveal`, and other animation components to skip non-essential animations when `prefers-reduced-motion` is enabled
    - _Requirements: 8.6_

- [x] 10. Optimize performance and bundle size
  - [x] 10.1 Add `width`/`height` props or `aspect-ratio` CSS to `OptimizedImage` component to prevent CLS
    - _Requirements: 8.2_
  - [x] 10.2 Add LCP preload for the hero image — either a `<link rel="preload">` in `index.html` or `fetchpriority="high"` on the hero `<OptimizedImage>`
    - _Requirements: 8.4_
  - [x] 10.3 Verify header animation uses only `transform` and `opacity` (no layout-triggering properties)
    - _Requirements: 8.5_

- [x] 11. Improve SEO and meta tag management
  - [x] 11.1 Enhance `setPageMeta` in `src/lib/seo.ts` to update `og:title`, `og:description`, `og:image`, and `<link rel="canonical">` in addition to title and description
    - _Requirements: 9.4_
  - [x] 11.2 Call `setPageMeta` with unique values in each page component's `useEffect` (Home, Gallery, Contact, 404)
    - _Requirements: 9.1, 9.2, 9.3_
  - [x] 11.3 Create `public/robots.txt` allowing crawling of public pages and disallowing `/studio`
    - _Requirements: 9.5, 15.2_

- [x] 12. Add a proper 404 page
  - [x] 12.1 Create `src/pages/NotFoundPage.tsx` with a heading, message, link to homepage, and `setPageMeta` call setting the title to a page-not-found state
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 12.2 Replace the catch-all `<Navigate to="/" replace />` in `App.tsx` with `<NotFoundPage />` wrapped in `<RouteErrorBoundary>`
    - _Requirements: 10.1_

- [x] 13. Improve editable content system robustness
  - [x] 13.1 Wrap `localStorage.setItem` in `writeDraftDocument` with try/catch for `QuotaExceededError` — show a warning toast and preserve in-memory state
    - _Requirements: 11.1_
  - [x] 13.2 Add explicit `validateEditableSiteDocument` call in `readDraftDocument` with `console.warn` on validation failure, falling back to defaults
    - _Requirements: 11.2_
  - [x] 13.3 In `EditableContentContext.publish()`, persist the published document to both localStorage and the API server (`POST /api/content/draft` then `/api/content/publish`)
    - _Requirements: 11.3_
  - [x] 13.4 Add a `version` field check in `coerceEditableSiteDocument` — reject documents with version higher than `CURRENT_DOCUMENT_VERSION`
    - _Requirements: 11.4_
  - [ ]* 13.5 Write property tests for the content system in `src/lib/editable-content-store.test.ts`
    - **Property 1: Corrupted localStorage content falls back to defaults**
    - **Property 16: Document version rejection**
    - **Property 17: Editable content round-trip serialization**
    - **Validates: Requirements 4.3, 11.2, 11.4, 12.5**

- [x] 14. Checkpoint — Ensure all tests pass after feature work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Studio UI improvements
  - [x] 15.1 Redesign the Studio toolbar — group actions (canvas mode left, section tabs center, Revert/Publish right), add overflow menu for secondary actions, make section tabs a dropdown on mobile
    - _Requirements: Studio UI 12a, 12f_
  - [x] 15.2 Add loading/saving states — skeleton while Puck initializes, autosave pulse indicator, styled confirmation dialogs for Publish and Revert (replacing `window.confirm`)
    - _Requirements: Studio UI 12b_
  - [x] 15.3 Polish the login screen — center the card, add site logo, show loading state on unlock button, show config error when password is empty
    - _Requirements: Studio UI 12c, 1.4_
  - [x] 15.4 Add keyboard shortcuts (`Ctrl+S` to save draft, `Ctrl+Shift+P` to publish) and a "Preview in new tab" button
    - _Requirements: Studio UI 12d_
  - [x] 15.5 Add inline error states — error banner above canvas for validation failures, persistent warning bar with retry for API sync failures, inline error near import button on import failure
    - _Requirements: Studio UI 12e_

- [-] 16. Add automated testing foundation
  - [-] 16.1 Install `fast-check` and `@fast-check/vitest` as dev dependencies
    - _Requirements: 12.5_
  - [~] 16.2 Write unit tests for `editable-content-store` in `src/lib/editable-content-store.test.ts` covering read, write, publish, and reset operations
    - _Requirements: 12.1_
  - [~] 16.3 Write unit tests for `resolveAppHref` in `src/lib/utils.test.ts` covering absolute URLs, relative paths, hash links, tel/mailto, and base path handling
    - _Requirements: 12.2_
  - [~] 16.4 Write unit tests for `setPageMeta` in `src/lib/seo.test.ts` verifying title, description, canonical, and OG tag updates
    - _Requirements: 12.3_
  - [ ]* 16.5 Write property test for `setPageMeta` in `src/lib/seo.test.ts`
    - **Property 19: setPageMeta updates all meta tags**
    - **Validates: Requirements 9.4**
  - [~] 16.6 Write integration tests for `/api/contact/submit` in `server/__tests__/contact-submit.test.mjs` covering valid submissions, missing fields, and malformed payloads
    - _Requirements: 12.4_
  - [ ]* 16.7 Write property test for reduced motion behavior
    - **Property 14: Reduced motion disables non-essential animations**
    - **Validates: Requirements 8.6**

- [x] 17. Improve TypeScript strictness and type safety
  - [x] 17.1 Replace all `any` type annotations in `StudioPage.tsx` Puck config with specific typed prop interfaces (e.g., `GlobalBrandProps`, `HomeHeroProps`)
    - _Requirements: 14.2_
  - [x] 17.2 Add explicit types to all API server route handler parameters — no implicit `any` for `req`/`res`
    - _Requirements: 14.3_
  - [x] 17.3 Audit and remove unjustified `as any` / `as unknown` casts; add justification comments where they remain necessary
    - _Requirements: 14.4_
  - [x] 17.4 Ensure the site compiles with zero TypeScript errors under strict configuration
    - _Requirements: 14.1_

- [x] 18. Add production build and deployment readiness
  - [x] 18.1 Fix `package.json` — remove placeholder URLs (`your-username`) from repository, bugs, and homepage fields
    - _Requirements: 15.5_
  - [x] 18.2 Verify `public/favicon.ico` exists or add a favicon configuration
    - _Requirements: 15.3_
  - [x] 18.3 Add production error handler in server — return generic "Internal server error" when `NODE_ENV=production`, include details only in development
    - _Requirements: 15.4_
  - [ ]* 18.4 Write property test for production error handling in `server/__tests__/security.test.mjs`
    - **Property 18: Production mode hides error details**
    - **Validates: Requirements 15.4**
  - [x] 18.5 Verify `npm run build` completes with zero errors and zero warnings
    - _Requirements: 15.1_

- [x] 19. Final checkpoint — Ensure all tests pass and the build is clean
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 4, 8, 14, and 19 ensure incremental validation
- Property tests use `fast-check` with `vitest` — minimum 100 runs per property
- The design uses TypeScript for the client and JavaScript (ESM) for the server
