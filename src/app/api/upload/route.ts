import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getStorage } from '@/lib/gcloud-storage';

export async function POST(req: NextRequest) {
  console.log('🚀 Upload API called');
  
  try {
    const formData = await req.formData();
    const file = formData.get('pdfFile') as File;
    
    console.log('📁 File received:', file ? `${file.name} (${file.size} bytes)` : 'No file');

    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json({ message: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Initialize Google Cloud Storage using the centralized utility
    const storage = getStorage();
    
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'genai-3301';
    console.log('🪣 Using bucket:', bucketName);

    // Use a unique ID for the filename to avoid collisions
    const uniqueId = uuidv4();
    const destination = `uploads/${uniqueId}-${file.name}`;
    console.log('📝 Upload destination:', destination);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('💾 Buffer created, size:', buffer.length, 'bytes');

    try {
      console.log('⬆️ Starting upload to Google Cloud Storage...');
      
      // Upload buffer to Google Cloud Storage
      await storage.bucket(bucketName).file(destination).save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

      console.log(`✅ File uploaded successfully: ${destination}`);

      // We use the unique filename to find the doc in Firestore later
      const firestoreDocId = destination;
      
      return NextResponse.json({ documentId: firestoreDocId }, { status: 200 });
    } catch (uploadError) {
      console.error('❌ Error uploading to GCS:', uploadError);
      console.error('❌ Upload error details:', {
        message: uploadError instanceof Error ? uploadError.message : 'Unknown error',
        stack: uploadError instanceof Error ? uploadError.stack : 'No stack trace',
        bucket: bucketName,
        destination: destination
      });
      return NextResponse.json({ 
        message: 'Error uploading file to cloud storage',
        error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Error processing request:', error);
    console.error('❌ Request error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ 
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}