import React from 'react';
import { Star, Truck, Award, Sparkles, RefreshCcw } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <div className="bg-[#EFE8DC] border-b border-[#DFD3C0] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#D6C7B2]">
          
          <div className="flex items-center space-x-3 pt-2 md:pt-0 md:px-4">
            <div className="p-2 rounded-lg bg-[#FAF6EE] text-[#8C5E3C] shadow-xs shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2A241E]">5,000+ Totes Handcrafted</p>
              <p className="text-[11px] text-[#7A6D5B]">Small batch artisan production</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 md:pt-0 md:px-4">
            <div className="p-2 rounded-lg bg-[#FAF6EE] text-amber-600 shadow-xs shrink-0">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2A241E]">4.9★ Customer Rating</p>
              <p className="text-[11px] text-[#7A6D5B]">Verified buyer reviews</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 md:pt-0 md:px-4">
            <div className="p-2 rounded-lg bg-[#FAF6EE] text-emerald-700 shadow-xs shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2A241E]">48-Hour Dispatch</p>
              <p className="text-[11px] text-[#7A6D5B]">Express courier across India</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 md:pt-0 md:px-4">
            <div className="p-2 rounded-lg bg-[#FAF6EE] text-[#8C5E3C] shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2A241E]">Custom Wedding Favors</p>
              <p className="text-[11px] text-[#7A6D5B]">Gold foil & name printing</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
