---
name: Artisanal Canvas
colors:
  surface: '#fff8f6'
  surface-dim: '#edd5cf'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ed'
  surface-container: '#ffe9e5'
  surface-container-high: '#fce3dd'
  surface-container-highest: '#f6ddd8'
  on-surface: '#261815'
  on-surface-variant: '#59413c'
  inverse-surface: '#3c2d29'
  inverse-on-surface: '#ffede9'
  outline: '#8d716a'
  outline-variant: '#e1bfb8'
  surface-tint: '#ae3115'
  primary: '#ae3115'
  on-primary: '#ffffff'
  primary-container: '#ff6b4a'
  on-primary-container: '#661000'
  inverse-primary: '#ffb4a3'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#84f6e6'
  on-secondary-container: '#007167'
  tertiary: '#7c5800'
  on-tertiary: '#ffffff'
  tertiary-container: '#c69118'
  on-tertiary-container: '#442e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0600'
  on-primary-fixed-variant: '#8c1900'
  secondary-fixed: '#84f6e6'
  secondary-fixed-dim: '#66d9ca'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdea7'
  tertiary-fixed-dim: '#f8bd45'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#fff8f6'
  on-background: '#261815'
  surface-variant: '#f6ddd8'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-desktop: 120px
  section-mobile: 64px
  gutter: 24px
  container-max: 1280px
---

## Brand & Style
The design system embodies a premium, tactile, and vibrant aesthetic tailored for a high-end custom e-commerce experience. It blends **Editorial Minimalism** with **Tactile Modernism**, creating a digital space that feels as physical and high-quality as a heavyweight canvas tote.

The primary emotional response is one of creativity, warmth, and trust. By using a warm off-white base instead of pure white, the UI avoids "digital coldness," leaning into a studio-like atmosphere. The style utilizes soft shadows and high-contrast typography to create a sophisticated, curated feel that elevates custom-printed products to the level of designer goods.

## Colors
This palette is designed to feel sunny and energetic yet grounded.

- **Background (#FFF9F2):** A warm cream that serves as the "canvas." All surfaces should sit on this color.
- **Text (#232333):** A deep charcoal-navy for maximum legibility without the harshness of pure black.
- **Primary CTA (#FF6B4A):** A vibrant coral-orange used exclusively for action-oriented elements like "Add to Cart" or "Design Now."
- **Secondary/Trust (#0F9B8E):** A deep teal used for success states, value propositions (e.g., "Organic Cotton"), and secondary navigation.
- **Accent/Badge (#F4B942):** A mustard-gold used sparingly for highlight badges (e.g., "Best Seller," "New Arrival") and small decorative accents.

## Typography
The typography strategy relies on the tension between a classical, high-contrast serif and a modern, friendly sans-serif.

- **Headlines:** Utilize **EB Garamond** (as the closest available premium editorial serif) for all product titles and section headers. It should feel authoritative and stylish.
- **Body:** **Plus Jakarta Sans** provides a friendly, approachable, and highly readable counterpoint. Its slightly rounded terminals complement the "pill" shape language of the UI.
- **Labels:** Small labels and UI micro-copy should use Plus Jakarta Sans in bold with increased letter spacing for a clean, organized look.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to evoke a luxury magazine feel. 

- **Grid:** 12-column desktop grid with 24px gutters.
- **Margins:** Desktop margins are 80px; Mobile margins are 20px.
- **Whitespace:** Use aggressive vertical spacing (`section-desktop`) between homepage modules to allow product photography to "breathe." 
- **Alignment:** Headlines are generally centered for a boutique feel, while functional UI (forms, filters) remains left-aligned for usability.

## Elevation & Depth
Depth is created through **Multi-layered Ambient Shadows** rather than harsh outlines.

- **Surface 1 (Base):** The #FFF9F2 background.
- **Surface 2 (Cards):** Pure white (#FFFFFF) backgrounds with a 16-20px corner radius and a soft, two-stage shadow (a tight, low-opacity shadow for definition and a wide, diffused shadow for lift).
- **Interactive Depth:** Buttons and interactive cards should "lift" (increase shadow spread and slightly scale up) on hover to provide tactile feedback.
- **Gradients:** Use soft, radial gradients (e.g., #FF6B4A to #F4B942 at 10% opacity) behind product shots to add dimensionality without clutter.

## Shapes
The shape language is dominated by **Softness and Flow**.

- **Containers:** Product cards and image containers use a consistent 20px radius.
- **Interactive Elements:** Buttons, input fields, and tags are fully pill-shaped (rounded-full/3) to create a friendly, modern interface that contrasts with the sharp elegance of the serif typography.
- **Icons:** Use a medium-weight rounded icon set to match the body font’s geometry.

## Components
- **Buttons:** All primary buttons are pill-shaped with #FF6B4A backgrounds, white text, and a soft coral-tinted shadow. Secondary buttons use a #232333 outline or a subtle cream fill.
- **Cards:** Product cards must include a subtle "hover state" where the image slightly zooms. Use a 1px border of #232333 at 5% opacity to define the edge against the cream background.
- **Input Fields:** Pill-shaped with a 2px stroke. On focus, the stroke changes to #0F9B8E (Teal) to signal a secure, active state.
- **Chips/Badges:** Small, fully rounded badges using #F4B942 for high-priority callouts.
- **Tote Customizer:** Use a "sticky" bottom bar on mobile for the "Add to Cart" action, utilizing the Primary Coral color to ensure it remains the focal point of the shopping journey.