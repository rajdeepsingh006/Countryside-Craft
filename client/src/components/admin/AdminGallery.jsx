import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  Image as ImageIcon,
  MapPin,
  Calendar,
  X,
  UploadCloud,
  Layers,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';

export const AdminGallery = () => {
  const { showToast, refreshData, gallery } = useStore();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'image',
    category: 'workshops',
    location: 'Punjab, India',
    eventDate: new Date().toISOString().split('T')[0],
  });

  // Multiple photos state for workshop entry
  const [imageList, setImageList] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [bulkUrlsInput, setBulkUrlsInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const fetchAdminGallery = async () => {
    try {
      setLoading(true);
      const res = await adminService.getGallery();
      const items = res.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setGalleryItems(items);
      } else if (gallery && gallery.length > 0) {
        setGalleryItems(gallery);
      }
    } catch (err) {
      console.error('Failed to fetch gallery items:', err);
      if (gallery && gallery.length > 0) {
        setGalleryItems(gallery);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      mediaType: 'image',
      category: 'workshops',
      location: 'Jaipur, Rajasthan',
      eventDate: new Date().toISOString().split('T')[0],
    });
    setImageList([
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    ]);
    setNewImageUrl('');
    setBulkUrlsInput('');
    setShowBulkInput(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const existingImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.thumbnailUrl || item.mediaUrl];
    
    setFormData({
      title: item.title || '',
      description: item.description || '',
      mediaType: item.mediaType || 'image',
      category: item.category || 'workshops',
      location: item.location || 'India',
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setImageList(existingImages);
    setNewImageUrl('');
    setBulkUrlsInput('');
    setShowBulkInput(false);
    setIsModalOpen(true);
  };

  const handleAddSingleImage = () => {
    if (!newImageUrl.trim()) return;
    const url = newImageUrl.trim();
    if (!imageList.includes(url)) {
      setImageList((prev) => [...prev, url]);
      showToast('Photo added to event album', 'info');
    }
    setNewImageUrl('');
  };

  const handleAddBulkImages = () => {
    if (!bulkUrlsInput.trim()) return;
    const urls = bulkUrlsInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
    if (urls.length > 0) {
      setImageList((prev) => [...new Set([...prev, ...urls])]);
      showToast(`Added ${urls.length} photos to event album`, 'success');
      setBulkUrlsInput('');
      setShowBulkInput(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMultiFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setImageList((prev) => [...prev, loadEvt.target.result]);
      };
      reader.readAsDataURL(file);
    });
    showToast(`Loaded ${files.length} local photos for upload`, 'success');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showToast('Event title is required', 'warning');
      return;
    }
    if (imageList.length === 0) {
      showToast('Please add at least 1 image for the workshop entry.', 'warning');
      return;
    }

    setSaving(true);
    try {
      const primaryMedia = imageList[0];
      const payload = {
        ...formData,
        mediaUrl: primaryMedia,
        thumbnailUrl: primaryMedia,
        images: imageList,
      };

      if (editingItem) {
        const updated = await adminService.updateGalleryItem(editingItem._id, payload);
        const updatedItem = updated.item || updated;
        setGalleryItems((prev) =>
          prev.map((g) => (g._id === editingItem._id ? updatedItem : g))
        );
        showToast('Workshop & event album updated successfully!', 'success');
      } else {
        const created = await adminService.createGalleryItem(payload);
        const newItem = created.item || created;
        setGalleryItems((prev) => [newItem, ...prev]);
        showToast('New workshop album published!', 'success');
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save gallery entry', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}" from the gallery?`)) {
      try {
        await adminService.deleteGalleryItem(id);
        setGalleryItems((prev) => prev.filter((g) => g._id !== id));
        await refreshData();
        showToast('Media item deleted.', 'info');
      } catch {
        showToast('Failed to delete gallery item', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#B9C9E7]/50 shadow-xs">
        <div>
          <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
            Workshops & Events Media Gallery ({galleryItems.length})
          </h3>
          <p className="text-xs text-[#6A758E]">
            Manage artisan masterclasses, live printing demonstrations, and expo albums.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAdminGallery}
            title="Refresh Gallery Data"
            className="p-2 rounded-xl bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] border border-[#B9C9E7] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md active:scale-98 cursor-pointer border border-[#EFC0DA]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Workshop Media</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-[#6A758E] text-xs">
          <div className="w-6 h-6 border-2 border-[#D91680] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading gallery items from database...
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#B9C9E7]/50 text-xs text-[#6A758E]">
          No workshop or expo photos found. Click "Add Workshop Media" to add your first event album.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => {
            const allImages = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : [item.thumbnailUrl || item.mediaUrl];
            const firstPhoto = allImages.find((img) => img && !isVideoUrl(img));
            const firstVideo = allImages.find((img) => img && isVideoUrl(img));
            const coverSrc = firstPhoto || (firstVideo ? getVideoThumbnail(firstVideo, item.thumbnailUrl) : (item.thumbnailUrl || allImages[0]));

            return (
              <div
                key={item._id}
                className="rounded-3xl overflow-hidden bg-white border border-[#B9C9E7]/50 shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-[#161C2A]">
                  <img
                    src={coverSrc || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800'}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800';
                    }}
                    className="w-full h-full object-cover"
                  />
                  {item.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-8 h-8 fill-white text-white opacity-80" />
                    </div>
                  )}
                  
                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 bg-[#1A1F2C]/85 text-[#DBE586] text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow">
                    {item.category}
                  </span>

                  {/* Multiple Photos Count */}
                  {allImages.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-[#DBE586]" />
                      <span>{allImages.length} Photos</span>
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#6A758E]">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#D91680]" />
                        <span>{item.location}</span>
                      </span>
                      <span>{formatDate(item.eventDate)}</span>
                    </div>

                    <h4 className="font-serif-display font-bold text-sm text-[#1A1F2C] mt-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#525E77] line-clamp-2 mt-1">
                      {item.description}
                    </p>

                    {/* Preview thumbnails strip if multiple images */}
                    {allImages.length > 1 && (
                      <div className="flex gap-1.5 pt-2 overflow-x-auto">
                        {allImages.slice(0, 4).map((imgUrl, i) => (
                          <img
                            key={i}
                            src={imgUrl}
                            alt=""
                            className="w-10 h-8 object-cover rounded-md border border-[#B9C9E7]/60"
                          />
                        ))}
                        {allImages.length > 4 && (
                          <div className="w-10 h-8 rounded-md bg-[#EEF3FA] border border-[#B9C9E7]/60 text-[10px] font-bold text-[#D91680] flex items-center justify-center">
                            +{allImages.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#EEF3FA] flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Edit workshop entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Delete workshop entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Media Modal with Multiple Photos Support */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-[#B9C9E7]/60 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF3FA]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#D91680]" />
                <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C]">
                  {editingItem ? 'Edit Workshop & Event Photos' : 'Add Workshop & Event Photos'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#6A758E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Event / Workshop Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Traditional Hand Block Printing Masterclass"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Media Type</label>
                  <select
                    value={formData.mediaType || 'image'}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  >
                    <option value="image">📷 Photos & Albums</option>
                    <option value="video">▶ Video Reel / Clip</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Category</label>
                  <select
                    value={formData.category || 'workshops'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  >
                    <option value="workshops">Workshops</option>
                    <option value="events">Events & Pop-ups</option>
                    <option value="making">Artisan Making</option>
                  </select>
                </div>
              </div>

              {/* Multiple Workshop Photos Manager */}
              <div className="p-4 rounded-3xl bg-[#EEF3FA]/50 border border-[#B9C9E7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1A1F2C] uppercase tracking-wider text-[11px]">
                    Event Photos / Slides ({imageList.length})
                  </span>
                  <span className="text-[10px] text-[#6A758E]">
                    Add 1 or multiple workshop photos
                  </span>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageList.map((url, index) => (
                    <div
                      key={index}
                      className="relative group rounded-2xl overflow-hidden bg-white border border-[#B9C9E7] aspect-video flex flex-col justify-between p-1 shadow-2xs"
                    >
                      <img
                        src={url}
                        alt={`Event photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {index === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#D91680] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="space-y-2 pt-2 border-t border-[#B9C9E7]/40">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste Image URL (https://...)"
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSingleImage}
                      className="px-4 py-2 bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      + Add URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulkInput(!showBulkInput)}
                      className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      {showBulkInput ? 'Hide Bulk' : 'Paste Bulk URLs'}
                    </button>
                  </div>

                  {showBulkInput && (
                    <div className="p-3 bg-white rounded-2xl border border-[#B9C9E7] space-y-2">
                      <p className="text-[10px] text-[#6A758E]">
                        Paste multiple photo URLs (one per line or comma separated):
                      </p>
                      <textarea
                        rows={3}
                        value={bulkUrlsInput}
                        onChange={(e) => setBulkUrlsInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                        className="w-full p-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] font-mono text-[11px] focus:outline-none resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddBulkImages}
                        className="px-4 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        ✓ Import All Photos
                      </button>
                    </div>
                  )}

                  {/* Multi File Picker */}
                  <div className="flex items-center space-x-2 pt-1">
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-[#EEF3FA] text-[#1A1F2C] border border-[#B9C9E7] rounded-xl text-xs font-bold transition-colors shadow-2xs">
                      <UploadCloud className="w-3.5 h-3.5 text-[#D91680]" />
                      <span>Upload Multiple Photo Files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleMultiFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-[#6A758E]">
                      Select multiple workshop photos from device
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate || ''}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Description / Craft Story</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Attendees learned how teakwood blocks are dipped in natural earth dyes..."
                  className="w-full p-3 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#EEF3FA]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-md border border-[#EFC0DA]"
                >
                  {saving ? 'Saving...' : editingItem ? 'Save Workshop Changes' : 'Save Workshop Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-2xl bg-neutral-100 text-neutral-800 font-bold text-xs uppercase cursor-pointer"
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
