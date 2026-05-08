// wrapper for environment variables used in the app

// Provide defaults for local development if env vars not set
const DEFAULT_FIREBASE = {
  apiKey: "AIzaSyC3I4QSyNuWi4fvhuaVyFL-L9KYggXekcw",
  authDomain: "neuropath-ai-30bdc.firebaseapp.com",
  projectId: "neuropath-ai-30bdc",
  storageBucket: "neuropath-ai-30bdc.firebasestorage.app",
  messagingSenderId: "582916341260",
  appId: "1:582916341260:web:7aaf895e717bafc6c17829",
};

export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE.apiKey;
export const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE.authDomain;
export const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE.projectId;
export const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE.storageBucket;
export const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE.messagingSenderId;
export const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE.appId;

// AI_API_KEY has no default; must be set via VITE_AI_API_KEY or the client calls will fail
export const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || "";
