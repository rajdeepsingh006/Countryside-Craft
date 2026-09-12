import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const AnnouncementBar = () => {
  const { settings } = useStore();

  if (!settings.announcementEnabled || !settings.announcementBarText) return null;

  return (
    <div className="bg-[#1A1F2C] text-[#FAF9F6] px-4 py-2 text-xs md:text-sm font-medium tracking-wide border-b border-[#2C3345]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center space-x-2 text-[#DBE586] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Artisanal Small Batches</span>
        </div>
        <div className="flex-1 text-center font-serif-display text-[13px] tracking-wider text-[#EFC0DA] font-medium px-2">
          {settings.announcementBarText}
        </div>
        <div className="hidden md:flex items-center space-x-2 text-[#B9C9E7] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Organic Cotton Canvas</span>
        </div>
      </div>
    </div>
  );
};
