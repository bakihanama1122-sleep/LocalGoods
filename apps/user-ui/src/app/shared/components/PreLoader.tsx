"use client";

import React, { useEffect, useState } from 'react';

const PreLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDisplayTime = 1200; // Minimum 1.2 seconds for branding
    
    // Check if page is fully loaded
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = minDisplayTime - elapsed;
      
      // Wait for minimum display time if not reached
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }, remainingTime > 0 ? remainingTime : 0);
    };

    // Listen for page load
    if (document.readyState === 'complete') {
      setTimeout(handleLoad, 100);
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    // Fallback timeout (max 2.5 seconds)
    const maxTimeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 2500);

    return () => {
      clearTimeout(maxTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Title */}
        <h1 className="text-7xl md:text-8xl font-bold text-gray-900 mb-4 tracking-tight">
          Local<span className="text-amber-600">Goods</span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-gray-600 font-light mb-12">
          Because local feels <span className="text-amber-600">better</span>
        </p>

        {/* Loading Indicator */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
