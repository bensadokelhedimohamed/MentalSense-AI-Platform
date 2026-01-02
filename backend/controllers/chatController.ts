/**
 * Fichier : backend/controllers/chatController.ts
 * But : Logique métier pour la gestion des conversations.
 */

import { Request, Response } from 'express';
import ChatSession from '../models/ChatSession';
import { AuthRequest } from '../middleware/authMiddleware';

// Récupérer toutes les sessions de l'utilisateur
export const getSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const sessions = await ChatSession.find({ userId }).sort({ date: -1 });
    (res as any).json(sessions);
  } catch (error) {
    (res as any).status(500).json({ message: 'Erreur serveur lors de la récupération des chats' });
  }
};

// Sauvegarder ou mettre à jour une session
export const saveSession = async (req: Request, res: Response) => {
  try {
    const { id, title, messages, lastMessage, favorite, voiceSettings } = (req as any).body;
    const userId = (req as AuthRequest).user.id;

    // Cherche par ID (soit _id Mongo si existant, soit id frontend pour la création initiale)
    // On utilise findOne avec $or pour couvrir les deux cas
    let session: any = await ChatSession.findOne({ 
      userId, 
      $or: [{ id: id }, { _id: (id && id.match(/^[0-9a-fA-F]{24}$/)) ? id : null }] 
    });

    if (session) {
      session.messages = messages;
      session.lastMessage = lastMessage;
      session.voiceSettings = voiceSettings;
      session.date = new Date();
      await session.save();
    } else {
      session = await ChatSession.create({
        userId,
        id, // Stocke l'ID généré par le frontend pour la référence
        title,
        messages,
        lastMessage,
        favorite,
        voiceSettings
      } as any);
    }

    (res as any).status(200).json(session);
  } catch (error) {
    console.error(error);
    (res as any).status(500).json({ message: 'Erreur lors de la sauvegarde du chat' });
  }
};

// Supprimer une session
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).params;
    const userId = (req as AuthRequest).user.id;
    // Suppression flexible par id frontend ou _id mongo
    await ChatSession.deleteOne({ 
      userId, 
      $or: [{ id: id }, { _id: (id && id.match(/^[0-9a-fA-F]{24}$/)) ? id : null }] 
    });
    (res as any).json({ message: 'Session supprimée' });
  } catch (error) {
    (res as any).status(500).json({ message: 'Erreur suppression' });
  }
};

// Basculer favori
export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).params;
    const userId = (req as AuthRequest).user.id;
    
    const session = await ChatSession.findOne({ 
      userId, 
      $or: [{ id: id }, { _id: (id && id.match(/^[0-9a-fA-F]{24}$/)) ? id : null }] 
    });

    if (session) {
      session.favorite = !session.favorite;
      await session.save();
    }
    (res as any).json(session);
  } catch (error) {
    (res as any).status(500).json({ message: 'Erreur favori' });
  }
};