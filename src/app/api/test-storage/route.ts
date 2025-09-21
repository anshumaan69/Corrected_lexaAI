import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing storage connection...');
    
    // Test the storage initialization
    let storage;
    let authMethod = 'unknown';
    
    if (process.env.CLIENT_EMAIL && process.env.PRIVATE_KEY) {
      console.log('Using new environment variables...');
      authMethod = 'new_env_vars';
      storage = new Storage({
        projectId: process.env.PROJECT_ID || 'lexbharat',
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log('Using key file path...');
      authMethod = 'key_file';
      storage = new Storage({
        projectId: process.env.PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
    } else {
      console.log('Using default credentials...');
      authMethod = 'default';
      storage = new Storage({
        projectId: process.env.PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID || 'lexbharat',
      });
    }

    // Test bucket access
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'lexbharat.appspot.com';
    console.log('Testing bucket:', bucketName);
    
    const bucket = storage.bucket(bucketName);
    
    // Try to get bucket metadata (this will test authentication)
    const [metadata] = await bucket.getMetadata();
    
    return NextResponse.json({
      success: true,
      message: 'Storage connection successful',
      auth_method: authMethod,
      bucket_name: bucketName,
      bucket_location: metadata.location,
      bucket_created: metadata.timeCreated,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Storage test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Storage connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}