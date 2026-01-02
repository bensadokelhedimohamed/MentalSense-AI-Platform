/**
 * Fichier : services/mlService.ts
 * But : Interface d'abstraction pour les services de Machine Learning externes.
 * 
 * Architecture cible :
 * Frontend (React) -> mlService.ts -> API Backend (Next.js) -> ML Server (Python/FastAPI)
 * 
 * Actuellement : Simule les réponses ou appelle Gemini pour certaines tâches.
 */

// Placeholder pour l'analyse de texte avancée (Emotion, Sentiment, Urgence)
export const mlAnalyzeText = async (text: string): Promise<{ sentiment: string, suggestions: string[] }> => {
  console.log("ML Analysis (Text):", text);
  // Simulation d'un appel API POST /api/ml/analyze-text
  await new Promise(r => setTimeout(r, 1000));
  return {
    sentiment: "Anxieux mais plein d'espoir",
    suggestions: ["Exercice de respiration", "Journaling", "Méditation guidée"]
  };
};

// Placeholder pour l'analyse audio (Tonalité, débit, pauses)
export const mlAnalyzeAudio = async (audioBlob: Blob): Promise<{ text: string, emotion: string }> => {
  console.log("ML Analysis (Audio):", audioBlob.size);
  // Simulation d'un appel API POST /api/ml/analyze-audio
  // Utiliserait Whisper pour STT et un modèle de classification audio pour l'émotion
  await new Promise(r => setTimeout(r, 2000));
  return {
    text: "Je me sens un peu dépassé ces derniers temps par le travail.",
    emotion: "Stress élevé détecté dans la voix"
  };
};

// Placeholder pour l'analyse faciale (Micro-expressions) via Webcam
export const mlAnalyzeFace = async (imageBase64: string): Promise<string> => {
  // Déjà géré partiellement par geminiService via Vision API
  console.log("ML Analysis (Face)");
  await new Promise(r => setTimeout(r, 1500));
  return "Expression détectée : Fatigue légère avec signes de préoccupation.";
};

// Placeholder pour l'analyse de documents (Extraction et synthèse)
export const mlAnalyzeFile = async (file: File): Promise<string> => {
  console.log("ML Analysis (File):", file.name);
  await new Promise(r => setTimeout(r, 2000));
  return `Analyse du document ${file.name} terminée. Contenu principal identifié : Journal personnel.`;
}