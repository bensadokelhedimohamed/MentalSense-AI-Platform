import express from 'express';
import { getStats } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protect the dashboard stats endpoint and return per-user stats
router.get('/stats', protect, getStats);

export default router;
