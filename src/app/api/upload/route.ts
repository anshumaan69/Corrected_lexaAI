import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdfFile') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json({ message: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Initialize Google Cloud Storage
    let storage;
    
    if (process.env.GOOGLE_CLOUD_CLIENT_EMAIL && process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
      // Use environment variables (recommended for Vercel)
      storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
        credentials: {
          client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Use the service account key file (for local development)
      storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
    } else {
      // Use default application credentials
      storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
      });
    }
    
    const bucketName = 'genai-3301'; // Your bucket name

    // Use a unique ID for the filename to avoid collisions
    const uniqueId = uuidv4();
    const destination = `uploads/${uniqueId}-${file.name}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      // Upload buffer to Google Cloud Storage
      await storage.bucket(bucketName).file(destination).save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

      console.log(`File uploaded successfully: ${destination}`);

      // We use the unique filename to find the doc in Firestore later
      const firestoreDocId = destination;
      
      return NextResponse.json({ documentId: firestoreDocId }, { status: 200 });
    } catch (uploadError) {
      console.error('Error uploading to GCS:', uploadError);
      return NextResponse.json({ 
        message: 'Error uploading file to cloud storage',
        error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}