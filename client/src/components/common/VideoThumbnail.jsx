import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { parseVideoUrl } from '../../utils/videoHelpers';

export const VideoThumbnail = ({
  videoUrl,
  url,
  poster = '',
  posterUrl = '',
  alt = 'Video thumbnail',
  className = '',
  playIconSize = 'md', // 'sm', 'md', 'lg'
  badgeText = 'VIDEO',
  showBadge = true,
  showPlayBadge = true,
}) => {
  const actualUrl = videoUrl || url;
  const actualPoster = posterUrl || poster;
  const parsed = parseVideoUrl(actualUrl);
  const [imgError, setImgError] = useState(false);

  const candidatePoster = actualPoster && !/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(actualPoster) ? actualPoster : '';
  const thumbUrl = candidatePoster || parsed?.thumbnailUrl || null;

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
  };

  const playSvgSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-neutral-900 flex items-center justify-center select-none group ${className}`}>
      {thumbUrl && !imgError ? (
        <img
          src={thumbUrl}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : parsed?.type === 'html5' && parsed?.embedUrl ? (
        <video
          src={`${parsed.embedUrl}#t=0.5`}
          preload="metadata"
          muted
          playsInline
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#2A1020] via-[#1D172A] to-[#121620] flex flex-col items-center justify-center p-1 text-center">
          <span className="font-brand-script text-white/90 text-xs">Countryside</span>
          <span className="text-[8px] uppercase tracking-widest text-[#EFC0DA] font-bold">Video</span>
        </div>
      )}

      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Play Icon in center */}
      {showPlayBadge && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`${iconSizes[playIconSize] || iconSizes.md} rounded-full bg-white/90 group-hover:bg-[#D91680] text-[#D91680] group-hover:text-white shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 pl-0.5`}>
            <Play className={`${playSvgSizes[playIconSize] || playSvgSizes.md} fill-current`} />
          </div>
        </div>
      )}

      {/* Top Video Pill Badge (only if not small strip thumbnail) */}
      {showBadge && badgeText && playIconSize !== 'sm' && (
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow-xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D91680] animate-pulse" />
            <span>{badgeText}</span>
          </span>
        </div>
      )}

      {/* Micro indicator in bottom right for small thumbnails */}
      {playIconSize === 'sm' && (
        <div className="absolute bottom-1 right-1 z-10 pointer-events-none">
          <span className="bg-[#1A1F2C]/90 text-[#DBE586] text-[7px] font-black px-1 py-0.2 rounded font-mono border border-white/30">
            VIDEO
          </span>
        </div>
      )}
    </div>
  );
};
