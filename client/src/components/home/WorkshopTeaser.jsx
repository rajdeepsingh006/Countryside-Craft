import React from 'react';
import { Sparkles, ArrowRight, Play, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';
import { isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';

export const WorkshopTeaser = ({ onNavigate }) => {
  const { gallery } = useStore();

  return (
    <section className="py-16 bg-[#FCFBFA] texture-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[#EADDC6]/40 gap-3">
          <div className="flex items-start justify-between gap-2 w-full md:w-auto">
            <div className="min-w-0">
              <div className="inline-flex items-center space-x-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#A94F2B] bg-[#FDF4EE] border border-[#F0D5C3] px-2.5 py-1 rounded-full mb-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#A94F2B]" />
                <span>Behind the Loom &amp; Dye Vats</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif-display font-bold text-[#163323] leading-tight">
                Workshops, Pop-ups &amp; Events
              </h2>
              <p className="text-xs sm:text-sm text-[#4E6151] mt-1 line-clamp-2 sm:line-clamp-none">
                A glimpse into our hands-on block printing masterclasses and artisan craft pop-ups.
              </p>
            </div>

            {/* Cute Handwritten Callout on Mobile & Desktop */}
            <div className="shrink-0 -rotate-3 select-none text-right pt-0.5 pr-1 sm:pr-3">
              <span className="block font-handwriting text-base sm:text-2xl text-[#244537] font-bold leading-none">
                real artisan
              </span>
              <span className="inline-flex items-center gap-0.5 sm:gap-1 font-handwriting text-lg sm:text-3xl text-[#A94F2B] font-bold leading-none underline decoration-[#A94F2B]/40 decoration-wavy underline-offset-2">
                stories <span className="text-xs sm:text-base text-[#244537]">✿</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="mt-2 md:mt-0 text-xs sm:text-sm font-bold text-[#163323] hover:text-[#A94F2B] flex items-center space-x-1 transition-colors group shrink-0 cursor-pointer w-fit self-start md:self-auto"
          >
            <span>View Full Media Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#A94F2B]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gallery.slice(0, 3).map((item) => {
            const rawThumb = item.thumbnailUrl || (Array.isArray(item.images) ? item.images[0] : item.mediaUrl);
            const displaySrc = isVideoUrl(rawThumb) ? getVideoThumbnail(rawThumb) : rawThumb;

            return (
              <div
                key={item._id}
                onClick={() => onNavigate('gallery')}
                className="group relative rounded-3xl overflow-hidden bg-white border border-[#B9C9E7]/40 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#161C2A]">
                  <img
                    src={displaySrc || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800'}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/95 text-[#D91680] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-[#D91680] ml-0.5" />
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#1A1F2C]/85 text-[#DBE586] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  {(item.category || '').replace('-', ' ')}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center space-x-3 text-[11px] text-[#6A758E] mb-1">
                    {item.location && (
                      <span className="flex items-center space-x-1 truncate">
                        <MapPin className="w-3 h-3 text-[#D91680]" />
                        <span>{item.location}</span>
                      </span>
                    )}
                    {item.eventDate && (
                      <span className="flex items-center space-x-1 shrink-0">
                        <Calendar className="w-3 h-3 text-[#D91680]" />
                        <span>{formatDate(item.eventDate)}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C] group-hover:text-[#D91680] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#525E77] line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#EEF3FA] flex items-center justify-between text-xs text-[#D91680] font-bold">
                  <span>Explore Event Story</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};
