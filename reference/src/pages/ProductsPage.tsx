import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

interface ProductsPageProps {
  initialCategory?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ initialCategory, onNavigate }) => {
  const { products, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'rating'>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedTag !== 'all' && !p.tags.includes(selectedTag)) return false;
        if (p.price > maxPrice) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'rating') return b.ratingAverage - a.ratingAverage;
        // Default popularity: bestsellers first, then rating
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.ratingCount - a.ratingCount;
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
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner / Title */}
        <div className="mb-8 pb-6 border-b border-[#E5DAC8]">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#8C5E3C] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#27211A]">
            Handcrafted Printed Tote Bags
          </h1>
          <p className="text-xs sm:text-sm text-[#736654] mt-1 max-w-2xl">
            Explore our curated range of 100% heavy canvas, authentic hand block prints, botanical marigolds, and custom wedding favor totes.
          </p>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#3B362F] text-white shadow-sm'
                : 'bg-[#EDE4D5] text-[#4A4032] hover:bg-[#E0D4C0]'
            }`}
          >
            All Collections ({products.filter((p) => p.isActive).length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug && p.isActive).length;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.slug
                    ? 'bg-[#8C5E3C] text-white shadow-sm'
                    : 'bg-[#EDE4D5] text-[#4A4032] hover:bg-[#E0D4C0]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter Bar & Controls */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD0] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search inside catalog */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this view..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#28231C] placeholder-[#948774] focus:outline-none focus:border-[#8C5E3C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7E6C] hover:text-[#28231C]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results count & Active filter tags */}
          <div className="flex items-center space-x-3 text-xs text-[#6B5F4F]">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of {products.length} totes
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#8C5E3C] hover:underline flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Sort selector & Mobile filter toggle */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <div className="flex items-center space-x-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#D5C7B2] text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8C5E3C]" />
              <label htmlFor="products-sort-by-select" className="text-[#7A6D5B] text-[11px]">Sort:</label>
              <select
                id="products-sort-by-select"
                aria-label="Sort products by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-[#28231C] focus:outline-none cursor-pointer"
              >
                <option value="popularity">🔥 Bestselling</option>
                <option value="rating">★ Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">✨ New Arrivals</option>
              </select>
            </div>

            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#EDE4D5] text-[#3E3529] border border-[#D5C7B2]"
              title="More Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Layout with Sidebar Filters (Desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            
            {/* Price Filter */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8DFD0] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A231C] flex items-center justify-between">
                <span>Max Price</span>
                <span className="text-[#8C5E3C]">₹{maxPrice}</span>
              </h4>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#8C5E3C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C7E6C] font-semibold">
                <span>₹400</span>
                <span>₹1,200</span>
                <span>₹2,000+</span>
              </div>
            </div>

            {/* Tag / Style Filter */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8DFD0] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A231C]">
                Pattern & Craft Style
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    selectedTag === 'all'
                      ? 'bg-[#3B362F] text-white'
                      : 'bg-[#FAF7F2] text-[#554A3B] hover:bg-[#EDE4D5] border border-[#E0D4C0]'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-[#8C5E3C] text-white'
                        : 'bg-[#FAF7F2] text-[#554A3B] hover:bg-[#EDE4D5] border border-[#E0D4C0]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Bulk Ordering Promo Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#302B24] to-[#241F18] text-[#FAF7F2] space-y-3 border border-[#443C30]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Bulk / Wedding Favors
              </span>
              <h4 className="font-serif-display font-bold text-sm text-white leading-snug">
                Planning Custom Printed Totes for an Event?
              </h4>
              <p className="text-[11px] text-[#B8ACA0] leading-relaxed">
                Get custom monograms, gold foil branding, and wholesale volume pricing for orders above 25 pieces.
              </p>
              <button
                onClick={() => onNavigate('about')}
                className="w-full py-2 rounded-xl bg-amber-400/90 hover:bg-amber-400 text-[#241F18] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Inquire for Bulk →
              </button>
            </div>

          </div>

          {/* Product Grid Area (3 cols) */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8DFD0] p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#8C7D69] mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6 opacity-60" />
                </div>
                <h3 className="text-base font-serif-display font-bold text-[#2A231C]">
                  No matching tote bag designs found
                </h3>
                <p className="text-xs text-[#7A6E5E] max-w-sm mx-auto">
                  Try clearing your search query or adjusting your price slider to see more products.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
