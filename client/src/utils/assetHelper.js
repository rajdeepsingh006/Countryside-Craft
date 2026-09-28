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

  // Remove leading './' if present
  const normalized = trimmed.startsWith('./') ? trimmed.slice(1) : trimmed;

  // Detect GitHub Pages repo subpath from current window location
  let repoBase = '';
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/([^/]+)/);
    if (match && match[1].toLowerCase() === 'countryside-craft') {
      repoBase = `/${match[1]}`;
    }
  }

  const clean = normalized.startsWith('/') ? normalized : `/${normalized}`;
  if (repoBase && clean.toLowerCase().startsWith(repoBase.toLowerCase())) {
    return clean;
  }
  return `${repoBase}${clean}`;
};
