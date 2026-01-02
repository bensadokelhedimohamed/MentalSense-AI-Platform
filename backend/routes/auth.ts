import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/authMiddleware'; // Assurez-vous d'importer le middleware

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_key';

// --- Inscription ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        voiceSettings: user.voiceSettings,
        notificationPrefs: user.notificationPrefs 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Connexion ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Identifiants invalides' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Identifiants invalides' });

    user.lastVisit = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        voiceSettings: user.voiceSettings,
        notificationPrefs: user.notificationPrefs,
        lastVisit: user.lastVisit
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Mise à jour Préférences ---
// Note: Utilisation de protect pour sécuriser la route
router.put('/prefs', protect, async (req, res) => {
  try {
    const { userId, voiceSettings, notificationPrefs } = req.body;
    
    // Vérification de sécurité de base
    if ((req as any).user.id !== userId) {
        return res.status(403).json({ message: "Non autorisé" });
    }

    const updates: any = {};
    if (voiceSettings) updates.voiceSettings = voiceSettings;
    if (notificationPrefs) updates.notificationPrefs = notificationPrefs;

    const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur mise à jour' });
  }
});

export default router;