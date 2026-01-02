/**
 * Fichier : backend/controllers/mlController.ts
 * But : Gestionnaire d'IA hybride utilisant Gemini et Groq (Llama 3).
 */
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- ANALYSE DE TEXTE & FORECASTING ---
export const analyzeText = async (req: Request, res: Response) => {
    try {
        const { text, useLocal } = req.body;
        if (!text) return res.status(400).json({ message: "Texte manquant" });

        // Si useLocal est activé, on utilise Groq (Llama 3) au lieu d'Ollama (gain d'espace)
        // Idéal pour le Time Series Forecasting grâce à la vitesse de Groq
        if (useLocal === true) {
            try {
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant", // Modèle ultra-rapide sur Groq
                        messages: [
                            { role: "system", content: "Tu es un expert en psychologie et analyse de données (Time Series)." },
                            { role: "user", content: text }
                        ],
                        temperature: 0.1 // Précision mathématique pour les prédictions
                    })
                });
                const data = await response.json();
                return res.json({ 
                    reply: data.choices?.[0]?.message?.content || "Erreur Groq", 
                    success: true, 
                    source: "MentalSense Engine (Llama 3 via Groq)" 
                });
            } catch (err) {
                return res.status(503).json({ message: "Service Groq temporairement indisponible" });
            }
        }

        // Utilisation par défaut de Gemini (via GEMINI_API_KEY du .env)
        const cloudKey = process.env.GEMINI_API_KEY;
        if (!cloudKey) throw new Error("Clé API Gemini manquante");

        const genAI = new GoogleGenerativeAI(cloudKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(text);
        const cloudResponse = await result.response;
        
        return res.json({ 
            reply: cloudResponse.text(), 
            success: true, 
            source: "MentalSense Cloud (Gemini)" 
        });
    } catch (error: any) {
        console.error("❌ Erreur analyzeText:", error.message);
        return res.status(500).json({ message: "Erreur lors de l'analyse du texte" });
    }
};

// --- ANALYSE D'IMAGE ---
// Exportation explicite pour corriger l'erreur TS2305
export const analyzeImage = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ message: "Données image manquantes" });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent([
            "Analyse l'expression faciale sur cette image.", 
            { inlineData: { mimeType: "image/jpeg", data } }
        ]);
        const response = await result.response;
        
        return res.json({ reply: response.text(), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de l'analyse de l'image" });
    }
};

// --- ANALYSE AUDIO ---
// Exportation explicite pour corriger l'erreur TS2305
export const analyzeAudio = async (req: Request, res: Response) => {
    return res.json({ 
        reply: "L'analyse audio sera bientôt intégrée via Groq Whisper.", 
        success: true 
    });
};