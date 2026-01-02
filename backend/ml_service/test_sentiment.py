
// But : Fournir un service d'analyse de sentiment simple

export type Sentiment = {
  label: "Positive" | "Negative" | "Neutral";
  score: number;
};

/**
 * Analyse simple du sentiment basé sur des mots-clés.
 * @param text - Texte à analyser
 * @returns Sentiment avec label et score
 */
export const getSentiment = (text: string): Sentiment => {
  const positiveKeywords = ["سعيد", "فرح", "ممتاز", "جيد"];
  const negativeKeywords = ["حزن", "حزين", "وحدة", "سيء"];

  let score = 0;

  positiveKeywords.forEach((mot) => {
    if (text.includes(mot)) score += 1;
  });

  negativeKeywords.forEach((mot) => {
    if (text.includes(mot)) score -= 1;
  });

  if (score > 0) return { label: "Positive", score: parseFloat((score / positiveKeywords.length).toFixed(2)) };
  if (score < 0) return { label: "Negative", score: parseFloat((-score / negativeKeywords.length).toFixed(2)) };
  return { label: "Neutral", score: 0 };
};