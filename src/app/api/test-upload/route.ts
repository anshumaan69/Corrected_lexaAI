import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing file upload to bucket...');
    
    // Initialize storage
    const storage = new Storage({
      projectId: process.env.PROJECT_ID || 'lexbharat',
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }
    });

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'lexbharat.appspot.com';
    const bucket = storage.bucket(bucketName);
    
    // Create a test file
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'This is a test file to verify bucket upload permissions.';
    
    const file = bucket.file(testFileName);
    
    // Try to upload the test file
    await file.save(testContent, {
      metadata: {
        contentType: 'text/plain',
        metadata: {
          uploadedBy: 'test-endpoint',
          timestamp: new Date().toISOString()
        }
      }
    });
    
    // Try to get the file URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });
    
    // Clean up - delete the test file
    try {
      await file.delete();
    } catch (deleteError) {
      console.log('Could not delete test file, but upload succeeded');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test upload successful!',
      bucket_name: bucketName,
      test_file: testFileName,
      test_url: url,
      client_email: process.env.CLIENT_EMAIL,
      project_id: process.env.PROJECT_ID,
      note: 'Your bucket is working correctly for uploads',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test upload failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Test upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      bucket_name: process.env.FIREBASE_STORAGE_BUCKET,
      client_email: process.env.CLIENT_EMAIL,
      project_id: process.env.PROJECT_ID,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}