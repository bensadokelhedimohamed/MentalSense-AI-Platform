'use client';

import React, { useEffect, useState } from 'react';
import { apiGetSessions, apiDeleteSession, apiToggleFavorite, apiAnalyzeFile, apiGetStats } from '../../services/api';
import { EmotionStats, UploadedFile, ChatSession } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { RefreshCw, Upload, MessageSquare, AlertTriangle, Smile, Activity, TrendingUp, Trash2, Star, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppShell from '../../components/AppShell';

export default function Dashboard() {
  const [data, setData] = useState<EmotionStats[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const loadData = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      // Fetch stats from backend endpoint
      const [chats] = await Promise.all([
        apiGetSessions()
      ]);
      setSessions(chats);

      try {
        const stats = await apiGetStats();
        setData(Array.isArray(stats) ? stats as any : []);
      } catch (err) {
        console.warn('Cannot fetch dashboard stats', err);
        setData([]);
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');

    loadData();
    const intervalId = setInterval(loadData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const file = e.target.files[0];
        const result = await apiAnalyzeFile(file);
        alert(`Analyse terminée: ${result}`);
        
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('video') ? 'video' : 'image',
          url: '',
          uploadDate: Date.now(),
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        };
        setFiles(prev => [newFile, ...prev]);
      } catch (err) {
        alert("Erreur lors de l'analyse du fichier.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const confirmDeleteSession = async () => {
    if (sessionToDelete) {
      await apiDeleteSession(sessionToDelete);
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete && s._id !== sessionToDelete));
      setSessionToDelete(null);
    }
  };

  const startNewChat = () => {
    router.push('/chat');
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="glass-card p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 ${color} group-hover:scale-110 transition-transform duration-500`} />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
      
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">{value}</div>
        {trend && (
            <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full mb-1 flex items-center">
              <ArrowUpRight size={12} className="mr-1" /> {trend}
            </span>
        )}
      </div>
    </div>
  );

  const handleToggleFav = async (id: string) => {
    await apiToggleFavorite(id);
    loadData();
  };

  return (
    <AppShell>
      <div className="space-y-8 pb-10 relative max-w-7xl mx-auto">
        
        {/* Delete Modal */}
        {sessionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700 animate-slide-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supprimer la conversation ?</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">Cette action est irréversible et supprimera l'historique de l'analyse.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setSessionToDelete(null)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium">Annuler</button>
                <button onClick={confirmDeleteSession} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all transform hover:scale-105"><Trash2 size={18} />Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
              {greeting}, <span className="text-primary-600 dark:text-primary-400">{user?.name.split(' ')[0]}</span>.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Voici un aperçu de votre bien-être mental aujourd'hui.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={startNewChat}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <MessageSquare size={20} />
              {t('start_chat')}
            </button>
            <button onClick={() => loadData()} className="p-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors">
              <RefreshCw size={20} className={isRefreshing ? "animate-spin text-primary-600" : ""} />
            </button>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="État Général" value="Positif" icon={Smile} color="bg-emerald-500" trend="+5%" />
          <StatCard title="Niveau de Stress" value="Faible" icon={Activity} color="bg-blue-500" />
          <StatCard title="Anxiété (Hebdo)" value="-12%" icon={TrendingUp} color="bg-purple-500" />
          <StatCard title="Conversations" value={sessions.length} icon={MessageSquare} color="bg-indigo-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* File Upload Section */}
          <div className="lg:col-span-2 glass-card p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Upload size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Analyse de Documents</h3>
                <p className="text-sm text-gray-500">Analysez journaux, dessins ou vidéos pour des insights profonds.</p>
              </div>
            </div>
            
            <div className="border-2 border-dashed rounded-2xl p-10 text-center border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-300 relative group cursor-pointer flex-1 flex flex-col justify-center items-center">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
              
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {isUploading ? <RefreshCw className="animate-spin text-primary-600" size={32} /> : <Upload className="text-blue-500" size={32} />}
              </div>
              <p className="text-gray-900 dark:text-white font-medium text-lg">Glissez un fichier ou cliquez ici</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Supporte PDF, JPG, PNG, MP4 (Max 10MB)</p>
            </div>

            {files.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map(file => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <FileText size={18} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">Analysé</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="glass-card p-6 flex flex-col h-[500px]">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-500" />
                  Récent
                </h3>
                <button onClick={() => router.push('/history')} className="text-xs text-primary-600 hover:underline">Voir tout</button>
             </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
               {sessions.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                   <MessageSquare size={32} className="mb-2 opacity-20" />
                   <p>Aucune conversation.</p>
                 </div>
               )}
               {sessions.map(s => (
                 <div key={s.id} onClick={() => router.push('/chat')} className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate max-w-[140px] group-hover:text-primary-600 transition-colors">{s.title}</h4>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleToggleFav(s.id)} className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${s.favorite ? 'text-amber-500' : 'text-gray-400'}`}>
                          <Star size={14} className={s.favorite ? "fill-amber-500" : ""} />
                        </button>
                        <button onClick={() => setSessionToDelete(s.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{s.lastMessage}</p>
                    <div className="mt-2 text-[10px] text-gray-400 text-right">
                      {new Date(s.date).toLocaleDateString()}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}