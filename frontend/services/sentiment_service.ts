// services/sentiment_service.ts
// Service simple pour analyser les émotions (Frontend mock ou appel API réel)
export const getSentiment = async (text: string): Promise<{ label: string; score: number }> => {
    // Exemple mock pour Frontend
    if (!text) return { label: "Neutral", score: 0 };
  
    if (text.includes("triste") || text.includes("mal")) return { label: "Negative", score: -1 };
    if (text.includes("bien") || text.includes("heureux")) return { label: "Positive", score: 1 };
    return { label: "Neutral", score: 0 };
  };
  