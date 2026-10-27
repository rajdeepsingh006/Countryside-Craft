import React, { useEffect, useState } from 'react';

/**
 * Countryside Craft — Route Progress Loading Bar
 * 
 * A slim, luxury top progress indicator that triggers during route transitions
 * and smoothly completes when the new view is mounted.
 */
export const RouteProgressBar = ({ isNavigating }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      setVisible(true);
      setProgress(25);

      const t1 = setTimeout(() => {
        setProgress(65);
      }, 100);

      const t2 = setTimeout(() => {
        setProgress(90);
      }, 250);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isNavigating, visible]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading progress"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none bg-transparent overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-[#A9512D] via-[#C6A46A] to-[#163323] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(198,164,106,0.8)]"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
};
