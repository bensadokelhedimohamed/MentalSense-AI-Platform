'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationPanel from './NotificationPanel';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-500"></div>
           <p className="text-gray-500 font-medium animate-pulse">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden md:block fixed left-0 top-0 z-30 h-full">
        <Sidebar />
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-72 bg-white dark:bg-gray-900 shadow-2xl h-full relative z-50 animate-slide-in-right">
             <div className="h-full overflow-y-auto">
                {/* Mobile Sidebar (Not fixed, fills container) */}
                <Sidebar className="border-none" />
             </div>
          </div>
          <div 
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      <NotificationPanel isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
      {notificationOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setNotificationOpen(false)} />
      )}

      <div className="md:ml-72 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setMobileMenuOpen(true)} 
          onNotificationClick={() => setNotificationOpen(true)}
        />
        <main className="flex-1 mt-20 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}