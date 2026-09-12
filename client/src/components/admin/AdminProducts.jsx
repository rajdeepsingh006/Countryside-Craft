import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Sparkles,
  Package,
  Eye,
  X,
  Check,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  Layers,
  ArrowUp,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { VideoThumbnail } from '../common/VideoThumbnail';
import { parseVideoUrl, isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';

export const AdminProducts = () => {
  const { categories, refreshData, showToast } = useStore();
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: 799,
    originalPrice: 999,
    description: '',
    tagline: '',
    detailedStory: '',
    material: '450 GSM Heavyweight Organic Canvas',
    dimensions: '16" H x 15" W x 4" Gusset',
    handleLength: '11" Shoulder Drop',
    closureType: 'Antiqued Brass Zipper',
    images: [],
    video: '',
    videoThumbnail: '',
    stock: 25,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    tags: ['Tote Bag', 'Handcrafted', 'Canvas'],
    features: ['100% Heavy Cotton Canvas', 'Reinforced Cross-Box Handles', 'Internal Zipper Pouch'],
  });

  // Multiple Images Management State
  const [imageList, setImageList] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [bulkUrlsInput, setBulkUrlsInput] = useState('');
  const [showBulkUrlInput, setShowBulkUrlInput] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProducts({ limit: 100 });
      const prods = res.products || (Array.isArray(res) ? res : []);
      setAdminProducts(prods);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const filteredProducts = adminProducts.filter((p) => {
    const catSlug = p.category?.slug || p.category;
    if (categoryFilter !== 'all' && catSlug !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (p.name || '').toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const defaultCat = categories[0]?._id || categories[0]?.slug || '';
    const initialImages = [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ];
    setFormData({
      name: '',
      slug: '',
      category: defaultCat,
      price: 799,
      originalPrice: 999,
      description: '',
      tagline: '',
      detailedStory: '',
      material: '450 GSM Heavyweight Organic Canvas',
      dimensions: '16" H x 15" W x 4" Gusset',
      handleLength: '11" Shoulder Drop',
      closureType: 'Antiqued Brass Zipper',
      images: initialImages,
      video: '',
      videoThumbnail: '',
      stock: 25,
      isBestseller: false,
      isNewArrival: true,
      isActive: true,
      tags: ['Tote Bag', 'Handcrafted', 'Canvas'],
      features: ['100% Heavy Cotton Canvas', 'Reinforced Handles', 'Internal Zipper Pocket'],
    });
    setImageList(initialImages);
    setNewImageUrl('');
    setBulkUrlsInput('');
    setShowBulkUrlInput(false);
    setTagsInput('Tote Bag, Handcrafted, Canvas');
    setFeaturesInput('100% Heavy Cotton Canvas\nReinforced Handles\nInternal Zipper Pocket');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const currentImgs = Array.isArray(product.images) ? product.images : [];

    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category?._id || product.category?.slug || product.category || '',
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      description: product.description || '',
      tagline: product.tagline || '',
      detailedStory: product.detailedStory || '',
      material: product.material || '450 GSM Heavyweight Organic Canvas',
      dimensions: product.dimensions || '16" H x 15" W x 4" Gusset',
      handleLength: product.handleLength || '11" Shoulder Drop',
      closureType: product.closureType || 'Antiqued Brass Zipper',
      images: currentImgs,
      video: product.video || '',
      videoThumbnail: product.videoThumbnail || '',
      stock: product.stock !== undefined ? product.stock : 25,
      isBestseller: !!product.isBestseller,
      isNewArrival: !!product.isNewArrival,
      isActive: product.isActive !== false,
      tags: product.tags || [],
      features: product.features || [],
    });
    setImageList(currentImgs);
    setNewImageUrl('');
    setBulkUrlsInput('');
    setShowBulkUrlInput(false);
    setTagsInput((product.tags || []).join(', '));
    setFeaturesInput((product.features || []).join('\n'));
    setIsModalOpen(true);
  };

  // Image helpers
  const handleAddSingleImage = () => {
    if (newImageUrl.trim()) {
      setImageList((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
      showToast('Image added to gallery list', 'success');
    }
  };

  const handleAddBulkImages = () => {
    if (!bulkUrlsInput.trim()) return;
    const urls = bulkUrlsInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image'));
    if (urls.length === 0) {
      showToast('No valid http/https URLs found', 'warning');
      return;
    }
    setImageList((prev) => [...prev, ...urls]);
    setBulkUrlsInput('');
    setShowBulkUrlInput(false);
    showToast(`Added ${urls.length} images to product!`, 'success');
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (index) => {
    if (index === 0) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
    showToast('Cover photo updated!', 'info');
  };

  const handleMultiFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setImageList((prev) => [...prev, loadEvt.target.result]);
      };
      reader.readAsDataURL(file);
    });
    showToast(`Loaded ${files.length} local images for upload`, 'success');
  };

  const handleVideoUrlChange = (url) => {
    const trimmed = url.trim();
    const autoThumbnail = getVideoThumbnail(trimmed) || '';
    setFormData((prev) => ({
      ...prev,
      video: url,
      videoThumbnail: prev.videoThumbnail ? prev.videoThumbnail : autoThumbnail,
    }));
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file (.mp4, .mov, .webm)', 'warning');
      return;
    }
    const uploadData = new FormData();
    uploadData.append('files', file);
    setVideoUploading(true);
    showToast('Uploading video to Cloudinary... Please wait', 'info');
    try {
      const res = await adminService.uploadFiles(uploadData);
      const uploadedFile = res?.files?.[0];
      if (uploadedFile?.url) {
        const videoUrl = uploadedFile.url;
        const posterUrl = getVideoThumbnail(videoUrl) || '';
        setFormData((prev) => ({
          ...prev,
          video: videoUrl,
          videoThumbnail: posterUrl,
        }));
        showToast('Video uploaded and linked successfully!', 'success');
      } else {
        showToast('Video upload failed on server', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload video', 'error');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Product name is required', 'warning');
      return;
    }

    if (imageList.length === 0 && !formData.video?.trim()) {
      showToast('Please add at least 1 image or video showcase for this product.', 'warning');
      return;
    }

    const tags = tagsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const features = featuresInput.split('\n').map((s) => s.trim()).filter(Boolean);

    const slug =
      formData.slug?.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const discountPercent =
      formData.originalPrice && formData.price && formData.originalPrice > formData.price
        ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
        : 0;

    const payload = {
      ...formData,
      category: formData.category || (categories[0]?._id || categories[0]?.slug || ''),
      slug,
      images: imageList,
      video: formData.video?.trim() || '',
      videoThumbnail: formData.videoThumbnail?.trim() || '',
      tags,
      features,
      discountPercent,
    };

    setSaving(true);
    try {
      if (editingProduct) {
        const updated = await adminService.updateProduct(editingProduct._id, payload);
        const updatedProduct = updated.product || updated;
        setAdminProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? updatedProduct : p))
        );
        showToast('Product updated successfully!', 'success');
      } else {
        const created = await adminService.createProduct(payload);
        const newProduct = created.product || created;
        setAdminProducts((prev) => [newProduct, ...prev]);
        showToast('New product added to catalog!', 'success');
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product on server', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      try {
        await adminService.deleteProduct(id);
        setAdminProducts((prev) => prev.filter((p) => p._id !== id));
        await refreshData();
        showToast(`Product "${name}" deleted.`, 'info');
      } catch {
        showToast('Failed to delete product from server', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#B9C9E7]/50 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8E9DBE] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or slug..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
          />
        </div>

        {/* Filter, Refresh & Add Product */}
        <div className="flex items-center space-x-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({adminProducts.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchAdminProducts}
            title="Refresh Catalog Data"
            className="p-2 rounded-xl bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] border border-[#B9C9E7] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md active:scale-98 cursor-pointer border border-[#EFC0DA]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tote</span>
          </button>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#B9C9E7]/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EEF3FA]/60 border-b border-[#B9C9E7]/40 text-[#4B566E] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tote Bag</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Photos</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3FA]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#6A758E]">
                    Loading store products from database...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#6A758E]">
                    No tote products found. Click "+ Add New Tote" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const hasImage = Array.isArray(product.images) && product.images.length > 0 && Boolean(product.images[0]);
                  const hasVideo = Boolean(product.video && product.video.trim());

                  return (
                    <tr key={product._id} className="hover:bg-[#EEF3FA]/30 transition-colors">
                      {/* Product Name & Cover Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {hasImage ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-14 object-cover rounded-xl bg-[#EEF3FA] border border-[#B9C9E7]/60 shrink-0"
                            />
                          ) : hasVideo ? (
                            <div className="w-12 h-14 rounded-xl overflow-hidden shrink-0 border border-[#B9C9E7]/60">
                              <VideoThumbnail
                                videoUrl={product.video}
                                posterUrl={product.videoThumbnail}
                                playIconSize="sm"
                                showBadge={false}
                                className="w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-14 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] flex flex-col items-center justify-center shrink-0 text-[#8A7A6C]">
                              <Sparkles className="w-4 h-4 text-[#D91680]" />
                              <span className="text-[9px] font-bold mt-0.5">No Img</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-[#1A1F2C] truncate max-w-xs">{product.name}</h4>
                              {hasVideo && (
                                <span className="text-[9px] bg-[#1A1F2C] text-[#DBE586] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                                  ▶ Video
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-[#8E9DBE]">{product.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#EEF3FA] text-[#1A1F2C] font-semibold text-[11px] border border-[#B9C9E7]/40">
                          {product.category?.name || product.categoryName || product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-black text-[#1A1F2C]">
                        {formatCurrency(product.price)}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-[#8E9DBE] line-through block font-normal">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            product.stock <= 5 ? 'text-amber-600' : 'text-emerald-700'
                          }`}
                        >
                          {product.stock ?? 0} left
                        </span>
                      </td>

                      {/* Photos & Media Count */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 w-max">
                          <span className="px-2 py-0.5 rounded-lg bg-[#FAF9F6] border border-[#B9C9E7] text-[11px] font-bold text-[#1A1F2C] flex items-center space-x-1">
                            <Layers className="w-3 h-3 text-[#D91680]" />
                            <span>{Array.isArray(product.images) ? product.images.length : 0}</span>
                          </span>
                          {hasVideo && (
                            <span className="text-[10px] bg-[#1A1F2C] text-[#DBE586] font-bold px-1.5 py-0.5 rounded">
                              +Vid
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isBestseller && (
                            <span className="px-2 py-0.5 rounded-md bg-[#DBE586] text-[#343C05] text-[10px] font-black">
                              Bestseller
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="px-2 py-0.5 rounded-md bg-[#EFC0DA] text-[#86124F] text-[10px] font-black">
                              New
                            </span>
                          )}
                          {!product.isActive && (
                            <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-700 text-[10px] font-bold">
                              Hidden
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded-lg bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] transition-colors cursor-pointer"
                            title="Edit Product Details & Photos"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-[#B9C9E7]/60 max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10 animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#EEF3FA] border-b border-[#B9C9E7]/40 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#D91680]" />
                <h3 className="text-base font-serif-display font-bold text-[#1A1F2C]">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Handcrafted Tote Bag'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#6A758E] hover:bg-[#DEE8F7] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Jaipur Indigo Dabu Tote"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">URL Slug (Auto-generated if empty)</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. royal-jaipur-indigo-dabu-tote"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Category</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id || c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Multiple Product Images Manager */}
              <div className="p-4 rounded-3xl bg-[#EEF3FA]/50 border border-[#B9C9E7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-[#D91680]" />
                    <span className="font-bold text-[#1A1F2C] uppercase tracking-wider text-[11px]">
                      Product Photos Gallery ({imageList.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6A758E]">
                    ★ First image is the primary cover
                  </span>
                </div>

                {/* Images Thumbnail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {imageList.map((url, index) => (
                    <div
                      key={index}
                      className={`relative group rounded-2xl overflow-hidden bg-white border ${
                        index === 0 ? 'border-[#D91680] ring-2 ring-[#D91680]/30 shadow-md' : 'border-[#B9C9E7]'
                      } aspect-square flex flex-col justify-between p-1`}
                    >
                      {isVideoUrl(url) ? (
                        <div className="w-full h-full rounded-xl overflow-hidden relative">
                          <VideoThumbnail
                            videoUrl={url}
                            className="w-full h-full"
                            playIconSize="sm"
                            badgeText="VIDEO"
                          />
                        </div>
                      ) : (
                        <img
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      )}
                      
                      {/* Cover Badge */}
                      {index === 0 ? (
                        <span className="absolute top-1.5 left-1.5 bg-[#D91680] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          Cover Photo
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(index)}
                          className="absolute top-1.5 left-1.5 bg-black/70 hover:bg-[#D91680] text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Make cover image"
                        >
                          Set Cover
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                        title="Delete photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Multiple Images Controls */}
                <div className="space-y-2 pt-2 border-t border-[#B9C9E7]/40">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste Image or Video URL (https://...)"
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
                      onClick={() => setShowBulkUrlInput(!showBulkUrlInput)}
                      className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      {showBulkUrlInput ? 'Hide Bulk' : 'Paste Bulk URLs'}
                    </button>
                  </div>

                  {showBulkUrlInput && (
                    <div className="p-3 bg-white rounded-2xl border border-[#B9C9E7] space-y-2">
                      <p className="text-[10px] text-[#6A758E]">
                        Paste multiple photo/video URLs (one per line or separated by commas):
                      </p>
                      <textarea
                        rows={3}
                        value={bulkUrlsInput}
                        onChange={(e) => setBulkUrlsInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-1...&#10;https://.../video.mp4"
                        className="w-full p-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] font-mono text-[11px] focus:outline-none resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddBulkImages}
                        className="px-4 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        ✓ Import All Media
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-1">
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-[#EEF3FA] text-[#1A1F2C] border border-[#B9C9E7] rounded-xl text-xs font-bold transition-colors shadow-2xs">
                      <UploadCloud className="w-3.5 h-3.5 text-[#D91680]" />
                      <span>Upload Multiple Photo Files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultiFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-[#6A758E]">
                      Select 1 or more photos from computer
                    </span>
                  </div>
                </div>
              </div>

              {/* Tagline & Specs */}
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Handcrafted Bagru Mud Resist on 450 GSM Heavy Canvas"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Available Stock Units</label>
                <input
                  type="number"
                  value={formData.stock || 0}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                />
              </div>

              {/* Product Showcase Video Section */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#D91680]/10 text-[#D91680] flex items-center justify-center font-bold text-xs">
                      ▶
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A1F2C] text-xs sm:text-sm">Product Showcase Video</h4>
                      <p className="text-[11px] text-[#6A758E]">
                        Add a YouTube link, Vimeo, or direct MP4/WebM video URL to showcase your craft.
                      </p>
                    </div>
                  </div>
                  {formData.video && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, video: '', videoThumbnail: '' })}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                    >
                      Clear Video
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1F2C] mb-1">
                      Video Link (YouTube, Vimeo, MP4)
                    </label>
                    <input
                      type="text"
                      value={formData.video || ''}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or .mp4"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] text-xs focus:outline-none focus:border-[#D91680]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1F2C] mb-1">
                      Video Poster / Thumbnail URL (Auto-detected or Custom)
                    </label>
                    <input
                      type="text"
                      value={formData.videoThumbnail || ''}
                      onChange={(e) => setFormData({ ...formData, videoThumbnail: e.target.value })}
                      placeholder="Auto-detected or paste custom thumbnail"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] text-xs focus:outline-none focus:border-[#D91680]"
                    />
                  </div>
                </div>

                {/* Direct Video File Upload Button */}
                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#EADBCE]/50">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-[#EEF3FA] text-[#1A1F2C] border border-[#B9C9E7] rounded-xl text-xs font-bold transition-colors shadow-2xs">
                    {videoUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 text-[#D91680] animate-spin" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-[#D91680]" />
                    )}
                    <span>{videoUploading ? 'Uploading Video to Cloudinary...' : 'Upload Video File from Computer (.mp4, .mov)'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      disabled={videoUploading}
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-[#6A758E]">
                    Automatic Cloudinary video hosting with instant playable preview
                  </span>
                </div>

                {/* Live Video Preview in Admin Form */}
                {formData.video && formData.video.trim() && (
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white border border-[#EADBCE] mt-2">
                    <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-[#B9C9E7]/60">
                      <VideoThumbnail
                        videoUrl={formData.video.trim()}
                        posterUrl={formData.videoThumbnail?.trim()}
                        showBadge={true}
                        badgeText="PREVIEW"
                        playIconSize="sm"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {parseVideoUrl(formData.video.trim()).type.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-[#1A1F2C] truncate">
                          Thumbnail Visible & Ready
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6A758E] truncate mt-0.5 font-mono">
                        {formData.video}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-[#B9C9E7]/40">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller || false}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="rounded text-[#D91680] accent-[#D91680]"
                  />
                  <span className="font-bold text-[#1A1F2C]">Mark as Bestseller</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival || false}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-[#D91680] accent-[#D91680]"
                  />
                  <span className="font-bold text-[#1A1F2C]">Mark as New Arrival</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#D91680] accent-[#D91680]"
                  />
                  <span className="font-bold text-[#1A1F2C]">Active in Catalog</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#B9C9E7]/40">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors disabled:opacity-50 cursor-pointer border border-[#EFC0DA]"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save Product Changes' : 'Publish Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase cursor-pointer"
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
