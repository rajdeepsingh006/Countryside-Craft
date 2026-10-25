import React, { useState, useMemo } from 'react';
import { Search, X, Star, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { getAssetUrl } from '../../utils/assetHelper';

export const SearchModal = ({ onNavigate }) => {
  const { isSearchOpen, closeSearch, products, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [searchTerm, products]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (slug) => {
    closeSearch();
    onNavigate('product-detail', slug);
  };
  const handleSelectCategory = (catSlug) => {
    closeSearch();
    onNavigate('products', catSlug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div onClick={closeSearch} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#E7DFD2] max-w-2xl w-full overflow-hidden z-10">
        <div className="p-4 sm:p-5 border-b border-[#E7DFD2] bg-[#F8F5EF] flex items-center space-x-3">
          <Search className="w-5 h-5 text-[#244537] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by print, occasion, indigo, botanical, wedding..."
            className="flex-1 bg-transparent text-[#193428] placeholder-[#6D756D] text-sm sm:text-base font-semibold focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-[#6D756D] hover:bg-[#F0EBE1] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="text-xs font-bold text-[#6D756D] hover:text-[#193428] px-2.5 py-1 rounded-lg border border-[#E7DFD2] hover:bg-[#F0EBE1] cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="px-5 py-3 bg-[#F8F5EF]/70 border-b border-[#E7DFD2] flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[#6D756D] font-bold shrink-0 flex items-center space-x-1">
            <Tag className="w-3 h-3 text-[#A94F2B]" />
            <span>Popular:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleSelectCategory(cat.slug)}
              className="px-3 py-1 rounded-full bg-white hover:bg-[#244537] hover:text-white text-[#34443A] border border-[#E7DFD2] shrink-0 font-semibold transition-colors cursor-pointer"
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {searchTerm.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#6D756D]">
              <p>
                Type keywords like <span className="font-bold text-[#244537]">"Madhubani"</span>,{' '}
                <span className="font-bold text-[#244537]">"Floral"</span>,{' '}
                <span className="font-bold text-[#244537]">"Festive"</span>, or{' '}
                <span className="font-bold text-[#244537]">"Indigo"</span>.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6D756D]">
              <p>No tote bag designs found matching "{searchTerm}".</p>
              <button
                onClick={() => {
                  closeSearch();
                  onNavigate('products');
                }}
                className="mt-3 text-[#244537] font-bold underline cursor-pointer"
              >
                Browse all available tote bags →
              </button>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod._id}
                onClick={() => handleSelectProduct(prod.slug)}
                className="flex items-center space-x-3.5 p-2.5 rounded-2xl hover:bg-[#F0EBE1] cursor-pointer transition-colors border border-transparent hover:border-[#E7DFD2]"
              >
                {prod.images?.[0] ? (
                  <img
                    src={getAssetUrl(prod.images[0])}
                    alt={prod.name}
                    className="w-14 h-14 object-cover rounded-xl bg-white border border-[#E7DFD2] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F8F5EF] to-[#F0EBE1] border border-[#E7DFD2] flex flex-col items-center justify-center text-center shrink-0 text-[#244537]">
                    <Sparkles className="w-4 h-4 opacity-75" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#193428] truncate">
                    {prod.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-[#6D756D] mt-0.5">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                      {prod.ratingAverage || 0}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black text-[#193428]">
                    {formatCurrency(prod.price)}
                  </span>
                  <span className="text-[10px] text-[#A94F2B] block font-bold">View →</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
