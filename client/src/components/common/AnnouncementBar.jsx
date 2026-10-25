import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, Sparkles } from 'lucide-react';
import { DEFAULT_ANNOUNCEMENTS, getActiveAnnouncements } from '../../data/announcements';

/**
 * AnnouncementBar Component
 *
 * A refined, editorial announcement bar sitting at the top of the storefront.
 * Features:
 * - Deep forest green background (#193428), warm ivory text (#F8F5EF), muted gold accents (#C6A46A)
 * - Restrained vertical slide-and-fade animation with motion-preference detection
 * - Accessible controls (prev, next, pause/play) with WCAG 2.2.2 compliance
 * - Auto-rotation with pause on hover, keyboard focus, and hidden tab
 * - Zero layout shift and full mobile responsiveness
 */
export const AnnouncementBar = ({
  announcements = DEFAULT_ANNOUNCEMENTS,
  interval = 5000,
  onNavigate,
}) => {
  const activeAnnouncements = getActiveAnnouncements(announcements);
  const count = activeAnnouncements.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Detect user's reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Safe navigation to next announcement
  const handleNext = useCallback(() => {
    if (count <= 1) return;
    setDirection('next');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  // Safe navigation to previous announcement
  const handlePrev = useCallback(() => {
    if (count <= 1) return;
    setDirection('prev');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Handle CTA or announcement click
  const handleCtaClick = (item, e) => {
    if (item.view && typeof onNavigate === 'function') {
      e.preventDefault();
      onNavigate(item.view);
    } else if (item.href && item.href.startsWith('/')) {
      if (typeof onNavigate === 'function') {
        e.preventDefault();
        const view = item.href.replace(/^\//, '');
        onNavigate(view || 'home');
      }
    }
  };

  // Reset animation flag after transition completes (300ms)
  useEffect(() => {
    if (!isAnimating) return;
    const animTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 320);
    return () => clearTimeout(animTimer);
  }, [currentIndex, isAnimating]);

  // Document visibility state handling (pause when tab is hidden)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Auto-rotation timer setup with proper resets and cleanup
  useEffect(() => {
    if (count <= 1 || isPaused || isHovered || isFocused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (!document.hidden) {
        handleNext();
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, interval, isPaused, isHovered, isFocused, handleNext]);

  // Ensure index stays in bounds if list changes dynamically
  useEffect(() => {
    if (currentIndex >= count && count > 0) {
      setCurrentIndex(0);
    }
  }, [count, currentIndex]);

  // Empty state: render nothing if no eligible announcements
  if (count === 0) {
    return null;
  }

  const currentItem = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  return (
    <aside
      ref={containerRef}
      role="region"
      aria-label="Store Announcement"
      className="w-full bg-[#193428] text-[#F8F5EF] border-b border-[#244537] relative z-30 select-none transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 py-1.5 min-h-[32px] sm:min-h-[34px] flex items-center justify-between gap-1 sm:gap-3">
        {/* Left Side: Previous Control (only shown when >= 2 messages) */}
        <div className="flex items-center shrink-0">
          {count > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-md text-[#F8F5EF]/70 hover:text-[#C6A46A] hover:bg-[#244537]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A46A] transition-all cursor-pointer"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ) : (
            <div className="w-6 hidden sm:block" />
          )}
        </div>

        {/* Center: Message Area with Vertical Slide-and-Fade Transition */}
        <div
          className="flex-1 flex items-center justify-center text-center min-w-0 px-1 overflow-hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            key={currentItem.id}
            className={`flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap text-center py-0.5 leading-snug ${
              reducedMotion
                ? 'transition-opacity duration-200 ease-out opacity-100'
                : 'animate-announcement-in'
            }`}
          >
            {/* Delicate Gold Motif */}
            <span
              className="text-[#C6A46A] text-[10px] sm:text-xs shrink-0 select-none opacity-90"
              aria-hidden="true"
            >
              ✦
            </span>

            {/* Announcement Text */}
            <span className="font-sans text-[11px] sm:text-[12.5px] font-medium tracking-wide text-[#F8F5EF] text-center">
              <span className="sm:hidden">{currentItem.mobileText || currentItem.text}</span>
              <span className="hidden sm:inline">{currentItem.text}</span>
            </span>

            {/* Optional CTA Link */}
            {currentItem.ctaLabel && (
              <button
                type="button"
                onClick={(e) => handleCtaClick(currentItem, e)}
                className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11.5px] font-bold text-[#C6A46A] hover:text-[#F8F5EF] underline decoration-[#C6A46A]/60 underline-offset-2 hover:decoration-[#F8F5EF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A46A] rounded px-1 transition-all cursor-pointer ml-0.5 shrink-0"
              >
                <span>{currentItem.ctaLabel}</span>
                <ArrowRight className="w-2.5 h-2.5" aria-hidden="true" />
              </button>
            )}

            {/* Trailing Gold Motif on Larger Screens */}
            <span
              className="hidden md:inline text-[#C6A46A] text-[10px] sm:text-xs shrink-0 select-none opacity-90"
              aria-hidden="true"
            >
              ✦
            </span>
          </div>
        </div>

        {/* Right Side: Pause/Play and Next Controls */}
        <div className="flex items-center gap-0.5 shrink-0">
          {count > 1 && (
            <>
              {/* Accessible Pause / Resume Toggle */}
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="hidden sm:flex p-1 rounded-md text-[#F8F5EF]/60 hover:text-[#C6A46A] hover:bg-[#244537]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A46A] transition-all cursor-pointer"
                aria-label={isPaused ? 'Resume announcement rotation' : 'Pause announcement rotation'}
                title={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
              >
                {isPaused ? (
                  <Play className="w-3 h-3 text-[#C6A46A]" aria-hidden="true" />
                ) : (
                  <Pause className="w-3 h-3" aria-hidden="true" />
                )}
              </button>

              {/* Next Control */}
              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded-md text-[#F8F5EF]/70 hover:text-[#C6A46A] hover:bg-[#244537]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A46A] transition-all cursor-pointer"
                aria-label="Next announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
