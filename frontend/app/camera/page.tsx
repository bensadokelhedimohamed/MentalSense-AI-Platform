'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, RefreshCw, AlertTriangle, ScanFace, ChevronRight } from 'lucide-react';
import { analyzeEmotionFromImage } from '../../services/geminiService';
import { useLanguage } from '../../contexts/LanguageContext';
import AppShell from '../../components/AppShell';

const CameraPage: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const handleAnalyze = async () => {
    if (!imgSrc) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const base64Data = imgSrc.split(',')[1];
      const result = await analyzeEmotionFromImage(base64Data);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Erreur lors de l'analyse. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImgSrc(null);
    setAnalysis(null);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col justify-center">
        
        <div className="text-center space-y-2 mb-4 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <ScanFace className="text-primary-500" size={32} />
            {t('camera')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Notre IA analyse vos micro-expressions pour vous aider à comprendre votre état émotionnel actuel avec précision et bienveillance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Camera Viewport */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-800 group">
              
              {!imgSrc ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                    videoConstraints={{ facingMode: "user" }}
                  />
                  {/* Face Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                     <div className="w-48 h-64 border-2 border-white/50 rounded-[50%] border-dashed"></div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm bg-black/40 py-2 backdrop-blur-sm">
                    Placez votre visage dans le cadre
                  </div>
                </>
              ) : (
                <img src={imgSrc} alt="Capture" className="w-full h-full object-cover transform scale-x-[-1]" />
              )}
              
              {/* Scan Effect Overlay when loading */}
              {loading && (
                 <div className="absolute inset-0 bg-primary-500/10 z-10">
                   <div className="w-full h-1 bg-primary-400/80 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[slideUp_2s_infinite_alternate]"></div>
                 </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex space-x-4 mt-8">
              {!imgSrc ? (
                <button
                  onClick={capture}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl flex items-center space-x-3 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CameraIcon size={24} />
                  <span>Capturer l'instant</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl flex items-center space-x-2 transition-colors border border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw size={20} />
                    <span>Réessayer</span>
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold rounded-xl flex items-center space-x-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <ScanFace size={20} />
                    )}
                    <span>{loading ? "Analyse en cours..." : "Lancer l'analyse"}</span>
                    {!loading && <ChevronRight size={18} />}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
             {analysis ? (
               <div className="glass-card p-6 h-full border-t-4 border-t-secondary-500 animate-slide-in-right">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 rounded-lg">
                     <AlertTriangle size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('emotional_summary')}</h3>
                 </div>
                 
                 <div className="prose dark:prose-invert">
                   <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                     {analysis}
                   </p>
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-400 italic">
                      L'IA détecte des nuances subtiles. Prenez un moment pour respirer si vous en ressentez le besoin.
                    </p>
                 </div>
               </div>
             ) : (
               <div className="h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-400">
                 <ScanFace size={48} className="mb-4 opacity-20" />
                 <p className="font-medium">Les résultats de l'analyse apparaîtront ici.</p>
                 <p className="text-sm mt-2">Assurez-vous d'avoir un bon éclairage.</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </AppShell>
  );
};

export default CameraPage;