'use client';

import React from 'react';

export default function Logo({ size = 40, className = "" }: { size?: number, className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        {/* The 'A' shape */}
        <path 
          d="M20 85L50 15L80 85" 
          stroke="url(#logo-gradient)" 
          strokeWidth="16" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* The Checkmark */}
        <path 
          d="M40 55L50 65L85 30" 
          stroke="#10B981" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
}
