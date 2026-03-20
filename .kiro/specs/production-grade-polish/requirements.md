# Requirements Document

## Introduction

This document defines the requirements for a comprehensive production-grade polish of the Baba Flats apartment website. The site is a React + TypeScript + Vite application with an Express backend, featuring a CMS-like studio editor (Puck), editable content system, contact form with SMTP/webhook integrations, gallery with lightbox, and a multi-section homepage. The polish covers security hardening, code structure cleanup, performance optimization, accessibility compliance, error handling, and overall codebase hygiene to bring the project to production readiness.

## Glossary

- **Site**: The Baba Flats apartment website frontend (React SPA)
- **API_Server**: The Express.js backend serving API endpoints at `/api/*`
- **Studio**: The Puck-based visual content editor at `/studio`
- **Content_Store**: The server-side JSON file persistence layer for draft/published content
- **Editable_Content_System**: The client-side localStorage-based content management with draft/publish workflow
- **OptimizedImage_Component**: The `<picture>` element wrapper that serves AVIF/WebP responsive images
- **Contact_Form**: The tour request form on the Contact page
- **Preloader**: The animated loading screen shown on initial page load
- **Gallery_Lightbox**: The photo viewer with zoom, thumbnails, and captions on the Gallery page
- **SiteHeader**: The sticky navigation header component
- **SiteFooter**: The footer component with brand, links, and contact info

## Requirements

### Requirement 1: Remove Hardcoded Secrets and Enforce Secure Defaults

**User Story:** As a developer, I want all secrets removed from source code and replaced with environment-only configuration, so that credentials are never committed to version control.

#### Acceptance Criteria

1. THE API_Server SHALL read the studio password exclusively from environment variables with no hardcoded fallback value in source code
2. THE Site SHALL read the studio password exclusively from environment variables with no hardcoded fallback value in source code
3. WHEN no studio password environment variable is set, THE API_Server SHALL refuse to start and log a descriptive error message
4. WHEN no studio password environment variable is set, THE Site SHALL display a configuration error in the Studio instead of falling back to a default password
5. THE `.env.example` file SHALL contain placeholder values (e.g., `STUDIO_PASSWORD=changeme`) instead of real credentials

### Requirement 2: Clean Up Dead Code, Backup Files, and Legacy Artifacts

**User Story:** As a developer, I want all dead code, backup files, and legacy stubs removed, so that the codebase is clean and maintainable.

#### Acceptance Criteria

1. THE Site SHALL contain no `.bak` files in the `src/` directory tree
2. THE Site SHALL contain no legacy backup stubs (e.g., `src/legacy/pages/HomePage-backup.tsx`) that serve no functional purpose
3. THE Site SHALL contain no empty directories (e.g., `src/components/site/`, `src/components/storyblok/`) that have no files
4. THE Site SHALL not import or reference the `framer-motion` package when the `motion` package is already used as the canonical motion library
5. WHEN a UI component file exists in `src/components/ui/` but is not imported by any other module, THE Site build pipeline SHALL flag the unused component during linting

### Requirement 3: Standardize Component Organization and File Structure

**User Story:** As a developer, I want a consistent and predictable file structure, so that I can navigate and maintain the codebase efficiently.

#### Acceptance Criteria

1. THE Site SHALL organize page-level components exclusively in `src/pages/`
2. THE Site SHALL organize shared layout components (SiteHeader, SiteFooter, SitePreloader) in a dedicated `src/components/layout/` directory
3. THE Site SHALL organize motion/animation utilities (Reveal, StaggerContainer, StaggerItem) in `src/components/motion.tsx` or a dedicated `src/lib/motion.ts` module
4. THE Site SHALL not contain top-level component files in `src/components/` that duplicate functionality available in `src/components/ui/` (e.g., `Accordion.tsx` vs `ui/accordion.tsx`, `Tabs.tsx` vs `ui/tabs.tsx`)
5. THE Site SHALL use consistent import path aliases (`@/`) for all internal imports across all source files

### Requirement 4: Add Comprehensive Error Boundaries and Fallback UI

**User Story:** As a user, I want the site to gracefully handle runtime errors, so that a single component failure does not crash the entire page.

#### Acceptance Criteria

1. THE Site SHALL wrap each route-level page component in an error boundary that catches rendering errors
2. WHEN a rendering error occurs inside a route-level error boundary, THE Site SHALL display a user-friendly fallback message with a retry action
3. WHEN the Editable_Content_System fails to parse stored content from localStorage, THE Site SHALL fall back to the default content document and log a warning to the console
4. IF the API_Server receives a malformed JSON request body, THEN THE API_Server SHALL return a 400 status with a descriptive error message instead of an unhandled exception

### Requirement 5: Harden the Contact Form with Client-Side Validation

**User Story:** As a user, I want clear validation feedback on the contact form before submission, so that I can correct errors without waiting for a server round-trip.

#### Acceptance Criteria

1. WHEN the user submits the Contact_Form with an empty required field, THE Contact_Form SHALL display an inline validation message adjacent to the empty field
2. WHEN the user enters an email address that does not match a standard email pattern, THE Contact_Form SHALL display an inline validation message before submission
3. WHEN the user enters a phone number that does not contain at least 10 digits, THE Contact_Form SHALL display an inline validation message before submission
4. THE Contact_Form SHALL disable the submit button while a submission request is in-flight to prevent duplicate submissions
5. WHEN the API_Server is unreachable, THE Contact_Form SHALL display a toast notification indicating the server is unavailable and suggest retrying

### Requirement 6: Improve Server-Side Security and Input Validation

**User Story:** As a developer, I want the API server to enforce security best practices, so that the application is resilient against common attack vectors.

#### Acceptance Criteria

1. THE API_Server SHALL set security-related HTTP headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) on all responses
2. THE API_Server SHALL enforce a rate limit on the `/api/contact/submit` endpoint of no more than 10 requests per minute per IP address
3. THE API_Server SHALL validate that uploaded files via `/api/assets/upload` do not exceed the configured size limit and return a 413 status when exceeded
4. THE API_Server SHALL sanitize filenames during upload to remove path traversal sequences (e.g., `../`)
5. THE API_Server SHALL reject requests to `/api/content/*` endpoints that lack a valid `x-studio-password` header with a 401 status and a JSON error body
6. IF the Content_Store encounters a corrupted JSON file on disk, THEN THE API_Server SHALL return a 500 status with a descriptive error message instead of crashing

### Requirement 7: Improve Accessibility Across All Pages

**User Story:** As a user with assistive technology, I want the site to follow accessibility best practices, so that I can navigate and interact with all content.

#### Acceptance Criteria

1. THE SiteHeader SHALL include a skip-to-content link as the first focusable element that navigates to the main content area
2. THE SiteHeader mobile navigation SHALL be toggled via a button with `aria-expanded` and `aria-controls` attributes
3. THE Gallery_Lightbox trigger elements (gallery image cards) SHALL be keyboard-accessible using `<button>` elements or elements with `role="button"` and `tabIndex={0}`
4. THE Contact_Form SHALL associate each input with its label using `htmlFor` and `id` attributes
5. WHEN a form validation error occurs, THE Contact_Form SHALL programmatically associate the error message with the input using `aria-describedby`
6. THE Preloader SHALL use `role="status"` and `aria-live="polite"` to announce loading state to screen readers
7. THE Site SHALL maintain a minimum color contrast ratio of 4.5:1 for all body text against its background

### Requirement 8: Optimize Performance and Bundle Size

**User Story:** As a user, I want the site to load quickly on all devices, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. THE Site SHALL lazy-load all route-level page components using `React.lazy` and `Suspense`
2. THE OptimizedImage_Component SHALL include `width` and `height` attributes or explicit aspect-ratio styling to prevent cumulative layout shift
3. THE Site SHALL not load both `framer-motion` and `motion` packages simultaneously; only one motion library SHALL be included in the production bundle
4. THE Site SHALL preload the LCP (Largest Contentful Paint) hero image on the HomePage using a `<link rel="preload">` tag or `loading="eager"` with `fetchpriority="high"`
5. THE SiteHeader animation SHALL not cause layout shift by using `transform` and `opacity` properties exclusively for the entry animation
6. WHEN the user has `prefers-reduced-motion` enabled, THE Site SHALL disable all non-essential animations including the Preloader entrance animation

### Requirement 9: Improve SEO and Meta Tag Management

**User Story:** As a site owner, I want proper SEO meta tags on every page, so that search engines can index the site correctly.

#### Acceptance Criteria

1. THE Site SHALL set a unique `<title>` and `<meta name="description">` for each route (Home, Gallery, Contact)
2. THE Site SHALL set Open Graph `og:title`, `og:description`, and `og:image` meta tags for each route
3. THE Site SHALL include a canonical `<link rel="canonical">` tag on each route pointing to the correct URL
4. THE `setPageMeta` utility SHALL update Open Graph meta tags in addition to the title and description
5. THE Site SHALL include a `robots.txt` file in the `public/` directory that allows search engine crawling of public pages and disallows `/studio`

### Requirement 10: Add a Proper 404 Page

**User Story:** As a user, I want to see a helpful page when I navigate to a non-existent URL, so that I can find my way back to valid content.

#### Acceptance Criteria

1. WHEN a user navigates to an undefined route, THE Site SHALL display a dedicated 404 page instead of silently redirecting to the homepage
2. THE 404 page SHALL include a heading indicating the page was not found, a brief message, and a link back to the homepage
3. THE 404 page SHALL set the document title to indicate a page-not-found state

### Requirement 11: Improve the Editable Content System Robustness

**User Story:** As a studio editor, I want the content system to handle edge cases gracefully, so that I do not lose work or encounter broken states.

#### Acceptance Criteria

1. WHEN the Editable_Content_System writes to localStorage and the storage quota is exceeded, THE Editable_Content_System SHALL display a warning toast and preserve the in-memory draft state
2. THE Editable_Content_System SHALL validate the document structure on read using the existing `validateEditableSiteDocument` function and fall back to defaults on validation failure
3. WHEN the Studio publishes content, THE Editable_Content_System SHALL persist the published document to both localStorage and the API_Server (when available)
4. THE Editable_Content_System SHALL include a `version` field in the document and reject documents with a version higher than the current application version

### Requirement 12: Add Automated Testing Foundation

**User Story:** As a developer, I want a baseline of automated tests, so that I can refactor with confidence and catch regressions early.

#### Acceptance Criteria

1. THE Site SHALL include unit tests for the `editable-content-store` module covering read, write, publish, and reset operations
2. THE Site SHALL include unit tests for the `resolveAppHref` utility covering absolute URLs, relative paths, hash links, tel/mailto links, and base path handling
3. THE Site SHALL include unit tests for the `setPageMeta` utility verifying that title, description, and canonical tags are updated correctly
4. THE API_Server SHALL include integration tests for the `/api/contact/submit` endpoint covering valid submissions, missing fields, and malformed payloads
5. THE Site SHALL include a round-trip property test for the Editable_Content_System: serializing a document to JSON and parsing it back SHALL produce an equivalent document

### Requirement 13: Standardize Environment Configuration

**User Story:** As a developer deploying the site, I want a single source of truth for environment configuration, so that I can configure the application consistently across environments.

#### Acceptance Criteria

1. THE API_Server SHALL use a single `env.mjs` module as the sole source for all environment variable access
2. THE Site SHALL use a single `config/env.ts` module as the sole source for all client-side environment variable access
3. THE `.env.example` file SHALL document every environment variable used by both the Site and API_Server with descriptive comments
4. WHEN a required environment variable is missing, THE API_Server SHALL log a clear startup error identifying the missing variable

### Requirement 14: Improve TypeScript Strictness and Type Safety

**User Story:** As a developer, I want strict type safety across the codebase, so that type errors are caught at compile time rather than runtime.

#### Acceptance Criteria

1. THE Site SHALL compile with zero TypeScript errors under the existing strict configuration
2. THE StudioPage component SHALL replace all `any` type annotations with specific types derived from the Puck component prop interfaces
3. THE API_Server route handlers SHALL not use implicit `any` for request/response parameters
4. THE Site SHALL not use type assertions (`as any`, `as unknown`) except where explicitly justified with a comment explaining the necessity

### Requirement 15: Add Production Build and Deployment Readiness

**User Story:** As a developer, I want the build pipeline to produce optimized, deployment-ready artifacts, so that the site performs well in production.

#### Acceptance Criteria

1. THE Site build (`npm run build`) SHALL complete with zero errors and zero warnings
2. THE Site SHALL include a `public/robots.txt` file with appropriate crawl directives
3. THE Site SHALL include a `public/favicon.ico` or equivalent favicon configuration
4. THE API_Server SHALL support a `NODE_ENV=production` mode that disables verbose error details in API responses
5. THE `package.json` SHALL not contain placeholder URLs (e.g., `your-username`) in the repository, bugs, or homepage fields
