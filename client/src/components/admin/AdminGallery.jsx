import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  MapPin,
  Calendar,
  X,
  UploadCloud,
  Layers,
  RefreshCw,
  Sparkles,
  Loader2,
  Search,
  ExternalLink,
  Eye,
  Check,
  Film,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { isVideoUrl, getVideoThumbnail, parseVideoUrl } from '../../utils/videoHelpers';

export const AdminGallery = () => {
  const { showToast, refreshData, gallery } = useStore();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video'
  const [filterCategory, setFilterCategory] = useState('all');

  // Preview & Delete Confirmation
  const [previewItem, setPreviewItem] = useState(null);
  const [previewPhotoIdx, setPreviewPhotoIdx] = useState(0);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'image', // 'image' | 'video'
    category: 'workshops',
    location: 'Jaipur, Rajasthan',
    eventDate: new Date().toISOString().split('T')[0],
    videoUrl: '',
    thumbnailUrl: '',
  });

  // Multiple photos state for image album
  const [imageList, setImageList] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [bulkUrlsInput, setBulkUrlsInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const fetchAdminGallery = async () => {
    try {
      setLoading(true);
      const res = await adminService.getGallery();
      const items = res?.items || (Array.isArray(res) ? res : []);
      setGalleryItems(items);
    } catch (err) {
      console.error('Failed to fetch gallery items:', err);
      setGalleryItems([]);
      showToast('Could not connect to server to load gallery items', 'error');
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
      videoUrl: '',
      thumbnailUrl: '',
    });
    setImageList([]);
    setNewImageUrl('');
    setBulkUrlsInput('');
    setShowBulkInput(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const isVideo = item.mediaType === 'video' || isVideoUrl(item.mediaUrl);
    const existingImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : (item.mediaUrl ? [item.mediaUrl] : []);

    setFormData({
      title: item.title || '',
      description: item.description || '',
      mediaType: isVideo ? 'video' : 'image',
      category: item.category || 'workshops',
      location: item.location || 'Jaipur, Rajasthan',
      eventDate: item.eventDate
        ? new Date(item.eventDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      videoUrl: isVideo ? (item.mediaUrl || '') : '',
      thumbnailUrl: item.thumbnailUrl || '',
    });

    setImageList(existingImages.filter((img) => !isVideoUrl(img)));
    setNewImageUrl('');
    setBulkUrlsInput('');
    setShowBulkInput(false);
    setIsModalOpen(true);
  };

  // Add a single Cloudinary or web image link
  const handleAddSingleImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    if (!imageList.includes(url)) {
      setImageList((prev) => [...prev, url]);
      showToast('Image URL added to album', 'info');
    } else {
      showToast('Image is already in the album', 'warning');
    }
    setNewImageUrl('');
  };

  // Add multiple bulk Cloudinary links (separated by line break or commas)
  const handleAddBulkImages = () => {
    if (!bulkUrlsInput.trim()) return;
    const urls = bulkUrlsInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (urls.length > 0) {
      setImageList((prev) => [...new Set([...prev, ...urls])]);
      showToast(`Added ${urls.length} images to album`, 'success');
      setBulkUrlsInput('');
      setShowBulkInput(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCoverImage = (index) => {
    if (index === 0) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    showToast('Cover image updated', 'info');
  };

  // File upload directly to Cloudinary via backend
  const handleMultiFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploadData = new FormData();
    files.forEach((file) => uploadData.append('files', file));

    setUploadingImages(true);
    showToast(`Uploading ${files.length} file(s) to Cloudinary... Please wait`, 'info');
    try {
      const res = await adminService.uploadFiles(uploadData);
      const urls = (res?.files || []).map((f) => f.url).filter(Boolean);
      if (urls.length > 0) {
        if (formData.mediaType === 'video' && urls[0]) {
          setFormData((prev) => ({ ...prev, videoUrl: urls[0] }));
          showToast('Video uploaded to Cloudinary successfully!', 'success');
        } else {
          setImageList((prev) => [...prev, ...urls]);
          showToast(`Successfully uploaded ${urls.length} photo(s) to Cloudinary!`, 'success');
        }
      } else {
        showToast('No URLs returned from Cloudinary server', 'warning');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      showToast(err.response?.data?.message || 'Failed to upload files to Cloudinary', 'error');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  // Save / Update Gallery Item
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      showToast('Title is required', 'warning');
      return;
    }

    if (formData.mediaType === 'video') {
      if (!formData.videoUrl?.trim()) {
        showToast('Please enter a Cloudinary video URL or video link.', 'warning');
        return;
      }
    } else {
      if (imageList.length === 0) {
        showToast('Please add at least 1 image link for the gallery item.', 'warning');
        return;
      }
    }

    setSaving(true);
    try {
      let payload;
      if (formData.mediaType === 'video') {
        const video = formData.videoUrl.trim();
        const customThumb = formData.thumbnailUrl?.trim();
        const autoThumb = customThumb || getVideoThumbnail(video);

        payload = {
          title: formData.title.trim(),
          description: formData.description?.trim() || '',
          mediaType: 'video',
          mediaUrl: video,
          images: [video],
          thumbnailUrl: autoThumb || video,
          category: formData.category,
          location: formData.location || 'India',
          eventDate: formData.eventDate,
        };
      } else {
        const primaryPhoto = imageList[0];
        payload = {
          title: formData.title.trim(),
          description: formData.description?.trim() || '',
          mediaType: 'image',
          mediaUrl: primaryPhoto,
          thumbnailUrl: primaryPhoto,
          images: imageList,
          category: formData.category,
          location: formData.location || 'India',
          eventDate: formData.eventDate,
        };
      }

      if (editingItem) {
        const updated = await adminService.updateGalleryItem(editingItem._id, payload);
        const updatedItem = updated?.item || updated;
        setGalleryItems((prev) =>
          prev.map((g) => (g._id === editingItem._id ? updatedItem : g))
        );
        showToast('Gallery item updated successfully!', 'success');
      } else {
        const created = await adminService.createGalleryItem(payload);
        const newItem = created?.item || created;
        setGalleryItems((prev) => [newItem, ...prev]);
        showToast('New gallery item published successfully!', 'success');
      }

      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save gallery entry:', err);
      showToast(err.response?.data?.message || 'Failed to save gallery entry', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Item
  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const targetId = deleteConfirmItem._id;
    setDeleting(true);
    try {
      try {
        await adminService.deleteGalleryItem(targetId);
      } catch (apiErr) {
        // If it's a mock or non-existent ID (e.g. gal-001), treat as resolved locally
        if (typeof targetId === 'string' && (targetId.startsWith('gal-') || targetId.length !== 24)) {
          console.warn('Demo/mock gallery item removed locally:', targetId);
        } else {
          throw apiErr;
        }
      }
      setGalleryItems((prev) => prev.filter((g) => g._id !== targetId));
      await refreshData();
      showToast(`Deleted "${deleteConfirmItem.title}" from gallery.`, 'info');
      setDeleteConfirmItem(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
      if (typeof targetId === 'string' && (targetId.startsWith('gal-') || targetId.length !== 24)) {
        setGalleryItems((prev) => prev.filter((g) => g._id !== targetId));
        setDeleteConfirmItem(null);
        showToast(`Removed "${deleteConfirmItem.title}".`, 'info');
      } else {
        showToast(err.response?.data?.message || 'Failed to delete gallery item', 'error');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Filter items
  const filteredItems = galleryItems.filter((item) => {
    // Type Filter
    const isVideo = item.mediaType === 'video' || isVideoUrl(item.mediaUrl);
    if (filterType === 'image' && isVideo) return false;
    if (filterType === 'video' && !isVideo) return false;

    // Category Filter
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;

    // Search Term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#B9C9E7]/50 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#D91680]/10 text-[#D91680]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C]">
              Gallery &amp; Workshop Media ({galleryItems.length})
            </h3>
          </div>
          <p className="text-xs text-[#6A758E] mt-0.5">
            Manage Cloudinary images, multi-photo albums, and video reels for your storefront gallery.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={fetchAdminGallery}
            title="Refresh from server"
            className="p-2.5 rounded-xl bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] border border-[#B9C9E7] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md active:scale-98 cursor-pointer border border-[#EFC0DA]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Item</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#B9C9E7]/50 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6A758E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search gallery by title, location or story..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:ring-1 focus:ring-[#D91680]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Media Type Pills */}
        <div className="flex items-center space-x-1 bg-[#EEF3FA]/60 p-1 rounded-xl border border-[#B9C9E7]/40 shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-[#D91680] shadow-2xs'
                : 'text-[#6A758E] hover:text-[#1A1F2C]'
            }`}
          >
            All Media
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
              filterType === 'image'
                ? 'bg-white text-[#D91680] shadow-2xs'
                : 'text-[#6A758E] hover:text-[#1A1F2C]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images</span>
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
              filterType === 'video'
                ? 'bg-white text-[#D91680] shadow-2xs'
                : 'text-[#6A758E] hover:text-[#1A1F2C]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>
        </div>

        {/* Category Select */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none shrink-0"
        >
          <option value="all">All Categories</option>
          <option value="workshops">Workshops</option>
          <option value="events">Events &amp; Pop-ups</option>
          <option value="making">Artisan Making</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#6A758E] text-xs bg-white rounded-3xl border border-[#B9C9E7]/40">
          <Loader2 className="w-7 h-7 border-2 border-[#D91680] border-t-transparent rounded-full animate-spin mx-auto mb-3 text-[#D91680]" />
          Loading gallery items from database...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center border border-[#B9C9E7]/50 text-xs text-[#6A758E] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EEF3FA] text-[#D91680] flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="font-bold text-sm text-[#1A1F2C]">No gallery media found</p>
          <p className="max-w-md mx-auto text-[#6A758E]">
            {searchTerm || filterType !== 'all' || filterCategory !== 'all'
              ? 'Try resetting the search or filter criteria.'
              : 'Click "Add Media Item" to add your first Cloudinary image or video reel.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#D91680] text-white font-bold text-xs shadow cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isVideo = item.mediaType === 'video' || isVideoUrl(item.mediaUrl);
            const allImages = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : [item.thumbnailUrl || item.mediaUrl];
            const firstPhoto = allImages.find((img) => img && !isVideoUrl(img));
            const firstVideo = allImages.find((img) => img && isVideoUrl(img));
            const coverSrc = isVideo
              ? (item.thumbnailUrl || (firstVideo ? getVideoThumbnail(firstVideo) : item.mediaUrl))
              : (firstPhoto || item.thumbnailUrl || allImages[0]);

            const isCloudinary = (item.mediaUrl || '').includes('cloudinary.com') ||
              allImages.some((u) => (u || '').includes('cloudinary.com'));

            return (
              <div
                key={item._id}
                className="rounded-3xl overflow-hidden bg-white border border-[#B9C9E7]/50 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[16/10] bg-[#161C2A] overflow-hidden">
                  <img
                    src={coverSrc || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800'}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800';
                    }}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Video Play Overlay */}
                  {isVideo && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewItem(item);
                        setPreviewPhotoIdx(0);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/20 transition-colors cursor-pointer"
                      title="Play Video"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/95 text-[#D91680] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-[#D91680] ml-0.5" />
                      </div>
                    </button>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#1A1F2C]/85 text-[#DBE586] text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      {item.category}
                    </span>

                    {isVideo ? (
                      <span className="bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center space-x-1">
                        <Film className="w-3 h-3" />
                        <span>VIDEO</span>
                      </span>
                    ) : (
                      <span className="bg-sky-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center space-x-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>PHOTO</span>
                      </span>
                    )}

                    {isCloudinary && (
                      <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                        Cloudinary
                      </span>
                    )}
                  </div>

                  {/* Bottom Right Counter */}
                  {!isVideo && allImages.length > 1 && (
                    <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-[#DBE586]" />
                      <span>{allImages.length} Photos</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#6A758E]">
                      <span className="flex items-center space-x-1 truncate">
                        <MapPin className="w-3 h-3 text-[#D91680] shrink-0" />
                        <span className="truncate">{item.location || 'India'}</span>
                      </span>
                      <span className="shrink-0">{formatDate(item.eventDate)}</span>
                    </div>

                    <h4 className="font-serif-display font-bold text-sm text-[#1A1F2C] mt-1.5 leading-snug line-clamp-1">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-[#525E77] line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}

                    {/* Preview Thumbnails Strip if Album */}
                    {!isVideo && allImages.length > 1 && (
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

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#EEF3FA] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewItem(item);
                        setPreviewPhotoIdx(0);
                      }}
                      className="text-xs font-bold text-[#6A758E] hover:text-[#1A1F2C] flex items-center space-x-1 cursor-pointer"
                      title="Preview Media"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Edit gallery entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Delete gallery entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-[#B9C9E7]/60 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF3FA]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#D91680]/10 flex items-center justify-center text-[#D91680]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C]">
                    {editingItem ? 'Edit Gallery Media Item' : 'Add New Gallery Media Item'}
                  </h3>
                  <p className="text-[11px] text-[#6A758E]">
                    Supports Cloudinary image &amp; video URLs, multi-photo albums, and file uploads.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#6A758E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Media Type Selector Tabs */}
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1.5 uppercase tracking-wider text-[11px]">
                  Select Media Type *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#EEF3FA]/70 rounded-2xl border border-[#B9C9E7]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                    className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      formData.mediaType === 'image'
                        ? 'bg-white text-[#D91680] shadow-sm border border-[#D91680]/20'
                        : 'text-[#6A758E] hover:text-[#1A1F2C]'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>📷 Photo / Image Album</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                    className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      formData.mediaType === 'video'
                        ? 'bg-white text-[#D91680] shadow-sm border border-[#D91680]/20'
                        : 'text-[#6A758E] hover:text-[#1A1F2C]'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    <span>▶ Video Reel (Cloudinary)</span>
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#1A1F2C] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Traditional Hand Block Printing Masterclass"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:ring-1 focus:ring-[#D91680]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Category</label>
                  <select
                    value={formData.category || 'workshops'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  >
                    <option value="workshops">Workshops</option>
                    <option value="events">Events &amp; Pop-ups</option>
                    <option value="making">Artisan Making</option>
                  </select>
                </div>
              </div>

              {/* ===================== VIDEO MEDIA INPUTS ===================== */}
              {formData.mediaType === 'video' ? (
                <div className="p-4 rounded-3xl bg-[#EEF3FA]/50 border border-[#B9C9E7] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1F2C] uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                      <Film className="w-3.5 h-3.5 text-[#D91680]" />
                      <span>Cloudinary Video Configuration</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      MP4 / WebM / Cloudinary URL
                    </span>
                  </div>

                  {/* Video URL Input */}
                  <div>
                    <label className="block font-bold text-[#1A1F2C] mb-1">
                      Cloudinary Video URL *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.videoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://res.cloudinary.com/your-cloud/video/upload/v12345/workshop-reel.mp4"
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:ring-1 focus:ring-[#D91680] font-mono text-[11px]"
                      />
                    </div>
                    <p className="text-[10px] text-[#6A758E] mt-1">
                      Paste your Cloudinary video link (e.g. <code>https://res.cloudinary.com/.../video/upload/...mp4</code>) or YouTube/Vimeo link.
                    </p>
                  </div>

                  {/* Optional Poster / Thumbnail URL */}
                  <div>
                    <label className="block font-bold text-[#1A1F2C] mb-1">
                      Video Cover Poster Image (Cloudinary or Image URL) <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnailUrl || ''}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/your-cloud/image/upload/v12345/poster.jpg (Optional)"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:ring-1 focus:ring-[#D91680] font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-[#6A758E] mt-0.5">
                      💡 Leave blank to auto-generate poster frame directly from your Cloudinary video!
                    </p>
                  </div>

                  {/* Real-time Video Player Preview */}
                  {formData.videoUrl?.trim() && (
                    <div className="pt-2 border-t border-[#B9C9E7]/50 space-y-1.5">
                      <span className="block font-bold text-[#1A1F2C] text-[11px]">
                        Live Video Preview
                      </span>
                      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-56 mx-auto flex items-center justify-center">
                        {(() => {
                          const parsed = parseVideoUrl(formData.videoUrl);
                          if (parsed && (parsed.type === 'youtube' || parsed.type === 'vimeo')) {
                            return (
                              <iframe
                                src={parsed.embedUrl}
                                title="Video Preview"
                                className="w-full h-full"
                                allow="autoplay; fullscreen"
                              />
                            );
                          }
                          const poster = formData.thumbnailUrl || getVideoThumbnail(formData.videoUrl);
                          return (
                            <video
                              src={formData.videoUrl}
                              poster={poster || undefined}
                              controls
                              className="w-full h-full object-contain"
                            />
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Upload video file directly */}
                  <div className="pt-1 border-t border-[#B9C9E7]/40 flex items-center justify-between flex-wrap gap-2">
                    <label className={`cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-[#EEF3FA] text-[#1A1F2C] border border-[#B9C9E7] rounded-xl text-xs font-bold transition-colors shadow-2xs ${
                      uploadingImages ? 'opacity-60 pointer-events-none' : ''
                    }`}>
                      {uploadingImages ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#D91680] animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5 text-[#D91680]" />
                      )}
                      <span>{uploadingImages ? 'Uploading Video to Cloudinary...' : 'Upload Video File to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        disabled={uploadingImages}
                        onChange={handleMultiFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-[#6A758E]">
                      Auto-uploads to your Cloudinary storage
                    </span>
                  </div>
                </div>
              ) : (
                /* ===================== IMAGE ALBUM INPUTS ===================== */
                <div className="p-4 rounded-3xl bg-[#EEF3FA]/50 border border-[#B9C9E7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1F2C] uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#D91680]" />
                      <span>Cloudinary Image Album ({imageList.length})</span>
                    </span>
                    <span className="text-[10px] text-[#6A758E]">
                      Add 1 or multiple Cloudinary photo links
                    </span>
                  </div>

                  {/* Photos Grid */}
                  {imageList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                      {imageList.map((url, index) => (
                        <div
                          key={index}
                          className="relative group rounded-2xl overflow-hidden bg-white border border-[#B9C9E7] aspect-[4/3] flex flex-col justify-between p-1 shadow-2xs"
                        >
                          <img
                            src={url}
                            alt={`Photo ${index + 1}`}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800';
                            }}
                            className="w-full h-full object-cover rounded-xl"
                          />

                          {index === 0 ? (
                            <span className="absolute top-1.5 left-1.5 bg-[#D91680] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                              Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(index)}
                              className="absolute bottom-1.5 left-1.5 bg-black/75 hover:bg-[#D91680] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Set as cover photo"
                            >
                              Make Cover
                            </button>
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
                  ) : (
                    <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#B9C9E7] text-[#6A758E]">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 text-[#6A758E]/60" />
                      <p className="text-[11px] font-medium">No images added yet.</p>
                      <p className="text-[10px] text-[#6A758E]">
                        Paste a Cloudinary link below or upload files to begin.
                      </p>
                    </div>
                  )}

                  {/* Add Image Links Inputs */}
                  <div className="space-y-2 pt-2 border-t border-[#B9C9E7]/40">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSingleImage();
                          }
                        }}
                        placeholder="Paste Cloudinary Image URL (https://res.cloudinary.com/...)"
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:ring-1 focus:ring-[#D91680] font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddSingleImage}
                        className="px-4 py-2 bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                      >
                        + Add Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBulkInput(!showBulkInput)}
                        className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        {showBulkInput ? 'Hide Bulk' : 'Paste Bulk'}
                      </button>
                    </div>

                    {/* Bulk input */}
                    {showBulkInput && (
                      <div className="p-3 bg-white rounded-2xl border border-[#B9C9E7] space-y-2">
                        <p className="text-[10px] text-[#6A758E]">
                          Paste multiple Cloudinary links (one per line or comma separated):
                        </p>
                        <textarea
                          rows={3}
                          value={bulkUrlsInput}
                          onChange={(e) => setBulkUrlsInput(e.target.value)}
                          placeholder="https://res.cloudinary.com/demo/image/upload/sample1.jpg&#10;https://res.cloudinary.com/demo/image/upload/sample2.jpg"
                          className="w-full p-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] font-mono text-[11px] focus:outline-none resize-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddBulkImages}
                          className="px-4 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          ✓ Add All Links to Album
                        </button>
                      </div>
                    )}

                    {/* Multi File Upload */}
                    <div className="flex items-center space-x-2 pt-1">
                      <label className={`cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-[#EEF3FA] text-[#1A1F2C] border border-[#B9C9E7] rounded-xl text-xs font-bold transition-colors shadow-2xs ${
                        uploadingImages ? 'opacity-60 pointer-events-none' : ''
                      }`}>
                        {uploadingImages ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#D91680] animate-spin" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5 text-[#D91680]" />
                        )}
                        <span>{uploadingImages ? 'Uploading photos to Cloudinary...' : 'Upload Photos from Device'}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={uploadingImages}
                          onChange={handleMultiFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-[#6A758E]">
                        Directly uploads files to your Cloudinary storage
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Location & Date */}
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

              {/* Description */}
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Description / Story</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share details about the workshop craft technique, attendees, or event highlight..."
                  className="w-full p-3 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#EEF3FA]">
                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="flex-1 py-3.5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-md border border-[#EFC0DA] flex items-center justify-center space-x-1.5"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                  <span>{saving ? 'Saving...' : editingItem ? 'Save & Update Item' : 'Publish to Gallery'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-2xl bg-neutral-100 text-neutral-800 font-bold text-xs uppercase cursor-pointer hover:bg-neutral-200"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-red-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-serif-display font-bold text-base text-[#1A1F2C]">
                  Delete Gallery Item?
                </h4>
                <p className="text-xs text-[#6A758E]">
                  This action permanently removes the item from the live gallery.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EEF3FA]/50 border border-[#B9C9E7]/60 text-xs text-[#1A1F2C]">
              <p className="font-bold">{deleteConfirmItem.title}</p>
              <p className="text-[11px] text-[#6A758E] mt-0.5">
                Type: {deleteConfirmItem.mediaType} &bull; Category: {deleteConfirmItem.category}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                <span>{deleting ? 'Deleting...' : 'Yes, Delete Item'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-5 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Lightbox Preview Modal */}
      {previewItem && (() => {
        const isVideo = previewItem.mediaType === 'video' || isVideoUrl(previewItem.mediaUrl);
        const images = Array.isArray(previewItem.images) && previewItem.images.length > 0
          ? previewItem.images
          : [previewItem.thumbnailUrl || previewItem.mediaUrl];
        const currentImg = images[previewPhotoIdx] || images[0];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative bg-[#111622] rounded-3xl overflow-hidden max-w-3xl w-full border border-white/20 shadow-2xl">
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-black text-white z-20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative p-4 sm:p-6 flex items-center justify-center bg-black min-h-[300px]">
                {isVideo ? (() => {
                  const parsed = parseVideoUrl(previewItem.mediaUrl);
                  if (parsed && (parsed.type === 'youtube' || parsed.type === 'vimeo')) {
                    return (
                      <iframe
                        src={parsed.embedUrl}
                        title={previewItem.title}
                        className="w-full rounded-2xl aspect-video bg-black"
                        allow="autoplay; fullscreen"
                      />
                    );
                  }
                  const poster = previewItem.thumbnailUrl || getVideoThumbnail(previewItem.mediaUrl);
                  return (
                    <video
                      src={previewItem.mediaUrl}
                      poster={poster || undefined}
                      controls
                      autoPlay
                      playsInline
                      className="w-full rounded-2xl aspect-video bg-black"
                    />
                  );
                })() : (
                  <img
                    src={currentImg}
                    alt={previewItem.title}
                    className="w-full max-h-[65vh] object-contain rounded-2xl"
                  />
                )}
              </div>

              {!isVideo && images.length > 1 && (
                <div className="px-6 py-2.5 bg-[#1A2131] flex gap-2 overflow-x-auto border-t border-white/10">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewPhotoIdx(i)}
                      className={`w-14 h-11 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        previewPhotoIdx === i
                          ? 'border-[#D91680] scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4 sm:p-6 bg-[#161C2A] text-white flex items-center justify-between border-t border-white/10">
                <div>
                  <h4 className="font-serif-display font-bold text-base text-white">
                    {previewItem.title}
                  </h4>
                  <p className="text-xs text-[#A9B8D4] mt-0.5">
                    {previewItem.location} &bull; {formatDate(previewItem.eventDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setPreviewItem(null);
                      handleOpenEdit(previewItem);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold cursor-pointer"
                  >
                    Edit This Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
