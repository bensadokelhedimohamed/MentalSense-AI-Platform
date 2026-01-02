/**
 * Fichier : types.ts
 * But : Définitions TypeScript centralisées pour l'ensemble de l'application.
 * Contient les interfaces pour les utilisateurs, messages, fichiers, et préférences.
 */

// Définition des langues supportées par l'interface
export type Language = 'fr' | 'en' | 'ar';

// Préférences de notification détaillées
export interface NotificationPreferences {
  reminders: boolean;       // Rappels de dernière visite / suivi
  books: boolean;           // Suggestions de livres psychologie/dev perso
  spiritual: boolean;       // Contenu spirituel (Versets / Hadiths / Motivation)
  entertainment: boolean;   // Contenu détente (Blagues / Histoires)
}

// Paramètres de la voix pour la synthèse vocale (TTS)
export interface VoiceSettings {
  gender: 'male' | 'female';
  dialect: 'fr-FR' | 'en-US' | 'ar-SA' | 'ar-EG' | 'ar-MA' | 'ar-TN'; // Ajout Tunisien (ar-TN)
  autoRead: boolean; // Lecture automatique des réponses de l'IA
}

// Interface utilisateur complète
export interface User {
  id: string; // Mapped from _id in API
  email: string;
  name: string;
  avatar?: string;
  token?: string; // Token d'authentification (JWT)
  notificationPrefs: NotificationPreferences;
  voiceSettings: VoiceSettings;
  lastVisit?: string | number; // Timestamp ou date string
}

// Structure d'un message dans le chat
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'audio';
  sentiment?: string; // Résultat de l'analyse de sentiment optionnelle
}

// Structure d'une session de conversation (Chat)
export interface ChatSession {
  id: string; // Frontend ID or Database ID
  _id?: string; // Database ID from MongoDB
  title: string;
  date: string; // ISO String
  lastMessage: string;
  messages: Message[];
  favorite: boolean;
  voiceSettings?: VoiceSettings; // Paramètres vocaux utilisés lors de cette session
}

// Données pour les graphiques statistiques
export interface EmotionStats {
  date: string; // Format jour (ex: "Lun")
  joy: number;
  anxiety: number;
  sadness: number;
  stress: number;
  neutral: number;
}

// Structure d'un fichier téléversé
export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'word';
  url: string;
  uploadDate: number;
  size: string;
}

// Contexte d'authentification
export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  updateUserPrefs: (prefs: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Contexte de thème (Dark/Light)
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Contexte de langue (i18n)
export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}