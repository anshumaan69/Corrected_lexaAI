# Corrected Environment Variables for Vercel

Based on your key.json file and actual bucket name, here are the CORRECT environment variables to set in Vercel:

## Variables to SET/UPDATE in Vercel Dashboard:

1. **CLIENT_EMAIL** = `function-runner-sa@lexbharat.iam.gserviceaccount.com`

2. **PRIVATE_KEY** = The private key from key.json (starts with -----BEGIN PRIVATE KEY-----)

3. **PROJECT_ID** = `lexbharat` ✓ (this is correct)

4. **FIREBASE_STORAGE_BUCKET** = `genai-3301` ← **THIS WAS THE ISSUE!**

## CRITICAL FIX:

The bucket name should be `genai-3301`, NOT `lexbharat.appspot.com`!

Your actual bucket is: gs://genai-3301/uploads/

## Steps to Fix:

1. In Vercel Dashboard, update FIREBASE_STORAGE_BUCKET to: `genai-3301`
2. Deploy and test upload again
3. Should work immediately!