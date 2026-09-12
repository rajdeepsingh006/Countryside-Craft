import React from 'react';
import { Sparkles, ArrowRight, Play, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatShortDate } from '../../utils/formatters';

interface WorkshopTeaserProps {
  onNavigate: (view: string, param?: string) => void;
}

export const WorkshopTeaser: React.FC<WorkshopTeaserProps> = ({ onNavigate }) => {
  const { gallery } = useStore();

  return (
    <section className="py-16 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8DFD0]">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#8C5E3C] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Behind the Loom & Dye Vats</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A231C]">
              Workshops, Pop-ups & Craft Events
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E5E] mt-1">
              A glimpse into our hands-on block printing masterclasses, artisan pop-ups, and natural dye experiments across India.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className="mt-3 md:mt-0 text-xs sm:text-sm font-bold text-[#8C5E3C] hover:text-[#5E3B20] flex items-center space-x-1 transition-colors group shrink-0"
          >
            <span>View Full Media Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gallery.slice(0, 3).map((item) => (
            <div
              key={item._id}
              onClick={() => onNavigate('gallery')}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#E5 DAC8] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Media Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#24201B]">
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#8C5E3C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-[#8C5E3C] ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-[#2D2A26]/80 text-amber-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {item.category.replace('-', ' ')}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center space-x-3 text-[11px] text-[#8C7E6C] mb-1">
                    {item.location && (
                      <span className="flex items-center space-x-1 truncate">
                        <MapPin className="w-3 h-3 text-[#8C5E3C]" />
                        <span>{item.location}</span>
                      </span>
                    )}
                    {item.eventDate && (
                      <span className="flex items-center space-x-1 shrink-0">
                        <Calendar className="w-3 h-3 text-[#8C5E3C]" />
                        <span>{formatShortDate(item.eventDate)}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#2A231C] group-hover:text-[#8C5E3C] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B5F4F] line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#8C5E3C] font-semibold">
                  <span>Explore Event Story</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
