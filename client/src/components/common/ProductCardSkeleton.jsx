import React from 'react';

/**
 * Countryside Craft — Product Card Skeleton Loader
 * 
 * Elegant warm linen placeholder with shimmer wave animation for products
 */
export const ProductCardSkeleton = ({ layout = 'grid' }) => {
  if (layout === 'horizontal') {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7DFD2] p-2.5 sm:p-3.5 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch shadow-2xs">
        <div className="w-full sm:w-56 md:w-64 aspect-[16/10] rounded-xl sm:rounded-2xl animate-shimmer" />
        <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
          <div className="space-y-2">
            <div className="w-24 h-3.5 rounded-full animate-shimmer" />
            <div className="w-3/4 h-5 rounded-md animate-shimmer" />
            <div className="w-1/2 h-3.5 rounded-md animate-shimmer" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="w-20 h-5 rounded-md animate-shimmer" />
            <div className="w-28 h-8 rounded-full animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7DFD2] overflow-hidden shadow-2xs flex flex-col p-2.5 sm:p-3.5 space-y-3">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/5] rounded-xl sm:rounded-2xl animate-shimmer" />

      {/* Content Skeleton */}
      <div className="space-y-2 px-1">
        <div className="w-20 h-3 rounded-full animate-shimmer" />
        <div className="w-full h-4 rounded-md animate-shimmer" />
        <div className="w-2/3 h-4 rounded-md animate-shimmer" />
      </div>

      {/* Price & CTA Skeleton */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div className="w-16 h-5 rounded-md animate-shimmer" />
        <div className="w-8 h-8 rounded-full animate-shimmer" />
      </div>
    </div>
  );
};
