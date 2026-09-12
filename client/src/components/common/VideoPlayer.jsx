import React, { useState } from 'react';
import { Play, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { parseVideoUrl } from '../../utils/videoHelpers';

export const VideoPlayer = ({
  url,
  poster = '',
  autoPlay = true,
  controls = true,
  muted = false,
  loop = false,
  className = '',
  showBadge = false,
}) => {
  const parsed = parseVideoUrl(url);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);

  if (!parsed || hasError) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center bg-black/90 text-white rounded-2xl ${className}`}>
        <AlertCircle className="w-8 h-8 text-[#EFC0DA] mb-2" />
        <p className="text-xs font-semibold text-white/90">Video preview unavailable</p>
        <p className="text-[10px] text-white/60 mt-1 max-w-xs break-all">
          {url ? `Could not load: ${url.slice(0, 45)}...` : 'No valid video URL provided'}
        </p>
      </div>
    );
  }

  // 1. YouTube Iframe
  if (parsed.type === 'youtube') {
    const embedSrc = `https://www.youtube-nocookie.com/embed/${parsed.id}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&rel=0&playsinline=1`;
    return (
      <div className={`relative w-full h-full overflow-hidden bg-black flex items-center justify-center ${className}`}>
        <iframe
          src={embedSrc}
          title="Product Video Showcase"
          className="w-full h-full aspect-video border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {showBadge && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow pointer-events-none">
            YouTube
          </span>
        )}
      </div>
    );
  }

  // 2. Vimeo Iframe
  if (parsed.type === 'vimeo') {
    const embedSrc = `https://player.vimeo.com/video/${parsed.id}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`;
    return (
      <div className={`relative w-full h-full overflow-hidden bg-black flex items-center justify-center ${className}`}>
        <iframe
          src={embedSrc}
          title="Product Video Showcase"
          className="w-full h-full aspect-video border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
        {showBadge && (
          <span className="absolute top-2.5 left-2.5 bg-[#1AB7EA] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow pointer-events-none">
            Vimeo
          </span>
        )}
      </div>
    );
  }

  // 3. Direct HTML5 Video (.mp4, .webm, Cloudinary, etc.)
  const candidatePoster = poster && !/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(poster) ? poster : '';
  const effectivePoster = candidatePoster || parsed.thumbnailUrl || undefined;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black flex items-center justify-center ${className}`}>
      <video
        key={parsed.embedUrl}
        src={parsed.embedUrl}
        poster={effectivePoster}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain"
      />
      {showBadge && (
        <span className="absolute top-2.5 left-2.5 bg-[#D91680] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow pointer-events-none">
          ▶ Video
        </span>
      )}
    </div>
  );
};
