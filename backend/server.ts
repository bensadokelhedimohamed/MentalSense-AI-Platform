/**
 * Fichier : backend/server.ts
 * But : Serveur principal Express.
 */

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import mlRoutes from './routes/ml';
import dashboardRoutes from './routes/dashboard';
import { connectMongoSmart } from './config/mongo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(helmet() as any); 
app.use(cors());
app.use(express.json({ limit: '10mb' }) as any); // pour images base64

// --- Fonction pour démarrer le serveur avec MongoDB ---
async function startServer() {
  try {
    await connectMongoSmart(); // se connecter à MongoDB
    console.log('✅ Connecté à MongoDB');

    // --- Routes API ---
    app.use('/api/auth', authRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/ml', mlRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    // Route de santé
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date() });
    });

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur Backend démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur connexion MongoDB:', err);
  }
}

// --- Lancement du serveur ---
startServer();
