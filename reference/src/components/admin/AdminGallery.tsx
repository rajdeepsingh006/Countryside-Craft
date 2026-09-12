import React, { useState } from 'react';
import { Plus, Trash2, Play, Image as ImageIcon, MapPin, Calendar, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GalleryItem } from '../../types';
import { formatShortDate } from '../../utils/formatters';

export const AdminGallery: React.FC = () => {
  const { gallery, saveGalleryItem, deleteGalleryItem, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: '',
    category: 'workshops',
    location: 'Jaipur, Rajasthan',
    eventDate: '2026-08-15'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.mediaUrl?.trim()) {
      showToast('Title and Media URL are required', 'warning');
      return;
    }

    saveGalleryItem({
      ...formData,
      title: formData.title.trim(),
      description: formData.description || '',
      mediaType: formData.mediaType || 'image',
      mediaUrl: formData.mediaUrl.trim(),
      thumbnailUrl: formData.thumbnailUrl?.trim() || formData.mediaUrl.trim(),
      category: formData.category || 'workshops',
      location: formData.location || 'India',
      eventDate: formData.eventDate || new Date().toISOString().split('T')[0],
      tags: ['workshop', 'event']
    });

    showToast('New media added to workshop gallery!', 'success');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" from the gallery?`)) {
      deleteGalleryItem(id);
      showToast('Media item deleted.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E8DFD0] shadow-xs">
        <div>
          <h3 className="font-serif-display font-bold text-base text-[#241F18]">
            Workshops & Events Media Gallery ({gallery.length})
          </h3>
          <p className="text-xs text-[#7A6D5C]">
            Manage behind-the-scenes block printing videos and pop-up event photos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Workshop Media</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl overflow-hidden bg-white border border-[#E8DFD0] shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] bg-[#24201B]">
              <img
                src={item.thumbnailUrl || item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.mediaType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-8 h-8 fill-white text-white opacity-80" />
                </div>
              )}
              <span className="absolute top-2 left-2 bg-[#26221D]/80 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8C7E6C]">
                  <span>{item.location}</span>
                  <span>{formatShortDate(item.eventDate)}</span>
                </div>
                <h4 className="font-serif-display font-bold text-sm text-[#241F18] mt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#6B5E4F] line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2ECE1] flex justify-end">
                <button
                  onClick={() => handleDelete(item._id, item.title)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full border border-[#E8DFD0] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]">
              <h3 className="font-serif-display font-bold text-lg text-[#241F18]">
                Add Workshop Photo or Video
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#8C7E6C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3B3329] mb-1">Event / Story Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Traditional Dabu Mud Resist Masterclass"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Media Type</label>
                  <select
                    value={formData.mediaType || 'image'}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  >
                    <option value="image">📷 High-Res Photo</option>
                    <option value="video">▶ Video Clip</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Category</label>
                  <select
                    value={formData.category || 'workshops'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  >
                    <option value="workshops">Workshops</option>
                    <option value="events">Events & Pop-ups</option>
                    <option value="making">Artisan Making</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3B3329] mb-1">Media URL *</label>
                <input
                  type="text"
                  required
                  value={formData.mediaUrl || ''}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bangalore, KA"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate || ''}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3B3329] mb-1">Description / Story</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Attendees learned how teakwood blocks are dipped in natural Indigo..."
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E8DFD0]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Save to Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-neutral-200 text-neutral-800 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
