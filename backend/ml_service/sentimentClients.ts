// sentimentClient.ts
import { pipeline } from "transformers";

// --- Crée le pipeline pour l'analyse de sentiment ---
// Français: Utiliser le modèle CAMeL-Lab pour l'arabe
const sentimentAnalyzer = pipeline("sentiment-analysis", "CAMeL-Lab/bert-base-arabic-camelbert-da-sentiment");

export const getSentiment = async (text: string) => {
  try {
    const result = await sentimentAnalyzer(text);
    // Le modèle retourne typiquement [{label: "Positive", score: 0.95}]
    return result[0];
  } catch (error) {
    console.error("Erreur analyse sentiment:", error);
    return { label: "Neutral", score: 0 };
  }
};
