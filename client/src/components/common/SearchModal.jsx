import React, { useState, useMemo } from 'react';
import { Search, X, Star, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

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
      <div onClick={closeSearch} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#B9C9E7]/60 max-w-2xl w-full overflow-hidden z-10">
        <div className="p-4 sm:p-5 border-b border-[#B9C9E7]/40 bg-[#EEF3FA] flex items-center space-x-3">
          <Search className="w-5 h-5 text-[#D91680] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by print, occasion, indigo, botanical, wedding..."
            className="flex-1 bg-transparent text-[#1A1F2C] placeholder-[#6A758E] text-sm sm:text-base font-semibold focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-[#6A758E] hover:bg-[#DEE8F7] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="text-xs font-bold text-[#4B566E] hover:text-[#1A1F2C] px-2.5 py-1 rounded-lg border border-[#B9C9E7] hover:bg-[#DEE8F7] cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="px-5 py-3 bg-[#FAF9F6] border-b border-[#B9C9E7]/40 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[#6A758E] font-bold shrink-0 flex items-center space-x-1">
            <Tag className="w-3 h-3 text-[#D91680]" />
            <span>Popular:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleSelectCategory(cat.slug)}
              className="px-3 py-1 rounded-full bg-white hover:bg-[#D91680] hover:text-white text-[#2C3549] border border-[#B9C9E7] shrink-0 font-semibold transition-colors cursor-pointer"
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {searchTerm.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#6A758E]">
              <p>
                Type keywords like <span className="font-bold text-[#D91680]">"Madhubani"</span>,{' '}
                <span className="font-bold text-[#D91680]">"Floral"</span>,{' '}
                <span className="font-bold text-[#D91680]">"Festive"</span>, or{' '}
                <span className="font-bold text-[#D91680]">"Indigo"</span>.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6A758E]">
              <p>No tote bag designs found matching "{searchTerm}".</p>
              <button
                onClick={() => {
                  closeSearch();
                  onNavigate('products');
                }}
                className="mt-3 text-[#D91680] font-bold underline cursor-pointer"
              >
                Browse all available tote bags →
              </button>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod._id}
                onClick={() => handleSelectProduct(prod.slug)}
                className="flex items-center space-x-3.5 p-2.5 rounded-2xl hover:bg-[#EEF3FA] cursor-pointer transition-colors border border-transparent hover:border-[#B9C9E7]/60"
              >
                {prod.images?.[0] ? (
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-14 h-14 object-cover rounded-xl bg-white border border-[#B9C9E7]/60 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FAF6F0] to-[#EAE0D4] border border-[#E4D7C8] flex flex-col items-center justify-center text-center shrink-0 text-[#D91680]">
                    <Sparkles className="w-4 h-4 opacity-75" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1A1F2C] truncate">
                    {prod.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-[#6A758E] mt-0.5">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                      {prod.ratingAverage || 0}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black text-[#1A1F2C]">
                    {formatCurrency(prod.price)}
                  </span>
                  <span className="text-[10px] text-[#D91680] block font-bold">View →</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
