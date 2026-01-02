'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../../components/Logo';
import BackgroundAnimation from '../../components/BackgroundAnimation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (passwordStrength < 3) {
      setError(t('weak_password'));
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err: any) {
      if (err.message === 'EMAIL_IN_USE') {
         setError(t('email_in_use'));
      } else if (err.message && (err.message.includes('Network') || err.message.includes('Failed to fetch') || err.message.includes('Connexion'))) {
        setError(err.message || t('network_error'));
      } else {
         setError(err.message || t('generic_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return 'bg-red-400';
    if (passwordStrength < 4) return 'bg-yellow-400';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <BackgroundAnimation />

      <div className="w-full max-w-[450px] glass p-8 md:p-10 rounded-3xl animate-slide-up relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-6">
             <Logo size={48} className="scale-110" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('register_title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Commencez votre voyage intérieur</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 dark:border-red-900/50 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Nom complet</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-secondary-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="group">
             <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
             <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-secondary-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          
          <div className="group">
             <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Mot de passe</label>
             <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-secondary-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all text-gray-900 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Animated Strength Meter */}
            {password && (
              <div className="mt-2 space-y-1 animate-fade-in">
                <div className="flex gap-1 h-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-500 ease-out ${i < passwordStrength ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Sécurité</span>
                  <span className={`font-medium ${passwordStrength < 3 ? 'text-red-500' : passwordStrength < 5 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                    {passwordStrength < 3 ? 'Faible' : passwordStrength < 5 ? 'Moyen' : 'Excellent'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-secondary-500/20 flex items-center justify-center space-x-2 disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Création...</span>
               </div>
            ) : (
              <>
                <span>{t('register_btn')}</span>
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('have_account')} <Link href="/login" className="ml-1 text-secondary-600 hover:text-secondary-700 font-semibold hover:underline decoration-2 underline-offset-4">{t('login_btn')}</Link>
        </div>
      </div>
    </div>
  );
}