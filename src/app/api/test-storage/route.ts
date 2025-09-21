import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/gcloud-storage';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing storage connection...');
    
    const storage = getStorage();
    const authMethod = process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'key_file' : 'env_vars';

    // Test bucket access
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'genai-3301';
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