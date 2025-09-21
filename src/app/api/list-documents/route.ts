import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching all documents from Firestore...');
    
    const admin = getFirebaseAdmin();
    const db = admin.firestore();
    
    // Get all documents from the collection
    const snapshot = await db.collection('document_analysis').get();
    
    if (snapshot.empty) {
      console.log('No documents found in collection');
      return NextResponse.json({ 
        message: 'No documents found',
        documents: []
      }, { status: 200 });
    }

    const documents: any[] = [];
    snapshot.forEach((doc: any) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to readable format
        processed_timestamp: doc.data().processed_timestamp?.toDate?.()?.toISOString() || doc.data().processed_timestamp,
        web_search_timestamp: doc.data().web_search_timestamp?.toDate?.()?.toISOString() || doc.data().web_search_timestamp,
        analysis_timestamp: doc.data().analysis_timestamp?.toDate?.()?.toISOString() || doc.data().analysis_timestamp,
      });
    });

    console.log(`Found ${documents.length} documents`);
    
    return NextResponse.json({ 
      message: `Found ${documents.length} documents`,
      count: documents.length,
      documents 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}