/**
 * Fichier : backend/routes/chat.ts
 * But : Routes API REST pour le chat.
 */

import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getSessions, saveSession, deleteSession, toggleFavorite } from '../controllers/chatController';

const router = express.Router();

router.get('/', protect, getSessions);
router.post('/save', protect, saveSession);
router.delete('/:id', protect, deleteSession);
router.put('/:id/favorite', protect, toggleFavorite);

export default router;
