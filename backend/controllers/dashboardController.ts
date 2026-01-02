/**
 * Fichier : backend/controllers/dashboardController.ts
 * But : Calculer les statistiques de sentiment pour le tableau de bord.
 */

import { Request, Response } from 'express';
// Importation de sentiment (bibliothèque simple pour le scoring)
const Sentiment = require('sentiment');
import ChatSession from '../models/ChatSession';

const sentiment = new Sentiment();

// Labels pour l'affichage des jours de la semaine
const weekdayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const getStats = async (req: Request, res: Response) => {
  try {
    // Récupération des sessions (on peut filtrer par user ici si besoin)
    const sessions = await ChatSession.find({}).lean();

    // Agrégation des scores par jour
    const dayBuckets: Record<string, { total: number; count: number }> = {};

    for (const session of sessions) {
      const messages = (session as any).messages || [];
      for (const msg of messages) {
        if (!msg.content) continue;

        // Analyse du sentiment du message
        const result = sentiment.analyze(msg.content || '');
        const score = result.score || 0;

        // Utilisation du timestamp du message ou de l'heure actuelle par défaut
        const timestamp = typeof msg.timestamp === 'number' ? msg.timestamp : Date.now();
        const date = new Date(timestamp);
        
        // Clé unique par jour (YYYY-MM-DD)
        const key = date.toISOString().slice(0, 10);

        if (!dayBuckets[key]) dayBuckets[key] = { total: 0, count: 0 };
        dayBuckets[key].total += score;
        dayBuckets[key].count += 1;
      }
    }

    // Préparation des données pour les 7 derniers jours
    const today = new Date();
    const days: Array<{ date: string; label: string; score: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      
      const bucket = dayBuckets[key];
      const avg = bucket && bucket.count > 0 ? bucket.total / bucket.count : 0;
      
      // Normalisation du score pour le graphique (0 à 100)
      const normalized = Math.max(0, Math.min(100, Math.round(((avg + 10) / 20) * 100)));
      
      days.push({ 
        date: key, 
        label: weekdayLabels[d.getDay()], 
        score: normalized 
      });
    }

    res.json({ data: days });
  } catch (error) {
    console.error('Error computing dashboard stats', error);
    res.status(500).json({ message: 'Erreur serveur lors du calcul des statistiques' });
  }
};
