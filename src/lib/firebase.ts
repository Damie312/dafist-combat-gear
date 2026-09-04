import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Suppress internal Firestore connection state churn and retry logs from triggering console.error
setLogLevel('silent');

// Standard Firestore initialization using the configured firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const functions = getFunctions(app);

export default app;
