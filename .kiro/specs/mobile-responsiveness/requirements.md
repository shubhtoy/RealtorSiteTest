# Requirements Document

## Introduction

Improve the mobile responsiveness of the Baba Flats website — a React + TypeScript + Vite SPA styled with Tailwind CSS. The site currently has partial responsive support (some `md:` breakpoints, a mobile nav bar, and a mobile CTA bar), but several pages and UI components need a thorough mobile pass to ensure a polished experience on phones and small tablets (320px–768px viewports). This includes fixing layout overflow issues, improving touch targets, adapting complex desktop-only UI patterns for small screens, and ensuring text and spacing scale appropriately.

## Glossary

- **Site**: The Baba Flats single-page application served at the root URL
- **Mobile_Viewport**: A browser viewport with a width between 320px and 767px
- **Tablet_Viewport**: A browser viewport with a width between 768px and 1023px
- **Header**: The `SiteHeader` component containing the site logo, navigation links, and CTA button
- **Footer**: The `SiteFooter` component containing brand info, quick links, and contact details
- **HomePage**: The landing page containing hero, stats, residences, unit explorer, amenities, why section, neighborhood, testimonials, FAQ, map, and final CTA sections
- **GalleryPage**: The page displaying filterable photo gallery with lightbox
- **ContactPage**: The page containing the hero, tour request form, and embedded map
- **NotFoundPage**: The 404 error page
- **HeroParallax**: The 3D parallax image rail component used in the HomePage hero section
- **StickyScroll**: The sticky scroll reveal component used for the amenities section
- **FocusCards**: The hover-interactive card grid used for the residences section
- **InfiniteMovingCards**: The auto-scrolling testimonial carousel component
- **Touch_Target**: An interactive element (button, link, form control) that a user taps on a touchscreen device
- **Mobile_CTA_Bar**: The fixed bottom bar on mobile with primary and secondary action buttons

## Requirements

### Requirement 1: Mobile Header Navigation Usability

**User Story:** As a mobile visitor, I want the navigation to be easy to use on small screens, so that I can quickly navigate between pages without frustration.

#### Acceptance Criteria

1. WHILE the Mobile_Viewport is active, THE Header SHALL display navigation links as pill-shaped buttons that wrap naturally without horizontal overflow.
2. WHILE the Mobile_Viewport is active, THE Header SHALL render all Touch_Target elements (nav links, CTA button) with a minimum tap area of 44×44 CSS pixels.
3. WHILE the Mobile_Viewport is active, THE Header SHALL keep the CTA button fully visible without text truncation on viewports as narrow as 320px.
4. IF the Header navigation links exceed the available width on Mobile_Viewport, THEN THE Header SHALL wrap links to a second row rather than causing horizontal scroll.

### Requirement 2: Mobile-Optimized Hero Section

**User Story:** As a mobile visitor, I want the hero section to look polished and load quickly on my phone, so that I get a strong first impression of the property.

#### Acceptance Criteria

1. WHILE the Mobile_Viewport is active, THE HomePage hero card SHALL use reduced padding (16px) and appropriately scaled typography (heading at 1.75rem minimum, body at 0.875rem minimum).
2. WHILE the Mobile_Viewport is active, THE HeroParallax SHALL render with a reduced height that prevents excessive scrolling past empty space.
3. WHILE the Mobile_Viewport is active, THE HeroParallax card items SHALL use widths that fit within the viewport without horizontal overflow.
4. WHILE the Mobile_Viewport is active, THE ContactPage hero section SHALL stack the text content and leasing desk card vertically with appropriate spacing.

### Requirement 3: Responsive Grid Layouts

**User Story:** As a mobile visitor, I want content grids to stack into a single column on my phone, so that I can read and browse content without horizontal scrolling.

#### Acceptance Criteria

1. WHILE the Mobile_Viewport is active, THE HomePage unit explorer grid SHALL display cards in a single column layout.
2. WHILE the Mobile_Viewport is active, THE Footer grid SHALL stack all three columns (brand, quick links, contact) vertically.
3. WHILE the Mobile_Viewport is active, THE HomePage FAQ section grid (sidebar + accordion) SHALL stack vertically with the help card above the accordion.
4. WHILE the Mobile_Viewport is active, THE HomePage map section grid (info card + map iframe) SHALL stack vertically.
5. WHILE the Mobile_Viewport is active, THE ContactPage form section grid (info card + form) SHALL stack vertically.
6. WHILE the Mobile_Viewport is active, THE GalleryPage photo grid SHALL display images in a single column layout.

### Requirement 4: Touch-Friendly Interactive Elements

**User Story:** As a mobile visitor, I want buttons, links, and form controls to be easy to tap, so that I can interact with the site without accidentally tapping the wrong element.

#### Acceptance Criteria

1. THE Site SHALL render all interactive Touch_Target elements with a minimum size of 44×44 CSS pixels on Mobile_Viewport.
2. WHILE the Mobile_Viewport is active, THE ContactPage form inputs and select controls SHALL have a minimum height of 44px.
3. WHILE the Mobile_Viewport is active, THE ContactPage submit button SHALL span the full width of the form container.
4. WHILE the Mobile_Viewport is active, THE GalleryPage category filter buttons SHALL have sufficient padding for comfortable tapping (minimum 44px tall tap area).
5. WHILE the Mobile_Viewport is active, THE GalleryPage gallery image figures SHALL have a minimum tap area of 44×44 CSS pixels for opening the lightbox.

### Requirement 5: Mobile-Adapted Complex UI Components

**User Story:** As a mobile visitor, I want complex interactive components (sticky scroll, parallax, focus cards) to degrade gracefully on small screens, so that I still get a good experience without broken layouts.

#### Acceptance Criteria

1. WHILE the Mobile_Viewport is active, THE StickyScroll component SHALL display the media preview above the text content in a static (non-sticky) layout.
2. WHILE the Mobile_Viewport is active, THE FocusCards SHALL display cards in a single column with a reduced height (minimum 16rem) that fits the viewport.
3. WHILE the Mobile_Viewport is active, THE InfiniteMovingCards SHALL render testimonial cards at a maximum width of 85vw to prevent horizontal overflow.
4. WHILE the Mobile_Viewport is active, THE HomePage "Why Choose" section SHALL stack the sticky sidebar and card list vertically.
5. WHILE the Mobile_Viewport is active, THE HomePage neighborhood section SHALL stack the sticky sidebar and highlights list vertically.

### Requirement 6: Mobile Typography and Spacing

**User Story:** As a mobile visitor, I want text to be readable and spacing to feel balanced on my phone, so that the site feels intentionally designed for mobile.

#### Acceptance Criteria

1. WHILE the Mobile_Viewport is active, THE Site SHALL render body text at a minimum font size of 14px (0.875rem).
2. WHILE the Mobile_Viewport is active, THE Site SHALL render section headings at sizes that scale down proportionally from desktop (minimum 1.5rem for h2 elements).
3. WHILE the Mobile_Viewport is active, THE Site SHALL use reduced vertical section padding (py-12 equivalent, 3rem) compared to desktop (py-16 to py-24).
4. WHILE the Mobile_Viewport is active, THE Site SHALL maintain a consistent horizontal content margin using the existing `w-[min(1140px,92vw)]` pattern.

### Requirement 7: Mobile Bottom CTA Bar

**User Story:** As a mobile visitor, I want the fixed bottom action bar to not overlap page content, so that I can read the full page without the bar covering important information.

#### Acceptance Criteria

1. WHILE the Mobile_CTA_Bar is visible on Mobile_Viewport, THE HomePage main content area SHALL include bottom padding sufficient to prevent the bar from overlapping the last section of content.
2. WHILE the Mobile_Viewport is active, THE Mobile_CTA_Bar buttons SHALL each have a minimum height of 44px for comfortable tapping.
3. THE Mobile_CTA_Bar SHALL only be visible on Mobile_Viewport and SHALL be hidden on viewports 768px and wider.

### Requirement 8: Prevent Horizontal Overflow on Mobile

**User Story:** As a mobile visitor, I want the page to never scroll horizontally, so that I have a smooth vertical-only scrolling experience.

#### Acceptance Criteria

1. THE Site SHALL prevent horizontal scrollbar appearance on Mobile_Viewport across all pages (HomePage, GalleryPage, ContactPage, NotFoundPage).
2. WHILE the Mobile_Viewport is active, THE HeroParallax component SHALL constrain all animated rows within the viewport width using `overflow-hidden` on the container.
3. WHILE the Mobile_Viewport is active, THE InfiniteMovingCards component SHALL constrain the scrolling container within the viewport width.
4. IF any element within a page section exceeds the viewport width on Mobile_Viewport, THEN THE Site SHALL clip the overflow rather than introducing a horizontal scrollbar.

### Requirement 9: Mobile-Optimized Images and Media

**User Story:** As a mobile visitor, I want images to load at appropriate sizes for my screen, so that pages load quickly and images look sharp.

#### Acceptance Criteria

1. THE Site SHALL provide responsive `sizes` attributes on all `OptimizedImage` components that include a mobile-appropriate size hint (e.g., `100vw` for full-width mobile images).
2. WHILE the Mobile_Viewport is active, THE GalleryPage gallery images SHALL render at a height that shows meaningful content (minimum 14rem).
3. WHILE the Mobile_Viewport is active, THE ContactPage hero image SHALL cover the full section area without distortion using `object-cover`.
4. WHILE the Mobile_Viewport is active, THE HomePage unit explorer card images SHALL maintain a consistent aspect ratio across all cards.

### Requirement 10: Accessible Mobile Experience

**User Story:** As a mobile visitor using assistive technology, I want the site to remain accessible on small screens, so that I can navigate and interact with all content.

#### Acceptance Criteria

1. THE Header skip-to-content link SHALL remain functional and visible on focus on Mobile_Viewport.
2. WHILE the Mobile_Viewport is active, THE Site SHALL maintain a logical focus order that follows the visual layout (top to bottom, left to right).
3. WHILE the Mobile_Viewport is active, THE ContactPage form fields SHALL maintain their associated labels and error messages in a visible and programmatically associated manner.
4. WHILE the Mobile_Viewport is active, THE GalleryPage gallery figures SHALL maintain their `role="button"` and keyboard event handlers for lightbox activation.
