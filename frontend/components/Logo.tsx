import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md group-hover:bg-primary-500/30 transition-all duration-500"></div>
        <BrainCircuit 
          size={size} 
          className="text-primary-600 dark:text-primary-400 relative z-10 transition-transform duration-700 ease-out group-hover:rotate-12 group-hover:scale-105" 
          strokeWidth={1.5}
        />
      </div>
      <span className="font-bold text-xl tracking-tight text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        MentalSense
      </span>
    </div>
  );
};

export default Logo;