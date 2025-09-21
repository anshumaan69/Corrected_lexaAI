import { NextResponse } from 'next/server';
import { getStorage } from '@/lib/gcloud-storage';

export async function GET() {
  try {
    console.log('🔍 Testing Environment Variables...');
    
    // Check all environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      CLIENT_EMAIL: !!process.env.CLIENT_EMAIL,
      PRIVATE_KEY: !!process.env.PRIVATE_KEY,
      PROJECT_ID: !!process.env.PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
      CLIENT_EMAIL_VALUE: process.env.CLIENT_EMAIL || 'NOT SET',
      PRIVATE_KEY_LENGTH: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0,
      PROJECT_ID_VALUE: process.env.PROJECT_ID || 'NOT SET',
      BUCKET_VALUE: process.env.FIREBASE_STORAGE_BUCKET || 'NOT SET'
    };
    
    console.log('Environment Variables:', envCheck);
    
    // Test Google Cloud Storage initialization
    let storageTest: { status: string; error: string | null } = { status: 'failed', error: null };
    
    try {
      if (process.env.CLIENT_EMAIL && process.env.PRIVATE_KEY) {
        console.log('🔑 Testing Google Cloud Storage with credentials...');
        
        // Process private key - handle both escaped and unescaped formats
        let privateKey = process.env.PRIVATE_KEY;
        
        // If it contains \\n, replace with actual newlines
        if (privateKey.includes('\\n')) {
          privateKey = privateKey.replace(/\\n/g, '\n');
        }
        
        // Ensure proper formatting
        privateKey = privateKey.trim();
        
        console.log('Private key length:', privateKey.length);
        console.log('Private key starts with:', privateKey.substring(0, 27));
        console.log('Private key ends with:', privateKey.substring(privateKey.length - 25));
        
        const storage = getStorage();
        
        // Test bucket access
        const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'genai-3301';
        const bucket = storage.bucket(bucketName);
        
        // Try to get bucket metadata
        await bucket.getMetadata();
        
        storageTest = { status: 'success', error: null };
        console.log('✅ Google Cloud Storage test successful');
      } else {
        storageTest = { status: 'failed', error: 'Missing credentials' };
        console.log('❌ Missing CLIENT_EMAIL or PRIVATE_KEY');
      }
    } catch (error) {
      storageTest = { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.error('❌ Google Cloud Storage test failed:', error);
    }
    
    return NextResponse.json({
      environment: envCheck,
      storageTest: storageTest,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}