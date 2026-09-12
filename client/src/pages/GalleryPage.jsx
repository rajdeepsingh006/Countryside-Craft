import React, { useState } from 'react';
import { Play, Sparkles, MapPin, Calendar, MessageCircle, X, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../utils/formatters';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';

export const GalleryPage = ({ onNavigate }) => {
  const { gallery, settings } = useStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeMediaModal, setActiveMediaModal] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const filtered = gallery.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const handleInquireWorkshop = () => {
    const msg = buildWhatsAppInquiryMessage('workshop');
    const url = generateWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenModal = (item) => {
    setActiveMediaModal(item);
    setActivePhotoIdx(0);
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#B9C9E7]/40 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#D91680] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Behind the Craft</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#1A1F2C]">
              Workshops, Events & Artisan Stories
            </h1>
            <p className="text-xs sm:text-sm text-[#6A758E] mt-1 max-w-2xl">
              Explore our journey through community block printing masterclasses, craft festivals, and hands-on dye experiments across India.
            </p>
          </div>

          <button
            onClick={handleInquireWorkshop}
            className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Host or Attend a Workshop</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {[
            { id: 'all', label: `All Media (${gallery.length})` },
            { id: 'workshops', label: '🎓 Hand Block Workshops' },
            { id: 'events', label: '🎪 Pop-up Bazaars & Expos' },
            { id: 'making', label: '🏺 Artisan Making & Behind-the-Scenes' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedFilter(id)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedFilter === id
                  ? 'bg-[#D91680] text-white shadow-md'
                  : 'bg-white text-[#2C3549] hover:bg-[#EEF3FA] border border-[#B9C9E7]/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>


        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const itemImages = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : [item.thumbnailUrl || item.mediaUrl];

            return (
              <div
                key={item._id}
                onClick={() => handleOpenModal(item)}
                className="group relative rounded-3xl overflow-hidden bg-white border border-[#B9C9E7]/50 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[16/11] overflow-hidden bg-[#161C2A]">
                  <img
                    src={itemImages[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {item.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/95 text-[#D91680] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-[#D91680] ml-1" />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 bg-[#1A1F2C]/85 text-[#DBE586] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    {(item.category || '').replace('-', ' ')}
                  </div>

                  {itemImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                      <Layers className="w-3 h-3 text-[#DBE586]" />
                      <span>{itemImages.length} Photos</span>
                    </div>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-3 text-xs text-[#6A758E] mb-1.5">
                      {item.location && (
                        <span className="flex items-center space-x-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#D91680]" />
                          <span>{item.location}</span>
                        </span>
                      )}
                      {item.eventDate && (
                        <span className="flex items-center space-x-1 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-[#D91680]" />
                          <span>{formatDate(item.eventDate)}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif-display font-bold text-base text-[#1A1F2C] group-hover:text-[#D91680] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#525E77] line-clamp-3 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EEF3FA] flex items-center justify-between text-xs text-[#D91680] font-bold">
                    <span>
                      {item.mediaType === 'video'
                        ? '▶ Watch Video Story'
                        : itemImages.length > 1
                        ? `🔍 View ${itemImages.length} Event Photos`
                        : '🔍 View Full Photo'}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Media Lightbox / Multi-Photo Album Modal */}
        {activeMediaModal && (() => {
          const modalImages = Array.isArray(activeMediaModal.images) && activeMediaModal.images.length > 0
            ? activeMediaModal.images
            : [activeMediaModal.thumbnailUrl || activeMediaModal.mediaUrl];
          const currentImgUrl = modalImages[activePhotoIdx] || modalImages[0];

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="relative bg-[#111622] rounded-3xl overflow-hidden max-w-3xl w-full border border-white/20 shadow-2xl animate-scale-up">
                <button
                  onClick={() => setActiveMediaModal(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-black text-white z-20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative p-4 sm:p-6 flex items-center justify-center bg-black min-h-[300px]">
                  {activeMediaModal.mediaType === 'video' ? (
                    <video
                      src={activeMediaModal.mediaUrl}
                      controls
                      autoPlay
                      className="w-full rounded-2xl aspect-video bg-black"
                    />
                  ) : (
                    <>
                      <img
                        src={currentImgUrl}
                        alt={activeMediaModal.title}
                        className="w-full max-h-[65vh] object-contain rounded-2xl"
                      />

                      {modalImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1))
                            }
                            className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              setActivePhotoIdx((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0))
                            }
                            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Thumbnails strip */}
                {modalImages.length > 1 && (
                  <div className="px-6 py-2 bg-[#1A2131] flex gap-2 overflow-x-auto border-t border-white/10">
                    {modalImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`w-14 h-11 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activePhotoIdx === i
                            ? 'border-[#D91680] scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-6 bg-[#161C2A] border-t border-white/10 space-y-2 text-white">
                  <div className="flex items-center justify-between text-xs text-[#DBE586]">
                    <div className="flex items-center space-x-3">
                      {activeMediaModal.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#EFC0DA]" />
                          <span>{activeMediaModal.location}</span>
                        </span>
                      )}
                      {activeMediaModal.eventDate && (
                        <span>• {formatDate(activeMediaModal.eventDate)}</span>
                      )}
                    </div>
                    {modalImages.length > 1 && (
                      <span className="text-[11px] font-mono text-[#8E9DBE]">
                        Photo {activePhotoIdx + 1} of {modalImages.length}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-display font-bold text-lg text-white">
                    {activeMediaModal.title}
                  </h3>
                  <p className="text-xs text-[#A9B8D4] leading-relaxed">
                    {activeMediaModal.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
