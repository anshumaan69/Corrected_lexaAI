import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing specific bucket access...');
    
    // Initialize storage with current credentials
    const storage = new Storage({
      projectId: process.env.PROJECT_ID || 'lexbharat',
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }
    });

    // Test the specific bucket that should exist
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'genai-3301';
    console.log('Testing bucket:', bucketName);
    
    const bucket = storage.bucket(bucketName);
    
    // Try a simple operation - check if bucket exists
    const [exists] = await bucket.exists();
    
    if (!exists) {
      return NextResponse.json({
        success: false,
        message: `Bucket ${bucketName} does not exist`,
        bucket_name: bucketName,
        client_email: process.env.CLIENT_EMAIL,
        project_id: process.env.PROJECT_ID,
        suggestions: [
          'Try lexbharat.firebaseapp.com',
          'Try lexbharat-default-bucket',
          'Check Firebase Console for correct bucket name'
        ]
      }, { status: 404 });
    }
    
    // Try to get bucket metadata
    try {
      const [metadata] = await bucket.getMetadata();
      return NextResponse.json({
        success: true,
        message: 'Bucket exists and is accessible',
        bucket_name: bucketName,
        bucket_location: metadata.location,
        bucket_created: metadata.timeCreated,
        client_email: process.env.CLIENT_EMAIL,
        project_id: process.env.PROJECT_ID,
        timestamp: new Date().toISOString()
      });
    } catch (metadataError) {
      return NextResponse.json({
        success: true,
        message: 'Bucket exists but metadata access limited',
        bucket_name: bucketName,
        client_email: process.env.CLIENT_EMAIL,
        project_id: process.env.PROJECT_ID,
        note: 'This is fine - the bucket exists and should work for uploads',
        metadata_error: metadataError instanceof Error ? metadataError.message : 'Unknown error'
      });
    }
    
  } catch (error) {
    console.error('Bucket test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Bucket test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      bucket_name: process.env.FIREBASE_STORAGE_BUCKET,
      client_email: process.env.CLIENT_EMAIL,
      project_id: process.env.PROJECT_ID,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}