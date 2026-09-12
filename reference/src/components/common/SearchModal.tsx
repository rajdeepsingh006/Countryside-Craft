import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

interface SearchModalProps {
  onNavigate: (view: string, param?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate }) => {
  const { isSearchOpen, closeSearch, products, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.categoryName?.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)))
    );
  }, [searchTerm, products]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (slug: string) => {
    closeSearch();
    onNavigate('product-detail', slug);
  };

  const handleSelectCategory = (catSlug: string) => {
    closeSearch();
    onNavigate('products', catSlug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        onClick={closeSearch}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal */}
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DCD0BE] max-w-2xl w-full overflow-hidden z-10 animate-slide-down">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E3D7C5] bg-[#F4EFE6] flex items-center space-x-3">
          <Search className="w-5 h-5 text-[#8C5E3C] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by print, occasion, indigo, botanical, wedding..."
            className="flex-1 bg-transparent text-[#28231C] placeholder-[#8A7D6C] text-sm sm:text-base font-medium focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-[#8A7D6C] hover:bg-[#EAE0D0]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="text-xs font-semibold text-[#6E6353] hover:text-[#28231C] px-2.5 py-1 rounded-md border border-[#D5C7B3] hover:bg-[#EAE0D0]"
          >
            ESC
          </button>
        </div>

        {/* Categories Chips */}
        <div className="px-5 py-3 bg-[#EFE7D8] border-b border-[#E0D3BF] flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[#7A6D5C] font-semibold shrink-0 flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>Popular:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleSelectCategory(cat.slug)}
              className="px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#8C5E3C] hover:text-white text-[#4A4032] border border-[#D2C3AD] shrink-0 font-medium transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {searchTerm.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#8A7D6C]">
              <p>Type keywords like <span className="font-semibold text-[#8C5E3C]">"Indigo"</span>, <span className="font-semibold text-[#8C5E3C]">"Botanical"</span>, <span className="font-semibold text-[#8C5E3C]">"Wedding"</span>, or <span className="font-semibold text-[#8C5E3C]">"Mandala"</span>.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8A7D6C]">
              <p>No tote bag designs found matching "{searchTerm}".</p>
              <button
                onClick={() => {
                  closeSearch();
                  onNavigate('products');
                }}
                className="mt-3 text-[#8C5E3C] font-semibold underline"
              >
                Browse all available tote bags →
              </button>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod._id}
                onClick={() => handleSelectProduct(prod.slug)}
                className="flex items-center space-x-3.5 p-2.5 rounded-xl hover:bg-[#EFE8DC] cursor-pointer transition-colors border border-transparent hover:border-[#DED2C0]"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-14 h-14 object-cover rounded-lg bg-white border border-[#DACFBD] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#29241E] truncate">
                    {prod.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-[#7A6D5C] mt-0.5">
                    <span>{prod.categoryName}</span>
                    <span>•</span>
                    <span className="flex items-center text-amber-600 font-medium">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {prod.ratingAverage}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-[#29241E]">
                    {formatCurrency(prod.price)}
                  </span>
                  <span className="text-[10px] text-[#8C5E3C] block font-medium">View →</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
