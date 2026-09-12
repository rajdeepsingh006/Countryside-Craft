import React, { useState } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminProducts: React.FC = () => {
  const { products, categories, saveProduct, deleteProduct, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: 'block-prints',
    categoryName: 'Block Prints & Dabu',
    price: 799,
    originalPrice: 999,
    description: '',
    tagline: '',
    detailedStory: '',
    material: '450 GSM Heavyweight Organic Canvas',
    dimensions: '16" H x 15" W x 4" Gusset',
    handleLength: '11" Shoulder Drop',
    closureType: 'Antiqued Brass Zipper',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    video: '',
    stock: 25,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    tags: ['Tote Bag', 'Handcrafted', 'Canvas'],
    features: ['100% Heavy Cotton Canvas', 'Reinforced Cross-Box Handles', 'Internal Zipper Pouch']
  });

  const [imagesInput, setImagesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: categories[0]?.slug || 'block-prints',
      categoryName: categories[0]?.name || 'Block Prints & Dabu',
      price: 799,
      originalPrice: 999,
      description: '',
      tagline: '',
      detailedStory: '',
      material: '450 GSM Heavyweight Organic Canvas',
      dimensions: '16" H x 15" W x 4" Gusset',
      handleLength: '11" Shoulder Drop',
      closureType: 'Antiqued Brass Zipper',
      images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
      video: '',
      stock: 25,
      isBestseller: false,
      isNewArrival: true,
      isActive: true,
      tags: ['Tote Bag', 'Handcrafted', 'Canvas'],
      features: ['100% Heavy Cotton Canvas', 'Reinforced Handles', 'Internal Zipper Pocket']
    });
    setImagesInput('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80');
    setTagsInput('Tote Bag, Handcrafted, Canvas');
    setFeaturesInput('100% Heavy Cotton Canvas\nReinforced Handles\nInternal Zipper Pocket');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setImagesInput(p.images.join('\n'));
    setTagsInput(p.tags.join(', '));
    setFeaturesInput(p.features.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Product name is required', 'warning');
      return;
    }

    const images = imagesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const features = featuresInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const selectedCat = categories.find((c) => c.slug === formData.category);
    const categoryName = selectedCat ? selectedCat.name : formData.categoryName || 'Tote Bags';

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

    if (editingProduct) {
      saveProduct({
        ...formData,
        _id: editingProduct._id,
        slug,
        categoryName,
        images: images.length > 0 ? images : editingProduct.images,
        tags,
        features,
        discountPercent
      });
      showToast('Product updated successfully!', 'success');
    } else {
      saveProduct({
        ...formData,
        slug,
        categoryName,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
        tags,
        features,
        discountPercent,
        ratingAverage: 5.0,
        ratingCount: 1,
        reviewIds: []
      });
      showToast('New product added to catalog!', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      deleteProduct(id);
      showToast(`Product "${name}" deleted.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8DFD0] shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or slug..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
          />
        </div>

        {/* Filter and Add Product */}
        <div className="flex items-center space-x-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tote</span>
          </button>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DFD0] text-[#7A6D5C] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tote Bag</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  
                  {/* Image & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded-xl bg-[#F5EFE6] border border-[#D5C7B2] shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-[#241F18] hover:text-[#8C5E3C] transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-[#8C7E6C] font-mono">
                          /{product.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-[#544A3C] font-medium">
                    {product.categoryName}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#241F18]">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-[#8C7E6C] line-through block">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold ${
                        product.stock <= 5 ? 'text-amber-600 font-bold' : 'text-[#241F18]'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isBestseller && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Bestseller
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          New
                        </span>
                      )}
                      {!product.isActive && (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#EDE3D2] text-[#8C5E3C] transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-[#E8DFD0] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]">
              <h3 className="font-serif-display font-bold text-lg text-[#241F18]">
                {editingProduct ? 'Edit Artisan Tote Product' : 'Add New Handcrafted Tote'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#8C7E6C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Jaipur Indigo Dabu Tote"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">URL Slug (Auto-generated if empty)</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. royal-jaipur-indigo-dabu-tote"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Category</label>
                  <select
                    value={formData.category || 'block-prints'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3B3329] mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Handcrafted Bagru Mud Resist on 450 GSM Heavy Canvas"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3B3329] mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3B3329] mb-1">
                  Image URLs (One URL per line)
                </label>
                <textarea
                  rows={2}
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none font-mono text-[11px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Available Stock Units</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3B3329] mb-1">Video MP4 URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.video || ''}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    placeholder="https://assets.mixkit.co/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-[#E8DFD0]">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller || false}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="rounded text-[#8C5E3C] accent-[#8C5E3C]"
                  />
                  <span className="font-semibold text-[#241F18]">Mark as Bestseller</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival || false}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-[#8C5E3C] accent-[#8C5E3C]"
                  />
                  <span className="font-semibold text-[#241F18]">Mark as New Arrival</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#8C5E3C] accent-[#8C5E3C]"
                  />
                  <span className="font-semibold text-[#241F18]">Active in Catalog</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#E8DFD0]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs uppercase"
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
