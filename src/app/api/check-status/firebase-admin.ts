import admin from 'firebase-admin';

/**
 * Singleton factory for Firebase Admin client.
 * Ensures a single instance is created and reused.
 */
export function getFirebaseAdmin() {
  if (admin.apps.length) {
    return admin;
  }

  // This configuration is designed to work both locally and on Vercel.
  // On Vercel, you must set all the relevant `process.env` variables.
  // Locally, you can use a service account file via GOOGLE_APPLICATION_CREDENTIALS.
  if (process.env.CLIENT_EMAIL && process.env.PRIVATE_KEY) {
    console.log('🔑 Initializing Firebase Admin with environment variables...');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n').trim(),
      }),
      projectId: process.env.PROJECT_ID,
    });
  } else {
    // Fallback for local development using a credentials file
    console.log('🔑 Initializing Firebase Admin with default credentials...');
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.PROJECT_ID || 'lexbharat',
    });
  }

  console.log('🔥 Firebase Admin SDK initialized successfully.');
  return admin;
}