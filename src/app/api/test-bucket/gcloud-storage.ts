import { Storage } from '@google-cloud/storage';

let storage: Storage;

/**
 * Singleton factory for Google Cloud Storage client.
 * Ensures a single instance is created and reused.
 */
export function getStorage(): Storage {
  if (storage) {
    return storage;
  }

  // This configuration is designed to work both locally and on Vercel.
  // On Vercel, you must set CLIENT_EMAIL, PRIVATE_KEY, and PROJECT_ID.
  // Locally, you can use a service account file via GOOGLE_APPLICATION_CREDENTIALS.
  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  storage = new Storage({
    projectId: process.env.PROJECT_ID || 'lexbharat',
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: privateKey,
    },
  });

  console.log('🔑 Google Cloud Storage client initialized.');
  return storage;
}