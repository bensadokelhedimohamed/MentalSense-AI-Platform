/**
 * Fichier : components/BackgroundAnimation.tsx
 * But : Arrière-plan animé "Univers Psychologique".
 * Effet : Particules flottantes et connexions neuronales subtiles.
 */

import React from 'react';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-slate-50 dark:bg-gray-950">
      
      {/* 1. Deep Atmospheric Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20" />

      {/* 2. Floating "Thoughts" (Orbs) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float dark:bg-primary-900/10 dark:mix-blend-screen" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float dark:bg-secondary-900/10 dark:mix-blend-screen" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      
      {/* 3. Neural Network Lines (SVG Overlay) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-900 dark:text-white" />
          <path d="M2 2 Q 50 50 98 98" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gray-900 dark:text-white" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#neural-pattern)" />
      </svg>

      {/* 4. Soft Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-white/80 dark:to-gray-950/90" />
    </div>
  );
};

export default BackgroundAnimation;