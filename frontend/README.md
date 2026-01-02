MentalSense – Plateforme d'Analyse Psychologique par IA

MentalSense est une plateforme innovante d'analyse psychologique assistée par IA. Elle permet aux utilisateurs d'interagir via chat textuel/vocal, d'uploader des documents (PDF/images) pour analyse, et de visualiser des insights via un dashboard interactif. Support multilingue (arabe dialectal, français, anglais) avec synthèse vocale personnalisable (voix homme/femme, accents).

🛠️ Stack Technique
Frontend : Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion (animations), React Hook Form, Zod (validation).
Backend : Node.js/Express, TypeScript, MongoDB (Mongoose ODM), OpenAI API (GPT-4 pour analyse psychologique).
Audio/STT : Web Speech API (browser-native), ElevenLabs (TTS avancé).
Autres : Vite (dev server), Husky (hooks Git), Vitest (tests), Vercel (déploiement recommandé).

🚀 Installation & Démarrage Rapide
Prérequis
Node.js ≥ 20.x

Compte OpenAI (clé API dans .env.local pour prod)

MongoDB Atlas (optionnel)

1. Frontend (Démonstration Immédiate)
bash
git clone <repo-url>
cd mentalsense-ai
npm install
npm run dev
Accédez à http://localhost:3000. Prêt en 30s !

2. Backend (Production Locale)
bash
cd backend
npm install
cp .env.example .env  # Ajoutez MONGODB_URI et OPENAI_API_KEY
npm run dev
Frontend : Ajoutez NEXT_PUBLIC_API_URL=http://localhost:5000/api dans .env.local.

✨ Fonctionnalités Clés
Chat IA Audio : Conversations vocales en temps réel. Dialecte arabe/français, micro → Analyse & réponse TTS.

Analyse de Documents : Upload PDF/image → Scoring psychologique (stress, humeur) + dashboard animé.

Personnalisation : Voix (homme/femme), thème sombre, persistence (localStorage).

Authentification : Inscription/connexion (JWT backend).

Responsive : Mobile-first, PWA-ready.

Tests Recommandés :

Chat : Dialecte arabe → TTS accentué.

Dashboard : Upload PDF → Graphiques.

Persistance : Voix → Refresh page.

🔑 Identifiants Démo 
Email : demo@mentalsense.ai

Mot de passe : demo123

📱 Déploiement
Frontend : npm run build → Vercel/Netlify.

Backend : Render/Heroku + MongoDB Atlas.

🤝 Contribution
Fork & clone.

npm run lint & npm test.

Commit & PR.

📄 Licence
MIT – Projet académique open-source.

Auteur : Mohamed Elhedi Ben Sadok – ITBS Nabeul (2025/2026)
https://github.com/BenSadokMohamedElhedi7/MentalSense-AI-Platform.git
