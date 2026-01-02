import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer: MongoMemoryServer | null = null;

export const connectMongoSmart = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mentalsense";

  try {
    // Tentative de connexion MongoDB classique
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connecté (local/service)");
  } catch (error) {
    console.warn("⚠️ MongoDB indisponible, démarrage en mode mémoire...");

    // Fallback automatique : MongoDB en mémoire
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();

    await mongoose.connect(uri);
    console.log("✅ MongoDB mémoire actif (fallback automatique)");
  }
};
