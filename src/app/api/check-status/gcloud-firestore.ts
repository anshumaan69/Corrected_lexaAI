import { Firestore } from '@google-cloud/firestore';

let firestore: Firestore;

/**
 * Singleton factory for Google Cloud Firestore client.
 * Ensures a single instance is created and reused.
 */
export function getFirestore(): Firestore {
  if (firestore) {
    return firestore;
  }

  // This configuration is designed to work both locally and on Vercel.
  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  firestore = new Firestore({
    projectId: process.env.PROJECT_ID || 'lexbharat',
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: privateKey,
    },
  });

  console.log('🔑 Google Cloud Firestore client initialized.');
  return firestore;
}