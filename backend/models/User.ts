import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  
  // Préférences Vocales
  voiceSettings: {
    gender: { type: String, enum: ['male', 'female'], default: 'female' },
    // Ajout ar-TN et autres à l'enum si on veut valider strict, ou String simple
    dialect: { type: String, default: 'fr-FR' }, 
    autoRead: { type: Boolean, default: true }
  },

  // Préférences Notifications
  notificationPrefs: {
    reminders: { type: Boolean, default: true },
    books: { type: Boolean, default: true },
    spiritual: { type: Boolean, default: true },
    entertainment: { type: Boolean, default: false }
  }
});

export default mongoose.model('User', userSchema);