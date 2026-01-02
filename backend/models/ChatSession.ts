/**
 * Fichier : backend/models/ChatSession.ts
 * But : Schéma MongoDB pour les sessions de chat.
 * Inclut :
 * - Messages (User/IA)
 * - Paramètres vocaux utilisés (VoiceSettings)
 * - Titre et statut favori
 */

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: String,
  role: { type: String, enum: ['user', 'model'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, default: Date.now },
  type: { type: String, default: 'text' }
});

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  lastMessage: { type: String },
  favorite: { type: Boolean, default: false },
  
  // Persistance des réglages vocaux pour cette session spécifique
  voiceSettings: {
    gender: { type: String, default: 'female' },
    dialect: { type: String, default: 'fr-FR' },
    autoRead: { type: Boolean, default: true }
  },
  
  messages: [messageSchema]
});

export default mongoose.model('ChatSession', chatSessionSchema);