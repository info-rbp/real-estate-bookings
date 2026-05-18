---
name: Professional SaaS Interface
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The brand personality of the design system is centered on **reliability, efficiency, and architectural clarity**. As a booking portal, the UI must instill immediate trust while reducing the cognitive load associated with scheduling and resource management. 

The design style follows a **Corporate Modern** aesthetic with **Minimalist** influences. It prioritizes high legibility, generous whitespace, and a card-based structure that organizes complex data into digestible units. The interface avoids unnecessary decorative elements, opting instead for functional ornamentation—such as subtle border-radius transitions and purposeful color hits—to guide the user through the booking funnel. The emotional response should be one of "calm control," ensuring that even high-density schedules feel manageable.

## Colors

The color palette is anchored by **Action Blue (#2563EB)**, used strategically for primary interactions, call-to-actions, and active states to maintain high visibility. **Deep Blue (#0F172A)** serves as the foundation for the secondary palette, typically applied to navigation sidebars, headers, and primary text to provide a sense of established authority and depth.

The neutral scale utilizes **Slate Grays** to define the UI scaffolding. Text should primarily use the deep blue for headlines to maintain contrast, while neutral slates are reserved for secondary metadata and borders. For status indicators—crucial in a booking context—the system employs a semantic set: Emerald for confirmed bookings, Amber for pending/warning states, and Rose for cancellations or errors. All color applications must adhere to WCAG AA accessibility standards against the white background.

## Typography

This design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic, utilitarian feel. The typographic hierarchy is "bottom-heavy," meaning significant attention is paid to the clarity of small-scale labels and body text, which are the primary vehicles for data in a booking portal.

Headlines use a tighter letter-spacing and heavier weights to create a strong visual anchor for sections and cards. For mobile views, display and large headline sizes are aggressively scaled down to prevent awkward line breaks in narrow containers. Body text is set with a generous line height (1.5x to 1.6x) to ensure schedules and lists remain readable during extended use.

## Layout & Spacing

The layout is built on a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. The design system employs a strict **8px spacing rhythm** to ensure mathematical harmony across all components.

**Key Layout Principles:**
- **Card-Based Containers:** All primary content (booking details, user profiles, calendars) resides in cards with 24px internal padding.
- **Responsive Margins:** Desktop layouts utilize a 40px outer margin to provide visual breathing room, while mobile devices scale this down to 16px to maximize screen real estate.
- **Vertical Rhythm:** Stacked elements should use `xl` (32px) spacing between major sections and `md` (16px) spacing between related items within a section.
- **Gutter Width:** A consistent 24px gutter is maintained between columns to prevent visual crowding in data-heavy views.

## Elevation & Depth

Visual hierarchy in the design system is established through a combination of **tonal layers** and **ambient shadows**. 

The background of the application uses a very light slate tint (#F8FAFC) to differentiate the canvas from the content. **Cards** and primary containers are set in pure white (#FFFFFF), elevated by a soft, diffused shadow. This shadow should have a large blur radius (12px-16px) and low opacity (approx 4-6%) using a Deep Blue tint rather than pure black, creating a "natural" lift that feels integrated into the UI.

Interactive elements like buttons or active cards utilize a slightly more pronounced shadow on hover to provide tactile feedback. High-priority modals or dropdowns use a secondary level of elevation with a 24px blur to sit clearly above the rest of the interface.

## Shapes

The shape language is defined by a **Rounded** aesthetic (Level 2), which balances professional rigor with modern softness. 

- **Standard Components:** Buttons, input fields, and chips use a 0.5rem (8px) radius.
- **Large Containers:** Cards, modals, and date-picker panels use a 1rem (16px) radius to create a distinct "object" feel.
- **Icons & Badges:** Small status badges or notification dots may use a fully rounded (pill-shaped) style to distinguish them from structural UI elements.

This consistent use of rounded corners softens the dense information architecture of a booking portal, making the software feel more approachable and less like a legacy spreadsheet.

## Components

### Buttons
- **Primary:** High-contrast Action Blue background with White text. Bold weight.
- **Secondary:** Deep Blue outline with Deep Blue text. Used for less urgent actions.
- **Ghost:** No background or border; Action Blue text. Reserved for tertiary actions like "Cancel" or "Clear Filter."

### Form Fields
- Inputs feature a 1px slate border that thickens and changes to Action Blue on focus.
- Labels are positioned above the field in `label-md` for maximum clarity.
- Placeholder text uses a light neutral slate.

### Status Badges
- Small, rounded-pill containers with low-opacity background tints (e.g., 10% Emerald) and high-opacity text (e.g., 100% Emerald).
- Used for "Confirmed," "Pending," and "Cancelled" booking statuses.

### Cards
- Pure white background, 16px border-radius, and the "Soft SaaS Shadow."
- Cards should have a structured header area with a 1px bottom border separating the title from the body content.

### Booking Specifics
- **Date Pickers:** Should use the 8px grid for day-cells, with the active date highlighted in Action Blue.
- **Availability Slots:** High-contrast interactive chips that toggle between a "Neutral/Available" state and an "Action Blue/Selected" state.