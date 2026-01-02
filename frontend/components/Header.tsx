'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { checkBackendHealth } from '../services/api';
import { Sun, Moon, Globe, Menu, Bell, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onNotificationClick }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false); // État pour le menu langue

  useEffect(() => {
    // Vérifier le statut du backend au chargement
    const checkStatus = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy);
    };
    checkStatus();
    // Vérifier périodiquement toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLangSelect = (selectedLang: 'fr' | 'en' | 'ar') => {
    setLang(selectedLang);
    setIsLangMenuOpen(false); // Fermer le menu après sélection
  };

  return (
    <header className="h-20 flex items-center justify-between px-6 md:px-8 fixed top-0 right-0 left-0 md:left-72 z-20 transition-all bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mr-4"
        >
          <Menu size={24} />
        </button>

        {/* Indicateur Statut Backend (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs font-medium">
          {backendStatus === true ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-600 dark:text-emerald-400">Serveur connecté</span>
            </>
          ) : backendStatus === false ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-red-500">Serveur déconnecté</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span className="text-gray-400">Connexion...</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Language Selector (Click-based) */}
        <div className="relative">
          <button 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className={`p-2.5 rounded-xl transition-colors ${isLangMenuOpen ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
          >
            <Globe size={20} />
          </button>
          
          {/* Backdrop invisible pour fermer le menu si on clique ailleurs */}
          {isLangMenuOpen && (
            <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)}></div>
          )}

          {/* Menu Dropdown */}
          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1.5 animate-slide-up origin-top-right z-20">
              <button onClick={() => handleLangSelect('fr')} className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${lang === 'fr' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Français</button>
              <button onClick={() => handleLangSelect('en')} className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${lang === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>English</button>
              <button onClick={() => handleLangSelect('ar')} className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${lang === 'ar' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>العربية</button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button 
          onClick={onNotificationClick}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>

        {/* Avatar */}
        {user && (
          <div className="flex items-center gap-3 pl-2">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 ring-2 ring-white dark:ring-gray-800 cursor-pointer hover:scale-105 transition-transform">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;