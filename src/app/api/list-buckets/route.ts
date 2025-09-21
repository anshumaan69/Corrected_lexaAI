import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function GET(req: NextRequest) {
  try {
    console.log('Listing available buckets...');
    
    // Initialize storage with the credentials that work
    const storage = new Storage({
      projectId: process.env.PROJECT_ID || 'lexbharat',
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }
    });

    // List all buckets to see what's available
    const [buckets] = await storage.getBuckets();
    
    const bucketInfo = buckets.map(bucket => ({
      name: bucket.name,
      id: bucket.id,
      location: bucket.metadata?.location,
      storageClass: bucket.metadata?.storageClass,
      created: bucket.metadata?.timeCreated
    }));

    return NextResponse.json({
      success: true,
      message: 'Successfully listed buckets',
      project_id: process.env.PROJECT_ID,
      client_email: process.env.CLIENT_EMAIL,
      configured_bucket: process.env.FIREBASE_STORAGE_BUCKET,
      available_buckets: bucketInfo,
      total_buckets: buckets.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Failed to list buckets:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to list buckets',
      message: error instanceof Error ? error.message : 'Unknown error',
      project_id: process.env.PROJECT_ID,
      client_email: process.env.CLIENT_EMAIL,
      configured_bucket: process.env.FIREBASE_STORAGE_BUCKET,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}