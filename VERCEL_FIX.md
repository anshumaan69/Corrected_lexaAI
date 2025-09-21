# Corrected Environment Variables for Vercel

Based on your key.json file, here are the CORRECT environment variables to set in Vercel:

## Variables to UPDATE in Vercel Dashboard:

1. **CLIENT_EMAIL** = `function-runner-sa@lexbharat.iam.gserviceaccount.com`
   (NOT firebase-adminsdk-q5w7v@lexbharat.iam.gserviceaccount.com)

2. **PRIVATE_KEY** = The private key from key.json (starts with -----BEGIN PRIVATE KEY-----)

3. **PROJECT_ID** = `lexbharat` ✓ (this is correct)

4. **FIREBASE_STORAGE_BUCKET** = We need to find the correct bucket name by checking what buckets exist

## Steps to Fix:

1. Update CLIENT_EMAIL in Vercel to: function-runner-sa@lexbharat.iam.gserviceaccount.com
2. Deploy the /api/list-buckets endpoint 
3. Call /api/list-buckets to see what buckets actually exist
4. Update FIREBASE_STORAGE_BUCKET with the correct bucket name
5. Test upload again

The issue is that you're using different service account credentials in Vercel vs your local key.json file.