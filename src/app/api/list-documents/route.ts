import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  let credential;
  
  // Try to use environment variables, fallback to default application credentials
  if (process.env.GOOGLE_CLOUD_CLIENT_EMAIL && process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
    // Use environment variables (recommended for Vercel)
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
      private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL
    };
    credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use the service account key file (for local development)
    credential = admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  } else {
    // Use default application credentials (for development or when deployed on Google Cloud)
    credential = admin.credential.applicationDefault();
  }
  
  admin.initializeApp({
    credential: credential,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
  });
}

const db = admin.firestore();

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching all documents from Firestore...');
    
    // Get all documents from the collection
    const snapshot = await db.collection('document_analysis').get();
    
    if (snapshot.empty) {
      console.log('No documents found in collection');
      return NextResponse.json({ 
        message: 'No documents found',
        documents: []
      }, { status: 200 });
    }

    const documents: any[] = [];
    snapshot.forEach((doc: any) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to readable format
        processed_timestamp: doc.data().processed_timestamp?.toDate?.()?.toISOString() || doc.data().processed_timestamp,
        web_search_timestamp: doc.data().web_search_timestamp?.toDate?.()?.toISOString() || doc.data().web_search_timestamp,
        analysis_timestamp: doc.data().analysis_timestamp?.toDate?.()?.toISOString() || doc.data().analysis_timestamp,
      });
    });

    console.log(`Found ${documents.length} documents`);
    
    return NextResponse.json({ 
      message: `Found ${documents.length} documents`,
      count: documents.length,
      documents 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}