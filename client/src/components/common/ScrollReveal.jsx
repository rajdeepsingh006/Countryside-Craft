import React, { useEffect, useRef, useState } from 'react';

/**
 * Countryside Craft — ScrollReveal Component
 * 
 * Smoothly lifts and fades in sections and elements as they enter the viewport
 */
export const ScrollReveal = ({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        {
          threshold,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      observer.observe(element);
      return () => {
        if (element) observer.unobserve(element);
      };
    } else {
      // Fallback if IntersectionObserver not available
      setIsVisible(true);
    }
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
      className={`reveal-init ${isVisible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
