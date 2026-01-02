'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Fingerprint } from 'lucide-react';
import Logo from '../../components/Logo';
import BackgroundAnimation from '../../components/BackgroundAnimation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.message === 'INVALID_CREDENTIALS') {
        setError(t('invalid_credentials'));
      } else {
        setError(err.message || t('generic_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <BackgroundAnimation />
      
      <div className="w-full max-w-[420px] glass p-8 md:p-10 rounded-3xl animate-slide-up relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-6">
            <Logo size={48} className="scale-110" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('login_title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Retrouvez votre espace de sérénité
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 dark:border-red-900/50 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" size={20} />
              <input
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                required
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connexion...</span>
              </div>
            ) : (
              <>
                <span>{t('login_btn')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('no_account')} 
          <Link href="/register" className="ml-1 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 hover:underline decoration-2 underline-offset-4 transition-colors">
            {t('register_btn')}
          </Link>
        </div>
      </div>
    </div>
  );
}