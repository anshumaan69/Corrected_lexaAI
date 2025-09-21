import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔍 Environment Variables Check:');
  
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    GOOGLE_APPLICATION_CREDENTIALS: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
    CLIENT_EMAIL: !!process.env.CLIENT_EMAIL,
    PRIVATE_KEY: !!process.env.PRIVATE_KEY,
    PROJECT_ID: !!process.env.PROJECT_ID,
    GOOGLE_CLOUD_PROJECT_ID: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
    CLIENT_EMAIL_VALUE: process.env.CLIENT_EMAIL ? process.env.CLIENT_EMAIL.substring(0, 20) + '...' : 'NOT SET',
    PRIVATE_KEY_LENGTH: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0,
    PROJECT_ID_VALUE: process.env.PROJECT_ID || 'NOT SET',
    BUCKET_VALUE: process.env.FIREBASE_STORAGE_BUCKET || 'NOT SET'
  };
  
  console.log('Environment Check Result:', envCheck);
  
  return NextResponse.json(envCheck);
}