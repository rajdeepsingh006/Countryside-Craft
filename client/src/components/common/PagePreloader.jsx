import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

/**
 * Countryside Craft — Editorial Brand Splash Preloader
 * 
 * Displays on initial website load to create an elevated luxury boutique impression.
 * Features the authentic brand seal, rotating golden botanical orbit, and smooth reveal.
 */
export const PagePreloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);
  const [fadingOut, setFadingOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    // Step progress up with an editorial, calm luxury rhythm
    const t1 = setTimeout(() => setProgress(35), 180);
    const t2 = setTimeout(() => setProgress(72), 520);
    const t3 = setTimeout(() => setProgress(100), 920);

    const t4 = setTimeout(() => {
      setFadingOut(true);
    }, 1150);

    const t5 = setTimeout(() => {
      setUnmounted(true);
      if (onFinish) onFinish();
    }, 1550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish]);

  if (unmounted) return null;

  return (
    <div
      aria-label="Loading Countryside Craft Storefront"
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#FAF8F5] texture-canvas select-none transition-opacity duration-500 ease-in-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Brand Medallion with Botanical Rotating Halo */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer Rotating Golden Ring */}
        <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-[#C6A46A]/40 animate-spin-slow pointer-events-none" />

        {/* Ambient Warm Golden Glow */}
        <div className="absolute inset-0 rounded-full bg-[#EAD8B5]/50 blur-xl scale-125" />

        {/* Brand Circular Logo Seal */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 bg-white border border-[#DDD7CC] shadow-md animate-pulse-subtle">
          <img
            src={getAssetUrl('/images/logo.jpg')}
            alt="Countryside Craft Brand Seal"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>

      {/* Brand Title & Tagline */}
      <div className="text-center px-4 space-y-1.5 max-w-sm">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#DDD7CC] shadow-2xs mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A46A]" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#163323]">
            Slow Craft Artisan
          </span>
        </div>

        <h1 className="font-serif-display font-bold text-2xl sm:text-3xl text-[#163323] tracking-wide">
          Countryside Craft
        </h1>

        <p className="font-sans text-xs text-[#6A5E54] tracking-wider uppercase font-medium">
          Handcrafted Botanical Goods &amp; Jute Living
        </p>
      </div>

      {/* Slender Loading Progress Indicator */}
      <div className="mt-8 w-44 sm:w-52 flex flex-col items-center gap-2">
        <div className="w-full h-1 bg-[#E7DFD2] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#A9512D] via-[#C6A46A] to-[#163323] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono font-medium text-[#7A6E63] tracking-wider">
          {progress}%
        </span>
      </div>

      {/* Accessible Quick Skip */}
      <button
        onClick={() => {
          setFadingOut(true);
          setTimeout(() => {
            setUnmounted(true);
            sessionStorage.setItem('cc_preloader_seen', 'true');
            if (onFinish) onFinish();
          }, 300);
        }}
        className="mt-6 text-[11px] font-bold text-[#7A6E63] hover:text-[#163323] uppercase tracking-wider transition-colors cursor-pointer underline underline-offset-4 opacity-70 hover:opacity-100"
      >
        Skip Loading
      </button>
    </div>
  );
};
