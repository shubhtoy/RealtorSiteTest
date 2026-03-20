# Implementation Plan: Mobile Responsiveness

## Overview

CSS/Tailwind-only pass across existing components and pages to ensure a polished mobile experience on 320px–767px viewports. No new dependencies or architectural changes. Each task modifies 1–2 files and builds incrementally toward full mobile coverage.

## Tasks

- [x] 1. Mobile-optimize layout components (Header + Footer)
  - [x] 1.1 Update SiteHeader mobile tap targets and overflow handling
    - Increase nav link padding to `py-2.5` for 44px minimum tap height
    - Add `min-h-[44px]` to nav links and CTA button
    - Add `whitespace-nowrap` to CTA button to prevent truncation at 320px
    - Ensure `flex-wrap` on nav link container to wrap to second row instead of horizontal scroll
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 10.1_

  - [x] 1.2 Verify SiteFooter mobile stacking
    - Confirm footer grid stacks to single column on mobile via existing `md:grid-cols-3`
    - Adjust gap/padding if needed for mobile spacing
    - _Requirements: 3.2_

- [x] 2. Mobile-optimize HomePage hero and HeroParallax
  - [x] 2.1 Update HeroParallax component for mobile containment
    - Add `overflow-hidden` to the outer container div to prevent horizontal scroll from 3D parallax rows
    - Reduce mobile height: `h-[70vh] md:h-[128vh]` to prevent excessive empty scrolling
    - Update card item widths: `w-[80vw] sm:w-[17.5rem] md:w-[24rem]` to fit mobile viewport
    - File: `src/components/ui/hero-parallax.tsx`
    - _Requirements: 2.2, 2.3, 8.2_

  - [x] 2.2 Update HomePage hero card and bottom padding
    - Reduce hero card padding on mobile: `p-4 md:p-8`
    - Add `pb-24 md:pb-0` to main content area to prevent Mobile CTA bar overlap
    - Verify hero heading typography meets 1.75rem minimum on mobile
    - File: `src/pages/HomePage.tsx`
    - _Requirements: 2.1, 7.1, 6.1, 6.2_

  - [ ]* 2.3 Write property test for no horizontal overflow (Property 2)
    - **Property 2: No horizontal overflow on mobile**
    - Render each page at mobile viewport width and assert `scrollWidth === clientWidth`
    - **Validates: Requirements 8.1, 8.4**

- [x] 3. Mobile-optimize HomePage sections (spacing, grids, typography)
  - [x] 3.1 Update HomePage section spacing and typography
    - Apply `py-12 md:py-24` (or equivalent reduced mobile padding) to major sections
    - Verify section headings use minimum 1.5rem on mobile
    - Verify body text meets 14px minimum on mobile
    - File: `src/pages/HomePage.tsx`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 3.2 Verify HomePage grid sections stack on mobile
    - Confirm unit explorer grid, FAQ section, map section, Why Choose section, and neighborhood section all stack to single column on mobile
    - Fix any grids that don't collapse properly
    - File: `src/pages/HomePage.tsx`
    - _Requirements: 3.1, 3.3, 3.4, 5.4, 5.5_

  - [ ]* 3.3 Write property test for single-column grid stacking (Property 3)
    - **Property 3: Multi-column grids stack to single column on mobile**
    - For grid containers with `md:grid-cols-*`, verify all children share same horizontal offset at mobile width
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

- [x] 4. Checkpoint - Verify header, footer, hero, and homepage sections
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Mobile-optimize complex UI components
  - [x] 5.1 Update FocusCards for mobile layout
    - Change card height to `h-64 md:h-[30rem]` (16rem minimum on mobile)
    - Verify single-column layout on mobile via existing `grid-cols-1 md:grid-cols-3`
    - File: `src/components/ui/focus-cards.tsx`
    - _Requirements: 5.2_

  - [x] 5.2 Update InfiniteMovingCards for mobile width constraint
    - Change card width from `w-[420px]` to `w-[85vw] sm:w-[420px]` to prevent horizontal overflow
    - Verify container has `overflow-hidden`
    - File: `src/components/ui/infinite-moving-cards.tsx`
    - _Requirements: 5.3, 8.3_

  - [x] 5.3 Verify StickyScroll mobile fallback
    - Confirm static media preview is shown on mobile via `md:hidden` and sticky media is hidden via `hidden md:block`
    - Verify mobile preview height is appropriate (minimum 14rem)
    - File: `src/components/ui/sticky-scroll-reveal.tsx`
    - _Requirements: 5.1_

  - [ ]* 5.4 Write property tests for UI component mobile constraints
    - **Property 7: InfiniteMovingCards card width ≤ 85vw on mobile**
    - **Validates: Requirements 5.3**
    - **Property 8: FocusCards minimum card height ≥ 16rem on mobile**
    - **Validates: Requirements 5.2**

- [x] 6. Mobile-optimize ContactPage
  - [x] 6.1 Update ContactPage hero, form, and touch targets
    - Verify hero section stacks text and leasing desk card vertically on mobile
    - Add `min-h-[44px]` (`h-11`) to form inputs and select controls
    - Ensure submit button is full-width on mobile
    - Verify form grid stacks to single column on mobile
    - File: `src/pages/ContactPage.tsx`
    - _Requirements: 2.4, 3.5, 4.2, 4.3, 9.3, 10.3_

  - [ ]* 6.2 Write property test for form control minimum height (Property 6)
    - **Property 6: Form controls minimum height ≥ 44px on mobile**
    - Render ContactPage form at mobile viewport and assert input/select/textarea heights
    - **Validates: Requirements 4.2**

- [x] 7. Mobile-optimize GalleryPage
  - [x] 7.1 Update GalleryPage filter buttons and grid for mobile
    - Increase filter button padding to `py-2.5 sm:py-2` for 44px tap targets
    - Verify photo grid uses single column on mobile
    - Verify gallery image height meets 14rem minimum on mobile
    - Ensure gallery figures maintain `role="button"` and keyboard handlers
    - File: `src/pages/GalleryPage.tsx`
    - _Requirements: 3.6, 4.4, 4.5, 9.2, 10.4_

  - [ ]* 7.2 Write property test for gallery image minimum height (Property 9)
    - **Property 9: Gallery images minimum height ≥ 14rem on mobile**
    - **Validates: Requirements 9.2**

- [x] 8. Mobile-optimize NotFoundPage and global overflow prevention
  - [x] 8.1 Update NotFoundPage and verify global overflow containment
    - Ensure NotFoundPage has no horizontal overflow at 320px
    - Verify all pages use `overflow-hidden` where needed to clip overflowing content
    - Files: `src/pages/NotFoundPage.tsx`, root layout if applicable
    - _Requirements: 8.1, 8.4_

- [x] 9. Mobile image optimization pass
  - [x] 9.1 Add responsive sizes attributes to OptimizedImage usages
    - Audit all `OptimizedImage` component usages across pages
    - Add or update `sizes` attributes to include mobile-appropriate viewport-relative hints (e.g., `(max-width: 768px) 100vw, ...`)
    - Verify unit explorer card images maintain consistent aspect ratio on mobile
    - Files: `src/pages/HomePage.tsx`, `src/pages/GalleryPage.tsx`, `src/pages/ContactPage.tsx`
    - _Requirements: 9.1, 9.4_

  - [ ]* 9.2 Write property test for OptimizedImage sizes attribute (Property 11)
    - **Property 11: OptimizedImage sizes attribute includes mobile-appropriate vw hint**
    - **Validates: Requirements 9.1**

- [x] 10. Mobile touch target and accessibility audit
  - [x] 10.1 Audit and fix touch targets across all pages
    - Verify all interactive elements meet 44×44px minimum on mobile
    - Ensure Mobile CTA bar buttons have `min-h-[44px]`
    - Verify skip-to-content link remains functional and visible on focus
    - Verify logical focus order follows visual layout on mobile
    - Files: `src/pages/HomePage.tsx`, `src/components/layout/SiteHeader.tsx`
    - _Requirements: 4.1, 7.2, 7.3, 10.1, 10.2_

  - [ ]* 10.2 Write property test for touch target minimum size (Property 1)
    - **Property 1: All interactive elements ≥ 44×44px on mobile**
    - **Validates: Requirements 1.2, 4.1, 4.4, 4.5, 7.2**

  - [ ]* 10.3 Write property tests for accessibility attributes (Properties 12, 13)
    - **Property 12: Form fields maintain label associations on mobile**
    - **Validates: Requirements 10.3**
    - **Property 13: Gallery figures maintain role="button" and keyboard handlers**
    - **Validates: Requirements 10.4**

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All changes are CSS/Tailwind class updates — no new dependencies or architectural changes
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- The existing `w-[min(1140px,92vw)]` container pattern is preserved throughout
