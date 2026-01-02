/*'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  MessageCircleHeart, 
  Camera, 
  LogOut, 
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={22} />, label: t('dashboard') },
    { to: '/chat', icon: <MessageCircleHeart size={22} />, label: t('chat') },
    { to: '/camera', icon: <Camera size={22} />, label: t('camera') },
  ];

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path === '/dashboard' && pathname === '/');
    return `flex items-center space-x-3.5 px-6 py-4 rounded-2xl transition-all duration-300 font-medium group ${
      isActive 
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 shadow-sm' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`;
  };

  return (
    <aside className={`w-72 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-colors ${className}`}>
      <div className="p-8 pb-4">
        <Logo size={36} />
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        <p className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Principal</p>
        {navItems.map((item) => (
          <Link 
            key={item.to} 
            href={item.to}
            className={getLinkClass(item.to)}
          >
            <span className={`transition-transform duration-300 group-hover:scale-110 ${pathname === item.to ? 'text-primary-500' : ''}`}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-6 py-4 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all group font-medium"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
*/

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Camera, 
  LogOut, 
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={22} />, label: t('dashboard') },
    { to: '/chat', icon: <MessageCircle size={22} />, label: t('chat') },
    { to: '/camera', icon: <Camera size={22} />, label: t('camera') },
  ];

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path === '/dashboard' && pathname === '/');
    return `flex items-center space-x-3.5 px-6 py-4 rounded-2xl transition-all duration-300 font-medium group ${
      isActive 
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 shadow-sm' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`;
  };

  return (
    <aside className={`w-72 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-colors ${className}`}>
      <div className="p-8 pb-4">
        <Logo size={36} />
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        <p className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Principal</p>
        {navItems.map((item) => (
          <Link 
            key={item.to} 
            href={item.to}
            className={getLinkClass(item.to)}
          >
            <span className={`transition-transform duration-300 group-hover:scale-110 ${pathname === item.to ? 'text-primary-500' : ''}`}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-6 py-4 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all group font-medium"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;