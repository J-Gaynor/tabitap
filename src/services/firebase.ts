import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { JapanMapData } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB6l0XMhKD6V62Zyxy9xEsZF2-EwbOUiTg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'prefectures-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'prefectures-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'prefectures-app.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '663524305769',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:663524305769:web:deec92a6b57fa803f72bf8',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MS1DT719XZ'
};

// Initialize Firebase App
export const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth & Firestore
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Analytics (optional / safe initialization)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure in non-browser/test environments
  });
}

/**
 * Authentication Methods
 */

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const signInWithApple = async (): Promise<User> => {
  const result = await signInWithPopup(auth, appleProvider);
  return result.user;
};

export const signInGuest = async (): Promise<User> => {
  const result = await signInAnonymously(auth);
  return result.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Cloud Firestore Map Sync Methods
 */

export const syncMapToCloud = async (map: JapanMapData): Promise<void> => {
  if (!map || !map.id) return;
  try {
    const mapRef = doc(db, 'maps', map.id);
    await setDoc(
      mapRef,
      {
        ...map,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Failed to sync map to Cloud Firestore:', error);
  }
};

export const fetchUserMapsFromCloud = async (userId: string): Promise<JapanMapData[]> => {
  if (!userId) return [];
  try {
    const mapsRef = collection(db, 'maps');
    const q = query(mapsRef, where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    const maps: JapanMapData[] = [];
    querySnapshot.forEach((docSnap) => {
      maps.push(docSnap.data() as JapanMapData);
    });
    return maps;
  } catch (error) {
    console.error('Failed to fetch user maps from Firestore:', error);
    return [];
  }
};

export const subscribeToMapInCloud = (
  mapId: string,
  onUpdate: (map: JapanMapData | null) => void
): Unsubscribe => {
  const mapRef = doc(db, 'maps', mapId);
  return onSnapshot(
    mapRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as JapanMapData);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.warn('Firestore snapshot error for map:', mapId, error);
    }
  );
};
