/**
 * Countryside Craft — Centralized Brand Design Tokens
 * 
 * Inspired by botanical textures, traditional Indian craftsmanship,
 * and sustainable slow living.
 */

export const THEME_TOKENS = {
  colors: {
    // Core Brand Palette
    forest: '#244537',        // Primary brand identity & primary buttons
    forestDark: '#193428',    // Deep forest: announcement bar, footer, heavy emphasis
    forestHover: '#1B382C',   // Interactive hover state
    ivory: '#F8F5EF',         // Warm ivory: primary page surfaces
    terracotta: '#A94F2B',    // Restrained warm accents & highlights
    terracottaHover: '#8F4021',
    rose: '#D95B83',          // Botanical rose: used sparingly
    roseHover: '#C4476F',
    gold: '#C6A46A',          // Muted gold: subtle decorative details
    goldHover: '#B59257',
    white: '#FFFFFF',         // Card surfaces & clean contrast
    body: '#34443A',          // Primary readable body text
    secondary: '#6D756D',     // Supporting metadata & secondary text
    border: '#E7DFD2',        // Refined warm borders & dividers
    surfaceMuted: '#F0EBE1',  // Neutral warm surface for chips/inputs
    success: '#356B49',       // Affirmative states & verified badges
    error: '#A83232',         // Destructive / validation error states
  },

  typography: {
    fontSerif: "'Playfair Display', Georgia, serif",
    fontSans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontBrand: "'Cinzel', serif",
    fontBrandScript: "'Berkshire Swash', 'Great Vibes', cursive",
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  radii: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
};
