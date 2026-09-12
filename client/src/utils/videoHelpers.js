/**
 * Video helper utilities for Countryside Craft
 * Supports:
 * - YouTube (standard watch, youtu.be, shorts, embed)
 * - Vimeo
 * - Cloudinary Video
 * - Direct HTML5 video (.mp4, .webm, .mov, .m4v, etc.)
 */

/**
 * Checks whether a given string/URL is a video URL
 */
export const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (!trimmed) return false;

  // 1. YouTube
  if (trimmed.includes('youtube.com/') || trimmed.includes('youtu.be/')) return true;

  // 2. Vimeo
  if (trimmed.includes('vimeo.com/')) return true;

  // 3. Cloudinary video upload
  if (trimmed.includes('cloudinary.com') && (trimmed.includes('/video/upload/') || trimmed.includes('/video/'))) return true;

  // 4. File extension match
  if (/\.(mp4|webm|mov|m4v|ogv|ogg)(\?.*)?$/i.test(trimmed)) return true;

  return false;
};

/**
 * Parses any supported video URL into a uniform structure
 */
export const parseVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      originalUrl: trimmed,
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      type: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      thumbnailUrl: `https://vumbnail.com/${id}.jpg`,
      originalUrl: trimmed,
    };
  }

  // 3. Cloudinary Video
  if (
    trimmed.includes('cloudinary.com') &&
    (trimmed.includes('/video/upload/') ||
      trimmed.includes('/video/') ||
      /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(trimmed))
  ) {
    // Cloudinary automatically generates an image frame by changing extension to .jpg
    const posterUrl = trimmed.replace(/\.(mp4|webm|mov|m4v)(\?.*)?$/i, '.jpg');
    return {
      type: 'html5',
      id: null,
      embedUrl: trimmed,
      thumbnailUrl: posterUrl,
      originalUrl: trimmed,
    };
  }

  // 4. Direct HTML5 Video (.mp4, .webm, .mov, etc.)
  if (isVideoUrl(trimmed)) {
    return {
      type: 'html5',
      id: null,
      embedUrl: trimmed,
      thumbnailUrl: null,
      originalUrl: trimmed,
    };
  }

  return null;
};

/**
 * Returns a reliable thumbnail image URL for a video or null if HTML5 video
 */
export const getVideoThumbnail = (videoUrl, customThumbnail = '') => {
  if (customThumbnail && typeof customThumbnail === 'string' && customThumbnail.trim()) {
    return customThumbnail.trim();
  }
  const parsed = parseVideoUrl(videoUrl);
  return parsed?.thumbnailUrl || null;
};
