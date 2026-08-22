import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { AppUser } from '../types';
import { verifyEmailWhitelist } from './emailWhitelistService';

// Parse Firebase config from a single env variable
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Provider Configuration
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign In with Google SSO (Gmail / Google Workspace) with strict Whitelist Verification
 */
export async function signInWithGoogleSSO(): Promise<AppUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if the user email is in the allowed whitelist
    const email = user.email || '';
    const whitelistCheck = verifyEmailWhitelist(email);
    
    if (!whitelistCheck.allowed) {
      // Sign out immediately from Firebase so unwhitelisted session doesn't persist
      await signOut(auth);
      throw new Error(whitelistCheck.reason || 'Email Anda tidak memiliki izin akses ke sistem ini.');
    }

    return mapFirebaseUserToAppUser(user);
  } catch (error: any) {
    console.error('Google SSO error:', error);
    throw error;
  }
}

/**
 * Map Firebase Auth User (Google Account) to Application User Structure
 */
export function mapFirebaseUserToAppUser(user: FirebaseUser): AppUser {
  const email = user.email || '';
  const displayName = user.displayName || email.split('@')[0] || 'Petugas Intelijen';
  
  // Check if there is specific custom role/NIP in whitelist config
  const check = verifyEmailWhitelist(email);
  const cfg = check.config;

  let role: AppUser['role'] = cfg?.role || 'Jaksa Fungsional Intelijen';
  let unit = cfg?.unit || 'Seksi Intelijen Kejaksaan Negeri Tabanan';
  let nip = cfg?.nip;

  if (!nip) {
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const nipSuffix = String(1000 + (hash % 9000));
    nip = `19900101 201501 1 ${nipSuffix}`;
  }

  return {
    username: email.split('@')[0],
    name: cfg?.name || displayName,
    nip,
    role,
    unit,
    email,
    photoURL: user.photoURL || undefined,
    uid: user.uid,
    isLoggedIn: true,
  };
}

/**
 * Log Out from Firebase Auth
 */
export async function logOutFromFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

/**
 * Listen to Firebase Auth state changes with whitelist verification
 */
export function subscribeToAuthState(onUserChanged: (user: AppUser | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const email = firebaseUser.email || '';
      const check = verifyEmailWhitelist(email);
      if (check.allowed) {
        onUserChanged(mapFirebaseUserToAppUser(firebaseUser));
      } else {
        await signOut(auth);
        onUserChanged(null);
      }
    } else {
      onUserChanged(null);
    }
  });
}
