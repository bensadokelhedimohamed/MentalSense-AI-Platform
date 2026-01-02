# Guide de Démarrage Manuel - MentalSense

Suivez ces étapes précises pour lancer le projet.

## 1. Installation du Frontend (Interface)

Ouvrez votre terminal dans le dossier racine `mentalsense-ai/frontend` (là où se trouvent `index.html` et `package.json`).

Exécutez les commandes suivantes une par une :

```bash
# 1. Installe les dépendances
npm install

# 2. Lance le serveur de développement
npm run dev
```

Une fois lancé, vous verrez un lien comme `http://localhost:3000` ou `5173`. Cliquez dessus pour voir l'application.

---

## 2. Installation du Backend (Serveur)

Ouvrez un **NOUVEAU** terminal (gardez le premier ouvert).
Naviguez vers le dossier `backend` :

```bash
# Depuis la racine frontend
cd backend
```

Exécutez les commandes suivantes :

```bash
# 1. Installe les dépendances backend
npm install

# 2. Lance le serveur backend
npm run dev
```

Vous devriez voir : `🚀 Serveur Backend démarré sur le port 5000`.

---

## Résumé
Vous devez avoir **deux terminaux** ouverts en même temps :
1. Un pour le Frontend (`npm run dev`)
2. Un pour le Backend (`cd backend` puis `npm run dev`)
