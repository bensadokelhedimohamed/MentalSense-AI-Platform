import { GoogleGenAI } from "@google/genai";
import { Message, VoiceSettings } from "../types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const BASE_SYSTEM_INSTRUCTION = `
Tu es MentalSense, un assistant psychologique empathique et professionnel.
Ton ton doit être bienveillant, calme, sans jugement et soutenant.
Si l'utilisateur semble en danger immédiat (suicide, auto-mutilation), tu DOIS suggérer de contacter les urgences.
`;

const getSystemInstruction = (dialect: string) => {
  let langInstruction = "Tu peux parler en Français, Anglais ou Arabe standard.";

  switch (dialect) {
    case "ar-TN":
      langInstruction = "Tu DOIS répondre en Arabe Tunisien (Derja).";
      break;
    case "ar-MA":
      langInstruction = "Tu DOIS répondre en Arabe Marocain (Darija).";
      break;
    case "ar-EG":
      langInstruction = "Tu DOIS répondre en Arabe Égyptien.";
      break;
    case "en-US":
      langInstruction = "Please respond in English.";
      break;
    default:
      langInstruction = "Réponds dans la langue utilisée par l'utilisateur.";
  }

  return `${BASE_SYSTEM_INSTRUCTION}\n${langInstruction}`;
};

const getApiKey = (): string | undefined => {
  let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return undefined;

  if (apiKey.includes("GEMINI_API_KEY=")) {
    apiKey = apiKey.split("GEMINI_API_KEY=")[1];
  } else if (apiKey.includes("=")) {
    const parts = apiKey.split("=");
    apiKey = parts[parts.length - 1];
  }

  return apiKey.trim();
};

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  voiceSettings: VoiceSettings,
  imageParts: any[] = []
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API manquante dans .env.local");

  const isGoogleKey = apiKey.startsWith("AIza");
  const systemInstruction = getSystemInstruction(voiceSettings.dialect);

  if (isGoogleKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const googleHistory = history.slice(-10).map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
        history: googleHistory,
      });

      const messageContent: any[] = [{ text: newMessage }];

      imageParts.forEach((img) => {
        messageContent.push({
          inlineData: {
            mimeType: img.mimeType,
            data: img.data,
          },
        });
      });

      const response = await chat.sendMessage({ message: messageContent });
      return response.text || "";
    } catch (error: any) {
      console.error("❌ Erreur Google SDK:", error);
      throw error;
    }
  } else {
    try {
      const apiMessages: any[] = [
        { role: "system", content: systemInstruction },
      ];

      history.slice(-10).forEach((msg) => {
        apiMessages.push({
          role: msg.role === "model" ? "assistant" : "user",
          content: msg.content,
        });
      });

      apiMessages.push({ role: "user", content: newMessage });

      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: apiMessages,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (error: any) {
      console.error("❌ Erreur OpenRouter:", error);
      throw error;
    }
  }
};

export const analyzeEmotionFromImage = async (
  base64Image: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "Erreur: Clé API manquante";

  const isGoogleKey = apiKey.startsWith("AIza");

  if (isGoogleKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: "Analyse l'expression faciale et l'émotion." },
          ],
        },
      });

      return response.text || "Aucune analyse disponible.";
    } catch {
      return "Erreur lors de l'analyse d'image (Google).";
    }
  } else {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Analyse l'expression faciale." },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch {
      return "Service d'analyse momentanément indisponible.";
    }
  }
};