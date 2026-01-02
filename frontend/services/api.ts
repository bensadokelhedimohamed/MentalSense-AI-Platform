import { User, ChatSession, UploadedFile } from '../types';

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Fonction pour vérifier la santé du Backend
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = API_URL.replace('/api', '') + '/health';
    const response = await fetch(healthUrl, { method: 'GET' });
    return response.ok;
  } catch (error) {
    // Backend éteint : c'est normal en dev si on n'a pas lancé le serveur
    return false;
  }
};

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('mentalsense_current_user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        if (parsed && parsed.token) {
          headers['Authorization'] = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) { }
  }
  
  return headers;
};

// Wrapper sécurisé pour fetch qui gère le "Offline"
const safeFetch = async (url: string, options: RequestInit): Promise<any> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    return response.json();
  } catch (error: any) {
    // Si c'est une erreur de connexion (backend éteint), on renvoie null ou on throw une erreur spécifique
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      console.warn(`⚠️ Backend inaccessible (${url}). Mode hors ligne.`);
      throw new Error("BACKEND_OFFLINE");
    }
    throw error;
  }
};

export const apiLogin = async (email: string, pass: string): Promise<User> => {
  try {
    const data = await safeFetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
    });
    return { ...data.user, token: data.token, id: data.user.id || data.user._id };
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      throw new Error('BACKEND_OFFLINE');
    }
    throw e;
  }
};

export const apiRegister = async (name: string, email: string, pass: string): Promise<User> => {
  try {
    const data = await safeFetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass }),
    });
    return { ...data.user, token: data.token, id: data.user.id || data.user._id };
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      throw new Error('BACKEND_OFFLINE');
    }
    throw e;
  }
};

export const apiUpdateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    return await safeFetch(`${API_URL}/auth/prefs`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ userId, ...updates }),
    });
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      throw new Error('BACKEND_OFFLINE');
    }
    throw e;
  }
};

export const apiGetSessions = async (): Promise<ChatSession[]> => {
  try {
    const data = await safeFetch(`${API_URL}/chat`, { headers: getHeaders() });
    return data.map((d: any) => ({ ...d, id: d.id || d._id }));
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      // Backend offline: return empty list (no mocks available)
      console.warn('Backend offline: returning empty sessions list');
      return [];
    }
    throw e;
  }
};

export const apiSaveSession = async (session: ChatSession): Promise<ChatSession> => {
  try {
    const data = await safeFetch(`${API_URL}/chat/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(session),
    });
    return { ...data, id: data.id || data._id };
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      // Backend offline: return the provided session (no persistence)
      console.warn('Backend offline: session not persisted');
      return session;
    }
    throw e;
  }
};

export const apiDeleteSession = async (id: string): Promise<void> => {
  try {
    await safeFetch(`${API_URL}/chat/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      console.warn('Backend offline: cannot delete session');
      return;
    }
    throw e;
  }
};

export const apiToggleFavorite = async (id: string): Promise<void> => {
  try {
    await safeFetch(`${API_URL}/chat/${id}/favorite`, {
        method: 'PUT',
        headers: getHeaders(),
    });
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      console.warn('Backend offline: cannot toggle favorite');
      return;
    }
    throw e;
  }
};

export const apiAnalyzeFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const endpoint = file.type.startsWith('image/') ? 'analyze-image' : 'analyze-text';
        
        const data = await safeFetch(`${API_URL}/ml/${endpoint}`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ data: base64.split(',')[1], filename: file.name }),
        });
        
        resolve(data.details || data.sentiment || "Fichier analysé.");
      } catch (e: any) {
         if (e.message === 'BACKEND_OFFLINE') {
             reject(new Error('BACKEND_OFFLINE'));
         } else {
             reject(e);
         }
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const getVoiceSampleLocal = (dialect: string): string => {
  const samples: Record<string, string> = {
    'fr-FR': "Bonjour, je suis votre assistant MentalSense.",
    'en-US': "Hello, I am your MentalSense assistant.",
    'ar-SA': "مرحبًا، أنا مساعدك النفسي.",
    'ar-TN': "عسلامة، أنا المساعد النفسي متاعك."
  };
  return samples[dialect] || "Test voice.";
};

export const apiGetStats = async (): Promise<any[]> => {
  try {
    const data = await safeFetch(`${API_URL}/dashboard/stats`, { headers: getHeaders() });
    return data?.data || [];
  } catch (e: any) {
    if (e.message === 'BACKEND_OFFLINE') {
      throw new Error('BACKEND_OFFLINE');
    }
    throw e;
  }
};