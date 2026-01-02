// --- Client Node.js pour appeler le service Python d'analyse de sentiment ---
// Permet de récupérer label et score pour un texte donné
// Intégration facile avec sendMessageToGemini

import { spawn } from 'child_process';

/**
 * Appelle le service Python pour analyser le sentiment
 * @param text Message en arabe/derja
 * @returns {Promise<{label: string, score: number}>} Label et score
 */
export const getSentiment = (text: string): Promise<{label: string, score: number}> => {
  return new Promise((resolve, reject) => {
    // --- Appel du script Python ---
    const pyProcess = spawn('python', ['./ml_service/sentiment_service.py', text]);

    let output = '';
    let errorOutput = '';

    pyProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0 || errorOutput) {
        console.error("Erreur sentiment Python:", errorOutput);
        return resolve({ label: 'Neutral', score: 0.0 });
      }
      try {
        // --- Python doit renvoyer JSON sur stdout ---
        const lastLine = output.trim().split('\n').pop();
        const sentiment = JSON.parse(lastLine!);
        resolve(sentiment);
      } catch (err) {
        console.error("Erreur parsing JSON:", err, "Output:", output);
        resolve({ label: 'Neutral', score: 0.0 });
      }
    });

    // --- Envoi du texte en argument ---
    pyProcess.stdin.end();
  });
};
