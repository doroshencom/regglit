// src/auth/socialAuth.js
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Google Sign-In successful:', result.user);
  } catch (error) {
    console.error('Error with Google Sign-In:', error.message);
  }
};
