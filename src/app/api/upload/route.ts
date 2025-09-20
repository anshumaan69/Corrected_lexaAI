import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

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
    const storage = new Storage({
      keyFilename: path.join(process.cwd(), 'key.json'),
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
    });
    
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