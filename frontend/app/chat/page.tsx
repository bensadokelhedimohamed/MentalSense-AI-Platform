
'use client';

/**
 * MentalSense Chat Component
 * Interface de chat premium avec support vocal et animations fluides.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, VoiceSettings, ChatSession } from '../../types';
import { sendMessageToGemini } from '../../services/geminiService';
import { apiSaveSession } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Send, Mic, Settings, Volume2, StopCircle, 
  Loader2, X, CheckCircle2, Sparkles, Cpu, Cloud 
} from 'lucide-react';
import AppShell from '../../components/AppShell';

// Types pour l'API Web Speech
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export default function Chat() {
  const { user, updateUserPrefs } = useAuth();
  const [sessionId] = useState(() => Date.now().toString());
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Bonjour. Je suis MentalSense, votre sanctuaire numérique. Inspirez profondément... comment vous sentez-vous aujourd\'hui ?',
      timestamp: Date.now(),
      type: 'text'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [useLocal, setUseLocal] = useState(false); 
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Configuration vocale initiale
  const defaultVoiceSettings = { gender: 'female', dialect: 'fr-FR', autoRead: true };
  const [voiceConfig, setVoiceConfig] = useState<any>(user?.voiceSettings || defaultVoiceSettings);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  /**
   * Auto-scroll management
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  /**
   * Load system voices
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadVoices = () => {
        const availVoices = window.speechSynthesis.getVoices();
        setVoices(availVoices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  /**
   * Smart voice selection based on dialect and gender
   */
  const getBestVoice = useCallback((dialect: string, gender: string) => {
    const langCode = dialect.split('-')[0].toLowerCase();
    const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langCode));

    if (langVoices.length === 0) return null;

    const genderKeywords = gender === 'male' ? ['male', 'homme', 'maged', 'david'] : ['female', 'femme', 'laila', 'google'];
    const voiceByGender = langVoices.find(v => 
      genderKeywords.some(k => v.name.toLowerCase().includes(k))
    );

    return voiceByGender || langVoices[0];
  }, [voices]);

  /**
   * Text-To-Speech (TTS)
   */
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
    
    // Support for Arabic dialects
    let ttsLang = voiceConfig.dialect;
    if (['ar-TN', 'ar-MA', 'ar-EG'].includes(ttsLang)) ttsLang = 'ar-SA';
    
    utterance.lang = ttsLang;
    utterance.rate = 1.0;

    const selectedVoice = getBestVoice(voiceConfig.dialect, voiceConfig.gender);
    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Speech-To-Text (STT) - Fixed duplication issues
   */
  const toggleRecording = () => {
    if (typeof window === 'undefined') return;
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) return alert("Votre navigateur ne supporte pas la reconnaissance vocale.");

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognitionRef.current = recognition;
    recognition.lang = voiceConfig.dialect;
    recognition.continuous = false; // Prevents auto-duplication
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) setInput(prev => (prev.trim() + ' ' + transcript).trim());
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      setIsRecording(false);
    };
    recognition.start();
  };

  /**
   * Update settings and save to profile
   */
  const updateVoiceSettings = async (newSettings: any) => {
    const updated = { ...voiceConfig, ...newSettings };
    setVoiceConfig(updated);
    if (user) await updateUserPrefs({ voiceSettings: updated });
  };

  /**
   * Handle message sending
   */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now(), type: 'text' };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendMessageToGemini(newMessages, input, voiceConfig);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: Date.now(), type: 'text' };
      
      const finalHistory = [...newMessages, aiMsg];
      setMessages(finalHistory);
      
      if (voiceConfig.autoRead) speak(responseText);

      // Save Session
      setSaveStatus('saving');
      await apiSaveSession({
        id: sessionId,
        title: input.substring(0, 30),
        messages: finalHistory,
        lastMessage: responseText,
        date: new Date().toISOString(),
        favorite: false,
        voiceSettings: voiceConfig
      } as any);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);

    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-50/50 dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden relative transition-all duration-500">
        
        {/* Header Section */}
        <header className="px-8 py-4 bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">MentalSense</h1>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                  {loading ? 'Analyse en cours...' : 'À votre écoute'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {saveStatus === 'saved' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <CheckCircle2 size={14} /> Sauvegardé
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-xl transition-all ${showSettings ? 'bg-primary-50 text-primary-600 shadow-inner' : 'hover:bg-gray-100 text-gray-400'}`}
            >
              <Settings size={22} />
            </button>
          </div>
        </header>

        {/* Message List Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] md:max-w-[65%] p-5 rounded-[2rem] shadow-sm relative group ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-tr-sm shadow-xl shadow-primary-500/10' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-white dark:border-gray-700 shadow-md shadow-gray-200/50'
                }`}>
                  <p className="text-[15px] leading-relaxed font-medium">{msg.content}</p>
                  <div className={`text-[10px] mt-3 opacity-60 flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.role === 'model' && <Volume2 size={12} className="cursor-pointer hover:text-primary-500" onClick={() => speak(msg.content)}/>}
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </main>

        {/* Floating Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-8 bottom-28 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl rounded-[2rem] z-50 p-6 border border-white/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">Préférences</h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <section className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Moteur d'IA</label>
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl relative h-10">
                    <motion.div layoutId="engine-toggle" className="absolute bg-white dark:bg-gray-700 rounded-xl shadow-sm h-8 w-[calc(50%-4px)]" animate={{ x: useLocal ? 0 : '100%' }} />
                    <button onClick={() => setUseLocal(true)} className={`flex-1 text-xs font-bold relative z-10 flex items-center justify-center gap-2 ${useLocal ? 'text-primary-600' : 'text-gray-400'}`}><Cpu size={14}/> Local</button>
                    <button onClick={() => setUseLocal(false)} className={`flex-1 text-xs font-bold relative z-10 flex items-center justify-center gap-2 ${!useLocal ? 'text-primary-600' : 'text-gray-400'}`}><Cloud size={14}/> Cloud</button>
                  </div>
                </section>

                <section className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Dialecte & Voix</label>
                  <select 
                    value={voiceConfig.dialect} 
                    onChange={(e) => updateVoiceSettings({ dialect: e.target.value })} 
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="fr-FR">Français (Standard)</option>
                    <option value="ar-TN">Tunisien (Derja)</option>
                    <option value="ar-SA">Arabe (Standard)</option>
                    <option value="en-US">English (US)</option>
                  </select>
                </section>

                <div className="flex items-center justify-between p-4 bg-primary-50/50 dark:bg-primary-900/20 rounded-2xl border border-primary-100">
                  <span className="text-sm font-semibold text-primary-900 dark:text-primary-200">Lecture auto</span>
                  <button onClick={() => updateVoiceSettings({ autoRead: !voiceConfig.autoRead })} className={`w-11 h-6 rounded-full relative transition-colors ${voiceConfig.autoRead ? 'bg-primary-500' : 'bg-gray-300'}`}>
                    <motion.div animate={{ x: voiceConfig.autoRead ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Footer */}
        <footer className="p-6 md:p-10 pt-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-white/70 dark:bg-gray-800/80 backdrop-blur-2xl p-3 rounded-[2.5rem] shadow-2xl border border-white/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={toggleRecording}
                className={`p-4 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}
              >
                {isRecording ? <StopCircle size={24}/> : <Mic size={24}/>}
              </motion.button>

              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                placeholder={isRecording ? "Je vous écoute..." : "Comment vous sentez-vous vraiment ?"}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-40 min-h-[56px] py-4 px-2 text-gray-700 dark:text-gray-100 placeholder-gray-400 font-medium"
                rows={1}
              />

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!input.trim() || loading}
                onClick={handleSend}
                className="p-4 rounded-full bg-primary-600 text-white shadow-xl shadow-primary-500/20 hover:bg-primary-700 disabled:bg-gray-200 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={24}/> : <Send size={24}/>}
              </motion.button>
            </div>
          </div>
        </footer>
      </div>
    </AppShell>
  );
}
