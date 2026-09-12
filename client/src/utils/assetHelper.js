/**
 * Helper to resolve static asset URLs properly across both local dev (/)
 * and GitHub Pages subpath (e.g. /Countryside-Craft/).
 */
export const getAssetUrl = (path) => {
  if (!path || typeof path !== 'string') return '';
  const trimmed = path.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Detect GitHub Pages repo subpath from current window location
  const match = typeof window !== 'undefined' ? window.location.pathname.match(/^\/([^/]+)/) : null;
  const repoBase = match && match[1].toLowerCase() === 'countryside-craft' ? `/${match[1]}` : '';

  const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${repoBase}${clean}`;
};
