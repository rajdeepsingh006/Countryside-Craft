import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  if (!settings.announcementEnabled || !settings.announcementBarText) {
    return null;
  }

  return (
    <div className="bg-[#2D2A26] text-[#F4EFE6] px-4 py-2 text-xs md:text-sm font-medium tracking-wide border-b border-[#3E3A35]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 text-amber-200/90 hidden sm:flex">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Artisanal Small Batches</span>
        </div>
        
        <div className="flex-1 text-center font-serif-display text-[13px] tracking-wider text-amber-100/95 font-medium px-2">
          {settings.announcementBarText}
        </div>

        <div className="flex items-center space-x-2 text-[#C2B59B] hidden md:flex">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Eco-Friendly Organic Canvas</span>
        </div>
      </div>
    </div>
  );
};
