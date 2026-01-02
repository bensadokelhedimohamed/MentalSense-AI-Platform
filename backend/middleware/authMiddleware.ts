/**
 * Fichier : backend/middleware/authMiddleware.ts
 * But : Middleware pour vérifier la présence et la validité du token JWT.
 * Ajoute l'utilisateur décodé à la requête (req.user).
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_key';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Cast req/res to any to avoid type errors with missing properties in current definition
  const reqAny = req as any;
  const resAny = res as any;

  // Vérifier le header Authorization (Bearer token)
  if (reqAny.headers && reqAny.headers.authorization && reqAny.headers.authorization.startsWith('Bearer')) {
    try {
      token = reqAny.headers.authorization.split(' ')[1];

      // Vérification du token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      (req as AuthRequest).user = decoded;
      next();
    } catch (error) {
      console.error("Erreur auth:", error);
      resAny.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  } else {
    resAny.status(401).json({ message: 'Non autorisé, aucun token fourni' });
  }
};