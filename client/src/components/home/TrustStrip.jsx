import React from 'react';
import { Star, Truck, Award, Sparkles } from 'lucide-react';

export const TrustStrip = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-1">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {[
        { icon: <Award className="w-4 h-4" />, color: 'text-[#D91680]', bg: 'bg-[#FDF1F7]', title: '5,000+ Totes Handcrafted', sub: 'Small batch artisan production' },
        { icon: <Star className="w-4 h-4 fill-amber-400 text-amber-500" />, color: 'text-amber-500', bg: 'bg-[#FEFCE8]', title: '4.9★ Customer Rating', sub: 'Verified buyer reviews' },
        { icon: <Truck className="w-4 h-4" />, color: 'text-emerald-700', bg: 'bg-[#F0FDF4]', title: '48-Hour Dispatch', sub: 'Express courier across India' },
        { icon: <Sparkles className="w-4 h-4" />, color: 'text-[#E5C378]', bg: 'bg-[#FAF5FF]', title: 'Custom Wedding Favors', sub: 'Gold foil & name printing' },
      ].map(({ icon, color, bg, title, sub }) => (
        <div key={title} className="flex items-center space-x-2.5 sm:space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-[#EAE4DC] shadow-2xs hover:shadow-xs transition-shadow">
          <div className={`p-2 rounded-xl ${bg} ${color} shadow-xs shrink-0 border border-[#EAE4DC]/60`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-[13px] font-bold text-[#1A1F2C] truncate">{title}</p>
            <p className="text-[10px] sm:text-xs text-[#6A758E] truncate">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);


