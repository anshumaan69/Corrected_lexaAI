import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check which environment variables are available
    const envCheck = {
      // New simplified variables
      PROJECT_ID: !!process.env.PROJECT_ID,
      PRIVATE_KEY_ID: !!process.env.PRIVATE_KEY_ID,
      PRIVATE_KEY: !!process.env.PRIVATE_KEY ? 'Available (length: ' + process.env.PRIVATE_KEY.length + ')' : 'Missing',
      CLIENT_EMAIL: !!process.env.CLIENT_EMAIL,
      CLIENT_ID: !!process.env.CLIENT_ID,
      UNIVERSE_DOMAIN: !!process.env.UNIVERSE_DOMAIN,
      FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
      
      // Old variables (for backward compatibility)
      GOOGLE_CLOUD_PROJECT_ID: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_CLOUD_CLIENT_EMAIL: !!process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      GOOGLE_APPLICATION_CREDENTIALS: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      
      // Runtime info
      environment: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      deployment_url: process.env.VERCEL_URL || 'N/A'
    };

    return NextResponse.json({
      message: 'Environment debug info',
      environment_variables: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}