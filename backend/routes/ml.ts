/**
 * Fichier : backend/routes/ml.ts
 * But : Routes pour l'intelligence artificielle.
 */

import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { analyzeText, analyzeAudio, analyzeImage } from '../controllers/mlController';

const router = express.Router();

router.post('/analyze-text', protect, analyzeText);
router.post('/analyze-audio', protect, analyzeAudio);
router.post('/analyze-image', protect, analyzeImage);

export default router;
