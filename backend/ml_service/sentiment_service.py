import * as tf from "@tensorflow/tfjs-node";
import { pipeline } from "transformers";

// --- Pipeline CAMeL-BERT pour l'analyse de sentiment ---
let sentimentPipeline: any = null;

export const initSentiment = async () => {
  if (!sentimentPipeline) {
    sentimentPipeline = await pipeline("text-classification", "CAMeL-Lab/bert-base-arabic-camelbert-da-sentiment");
    console.log("✅ Sentiment pipeline prêt");
  }
};

// --- Fonction pour analyser le sentiment d'un texte ---
export const getSentiment = async (text: string) => {
  if (!sentimentPipeline) await initSentiment();
  
  try {
    const results = await sentimentPipeline(text);
    // --- On prend le premier résultat, CAMeL-BERT retourne 'Positive' ou 'Negative' ---
    return results[0];
  } catch (error) {
    console.error("❌ Erreur sentiment_service:", error);
    return { label: "Neutral", score: 0 };
  }
};
