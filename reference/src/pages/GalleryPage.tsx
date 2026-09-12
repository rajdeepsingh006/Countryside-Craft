import React, { useState } from 'react';
import { Play, Sparkles, MapPin, Calendar, MessageCircle, X, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GalleryItem } from '../types';
import { formatShortDate } from '../utils/formatters';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';

interface GalleryPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const { gallery, settings } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'workshops' | 'events' | 'behind-the-scenes' | 'custom-bulk'>('all');
  const [activeMediaModal, setActiveMediaModal] = useState<GalleryItem | null>(null);

  const filtered = gallery.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const handleInquireWorkshop = () => {
    const msg = buildWhatsAppInquiryMessage('workshop');
    const url = generateWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#E5DAC8] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#8C5E3C] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Behind the Craft</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#27211A]">
              Workshops, Events & Artisan Stories
            </h1>
            <p className="text-xs sm:text-sm text-[#786B5A] mt-1 max-w-2xl">
              Explore our journey through community block printing masterclasses, craft festivals, and hands-on dye experiments across Jaipur, Bangalore, and Delhi.
            </p>
          </div>

          <button
            onClick={handleInquireWorkshop}
            className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center space-x-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Host or Attend a Workshop</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-[#3B362F] text-white shadow-sm'
                : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
            }`}
          >
            All Media ({gallery.length})
          </button>
          <button
            onClick={() => setSelectedFilter('workshops')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === 'workshops'
                ? 'bg-[#3B362F] text-white shadow-sm'
                : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
            }`}
          >
            🎓 Hand Block Workshops
          </button>
          <button
            onClick={() => setSelectedFilter('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === 'events'
                ? 'bg-[#3B362F] text-white shadow-sm'
                : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
            }`}
          >
            🎪 Pop-up Bazaars & Expos
          </button>
          <button
            onClick={() => setSelectedFilter('behind-the-scenes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === 'behind-the-scenes'
                ? 'bg-[#3B362F] text-white shadow-sm'
                : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
            }`}
          >
            🏺 Artisan Making & Behind-the-Scenes
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              onClick={() => setActiveMediaModal(item)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#E5DAC8] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[16/11] overflow-hidden bg-[#24201B]">
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-[#8C5E3C] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-[#8C5E3C] ml-1" />
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-[#2D2A26]/85 text-amber-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {item.category.replace('-', ' ')}
                </div>
              </div>

              {/* Info Container */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-3 text-xs text-[#8C7E6C] mb-1.5">
                    {item.location && (
                      <span className="flex items-center space-x-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#8C5E3C]" />
                        <span>{item.location}</span>
                      </span>
                    )}
                    {item.eventDate && (
                      <span className="flex items-center space-x-1 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-[#8C5E3C]" />
                        <span>{formatShortDate(item.eventDate)}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-display font-bold text-base text-[#2A231C] group-hover:text-[#8C5E3C] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B5F4F] line-clamp-3 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#8C5E3C] font-bold">
                  <span>{item.mediaType === 'video' ? '▶ Watch Video Story' : '🔍 View Full High-Res Photo'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Media Lightbox / Player Modal */}
        {activeMediaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative bg-[#1A1815] rounded-3xl overflow-hidden max-w-3xl w-full border border-white/20 shadow-2xl animate-scale-up">
              <button
                onClick={() => setActiveMediaModal(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-black text-white z-20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-4 sm:p-6">
                {activeMediaModal.mediaType === 'video' ? (
                  <video
                    src={activeMediaModal.mediaUrl}
                    controls
                    autoPlay
                    className="w-full rounded-2xl aspect-video bg-black"
                  />
                ) : (
                  <img
                    src={activeMediaModal.mediaUrl}
                    alt={activeMediaModal.title}
                    className="w-full max-h-[70vh] object-contain rounded-2xl bg-black"
                  />
                )}
              </div>

              <div className="p-6 bg-[#241F1A] border-t border-white/10 space-y-2 text-white">
                <div className="flex items-center space-x-3 text-xs text-amber-200">
                  {activeMediaModal.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activeMediaModal.location}</span>
                    </span>
                  )}
                  {activeMediaModal.eventDate && (
                    <span>• {formatShortDate(activeMediaModal.eventDate)}</span>
                  )}
                </div>
                <h3 className="font-serif-display font-bold text-lg text-white">
                  {activeMediaModal.title}
                </h3>
                <p className="text-xs text-[#CBC1B3] leading-relaxed">
                  {activeMediaModal.description}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
