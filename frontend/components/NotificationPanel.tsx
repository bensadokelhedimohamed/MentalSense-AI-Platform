'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Bell, BookOpen, Heart, Smile, Moon, Clock } from 'lucide-react';
import { NotificationPreferences } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { user, updateUserPrefs } = useAuth();
  const { t } = useLanguage();
  const [content, setContent] = useState<any>(null);

  // Inline small daily content generator (replaces mockBackend call)
  useEffect(() => {
    const getDailyContent = async () => {
      const quotes = [
        "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
        "Croyez que vous pouvez et vous êtes à mi-chemin.",
        "Le bonheur vient de vos propres actions."
      ];
      const spirituals = [
        "« Et ton Seigneur ne t'a ni abandonné, ni détesté. »",
        "« N'est-ce pas par l'évocation d'Allah que se tranquillisent les cœurs ? »"
      ];
      const books = [
        "L'Intelligence Émotionnelle - Daniel Goleman",
        "Le pouvoir du moment présent - Eckhart Tolle"
      ];
      const jokes = [
        "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau !",
        "Que fait une fraise sur un cheval ? Tagada Tagada !"
      ];

      return {
        quote: quotes[Math.floor(Math.random() * quotes.length)],
        spiritual: spirituals[Math.floor(Math.random() * spirituals.length)],
        book: books[Math.floor(Math.random() * books.length)],
        joke: jokes[Math.floor(Math.random() * jokes.length)]
      };
    };

    if (isOpen) {
      getDailyContent().then(setContent);
    }
  }, [isOpen]);

  if (!user) return null;

  const lastVisitDate = user.lastVisit ? new Date(user.lastVisit).toLocaleDateString() : "Aujourd'hui";

  const togglePref = (key: keyof NotificationPreferences) => {
    const newPrefs = { ...user.notificationPrefs, [key]: !user.notificationPrefs[key] };
    updateUserPrefs({ notificationPrefs: newPrefs });
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 dark:text-white">
          <Bell size={20} className="text-primary" />
          {t('notifications')}
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-300">
          <Clock size={18} className="text-gray-500" />
          <span>Dernière visite : <strong>{lastVisitDate}</strong></span>
        </div>

        {user.notificationPrefs.spiritual && content && (
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-3 text-emerald-600 font-bold uppercase text-xs tracking-wider"><Moon size={16} /><span>{t('pref_spiritual')}</span></div>
            <p className="text-sm italic text-gray-700 dark:text-gray-200">"{content.spiritual}"</p>
          </div>
        )}

        {user.notificationPrefs.reminders && content && (
          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100">
             <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold uppercase text-xs tracking-wider"><Heart size={16} /><span>{t('daily_quote')}</span></div>
             <p className="text-sm text-gray-700 dark:text-gray-300">"{content.quote}"</p>
          </div>
        )}

        {user.notificationPrefs.books && content && (
          <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-2 mb-3 text-amber-600 font-bold uppercase text-xs tracking-wider"><BookOpen size={16} /><span>{t('book_suggestion')}</span></div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{content.book}</p>
          </div>
        )}

        {user.notificationPrefs.entertainment && content && (
          <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100">
            <div className="flex items-center gap-2 mb-3 text-purple-600 font-bold uppercase text-xs tracking-wider"><Smile size={16} /><span>{t('pref_entertainment')}</span></div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{content.joke}</p>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Personnaliser votre flux</h4>
          <div className="space-y-4">
            {[
              { key: 'reminders', icon: Heart, label: t('pref_reminders'), color: 'text-blue-500' },
              { key: 'spiritual', icon: Moon, label: t('pref_spiritual'), color: 'text-emerald-500' },
              { key: 'books', icon: BookOpen, label: t('pref_books'), color: 'text-amber-500' },
              { key: 'entertainment', icon: Smile, label: t('pref_entertainment'), color: 'text-purple-500' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between group cursor-pointer" onClick={() => togglePref(item.key as any)}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={item.color} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${user.notificationPrefs[item.key as keyof NotificationPreferences] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${user.notificationPrefs[item.key as keyof NotificationPreferences] ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;