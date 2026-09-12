import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Search, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

export const ProductsPage = ({ initialCategory, onNavigate }) => {
  const { products, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState('popularity');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const allTags = useMemo(() => {
    const set = new Set();
    products.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;
        const prodCatSlug = p.category?.slug || p.category;
        if (selectedCategory !== 'all' && prodCatSlug !== selectedCategory) return false;
        if (selectedTag !== 'all' && !(p.tags || []).includes(selectedTag)) return false;
        if (p.price > maxPrice) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            (p.name || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'rating') return (b.ratingAverage || 0) - (a.ratingAverage || 0);
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || (b.ratingCount || 0) - (a.ratingCount || 0);
      });
  }, [products, selectedCategory, selectedTag, maxPrice, sortBy, searchQuery]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedTag !== 'all' ? 1 : 0) +
    (maxPrice < 2000 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setMaxPrice(2000);
    setSearchQuery('');
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-4 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story & Category Header */}
        <div className="pt-2 pb-3 flex flex-col gap-1.5 border-b border-[#EADDC6]/40 mb-4">
          <div className="flex items-center gap-1.5 text-[#D91680]">
            <Sparkles className="w-3.5 h-3.5 text-[#D91680]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D91680]">Artisan Catalog</span>
          </div>
          <h1 className="text-xl sm:text-4xl font-serif-display font-bold text-[#1A1F2C]">
            Handcrafted Artisan Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#6A5E54] leading-relaxed max-w-2xl">
            Explore our curated range of handcrafted stationery kits, traditional Shagun cards, artisan hand-painted jute bags, and durable eco-friendly carriers.
          </p>
        </div>

        {/* Sticky Filter & Search Toolbar on Mobile */}
        <div className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md pb-3 pt-1 flex flex-col gap-2.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Search Bar */}
          <div className="relative w-full flex items-center h-10 bg-white rounded-full shadow-sm px-3.5 border border-[#F1E9DF]">
            <Search className="w-4 h-4 text-[#8A7E72] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by print, fabric or craft..."
              className="w-full bg-transparent border-none outline-none text-[#1A1F2C] text-[13px] px-2.5 placeholder:text-[#8A7E72]/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear Search"
                className="text-[#8A7E72] hover:text-[#1A1F2C] shrink-0 flex items-center p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collection Category Pills (Scrollable) */}
          <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 pb-0.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full font-bold text-[12px] shadow-sm flex items-center gap-1 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#D91680] text-white'
                  : 'bg-white text-[#4A443C] hover:text-[#D91680] border border-[#F1E9DF]'
              }`}
            >
              <span>All Collections</span>
              <span className={`text-[11px] ${selectedCategory === 'all' ? 'text-white/80' : 'text-[#8A7E72]'}`}>
                ({products.filter((p) => p.isActive).length})
              </span>
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => (p.category?.slug || p.category) === cat.slug && p.isActive).length;
              const isCatActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full font-bold text-[12px] shadow-sm flex items-center gap-1 transition-all ${
                    isCatActive
                      ? 'bg-[#D91680] text-white'
                      : 'bg-white text-[#4A443C] hover:text-[#D91680] border border-[#F1E9DF]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[11px] ${isCatActive ? 'text-white/80' : 'text-[#8A7E72]'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-bar: Item count & Sort / Filter triggers */}
          <div className="flex items-center justify-between h-9 pt-0.5">
            <span className="text-[11px] text-[#6A5E54] tracking-wide font-medium">
              Showing <strong className="text-[#1A1F2C] font-semibold">{filteredProducts.length}</strong> of {products.length} items
            </span>

            <div className="flex items-center gap-2">
              {/* Sort Selector Trigger */}
              <div className="h-8 px-3 rounded-full bg-white border border-[#F1E9DF] shadow-sm flex items-center gap-1 text-[#1A1F2C] text-[11px] font-bold">
                <span className="text-amber-500">🔥</span>
                <select
                  aria-label="Sort products by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-[#1A1F2C] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="popularity">Bestselling</option>
                  <option value="rating">★ Top Rated</option>
                  <option value="price-low">Price: Low-High</option>
                  <option value="price-high">Price: High-Low</option>
                  <option value="newest">✨ New Arrivals</option>
                </select>
              </div>

              {/* Filter Trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="h-8 px-3 rounded-full bg-white border border-[#F1E9DF] shadow-sm flex items-center gap-1 text-[#1A1F2C] text-[11px] font-bold cursor-pointer hover:bg-[#FAF7F2]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D91680]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FDF2F8] text-[#BE185D] text-[9px] font-bold flex items-center justify-center border border-[#EFC0DA]">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layout with Sidebar Filters (Desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mt-2">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            
            {/* Price Filter */}
            <div className="p-5 rounded-3xl bg-white border border-[#F1E9DF] space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1F2C] flex items-center justify-between">
                <span>Max Price</span>
                <span className="text-[#D91680] font-black">₹{maxPrice}</span>
              </h4>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D91680] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6A5E54] font-semibold">
                <span>₹400</span>
                <span>₹1,200</span>
                <span>₹2,000+</span>
              </div>
            </div>

            {/* Tag / Style Filter */}
            <div className="p-5 rounded-3xl bg-white border border-[#B9C9E7]/50 space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1F2C]">
                Pattern & Craft Style
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedTag === 'all'
                      ? 'bg-[#D91680] text-white'
                      : 'bg-[#EEF3FA]/50 text-[#2C3549] hover:bg-[#EEF3FA] border border-[#B9C9E7]'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-[#D91680] text-white'
                        : 'bg-[#EEF3FA]/50 text-[#2C3549] hover:bg-[#EEF3FA] border border-[#B9C9E7]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Bulk Ordering Promo Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#161C2A] to-[#252E42] text-white space-y-3 border border-[#B9C9E7]/30 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#DBE586]">
                Bulk & Wedding Favors
              </span>
              <h4 className="font-serif-display font-bold text-sm text-white leading-snug">
                Planning Custom Printed Totes for an Event?
              </h4>
              <p className="text-[11px] text-[#A9B8D4] leading-relaxed">
                Get custom monograms, gold foil branding, and wholesale volume pricing for orders above 25 pieces.
              </p>
              <button
                onClick={() => onNavigate('about')}
                className="w-full py-2.5 rounded-xl bg-[#DBE586] hover:bg-[#c9d46e] text-[#2C3504] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Inquire for Bulk →
              </button>
            </div>

          </div>

          {/* Product Grid Area (3 cols) */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#B9C9E7]/50 p-8 sm:p-12 text-center space-y-4 shadow-2xs">
                <div className="w-14 h-14 rounded-full bg-[#EEF3FA] text-[#8E9DBE] mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6 opacity-60" />
                </div>
                <h3 className="text-base font-serif-display font-bold text-[#1A1F2C]">
                  No matching handcrafted items found
                </h3>
                <p className="text-xs text-[#6A758E] max-w-sm mx-auto">
                  Try clearing your search query or adjusting your price slider to see more products.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#EFC0DA]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile / Tablet Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          
          {/* Bottom Sheet Container */}
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col border-t border-[#B9C9E7]/60 z-10 animate-slide-up pb-[env(safe-area-inset-bottom)]">
            
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-[#D2DCEE] rounded-full mx-auto mt-3 mb-1" />

            {/* Header */}
            <div className="px-5 py-3 border-b border-[#EEF3FA] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D91680]" />
                <h3 className="text-sm font-serif-display font-bold text-[#1A1F2C]">
                  Filter Tote Bags
                </h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6A758E] hover:bg-[#EEF3FA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Category Filter */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1F2C]">
                  Category / Collection
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#D91680] text-white border-[#D91680]'
                        : 'bg-[#FCFBFA] text-[#2C3549] border-[#E8DFD3]'
                    }`}
                  >
                    All Collections
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border truncate cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'bg-[#D91680] text-white border-[#D91680]'
                          : 'bg-[#FCFBFA] text-[#2C3549] border-[#E8DFD3]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div className="space-y-3 pt-4 border-t border-[#EEF3FA]">
                <div className="flex justify-between items-center text-xs font-bold text-[#1A1F2C]">
                  <span>Maximum Price</span>
                  <span className="text-[#D91680] font-black text-sm">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#D91680] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6A758E] font-semibold">
                  <span>₹400</span>
                  <span>₹1,200</span>
                  <span>₹2,000+</span>
                </div>
              </div>

              {/* Pattern & Style Tags */}
              <div className="space-y-3 pt-4 border-t border-[#EEF3FA]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1F2C]">
                  Pattern & Craft Style
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTag('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      selectedTag === 'all'
                        ? 'bg-[#D91680] text-white'
                        : 'bg-[#EEF3FA]/50 text-[#2C3549] hover:bg-[#EEF3FA] border border-[#B9C9E7]'
                    }`}
                  >
                    All Tags
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-[#D91680] text-white'
                          : 'bg-[#EEF3FA]/50 text-[#2C3549] hover:bg-[#EEF3FA] border border-[#B9C9E7]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Sticky Actions */}
            <div className="p-4 bg-[#FCFBFA] border-t border-[#B9C9E7]/40 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 rounded-xl border border-[#B9C9E7] text-xs font-bold text-[#4B566E] hover:bg-[#EEF3FA] cursor-pointer min-h-[44px]"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-2 py-3 rounded-xl bg-[#D91680] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#BE0E6E] cursor-pointer min-h-[44px]"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

