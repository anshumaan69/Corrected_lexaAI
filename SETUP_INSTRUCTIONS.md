# VERCEL SETUP INSTRUCTIONS (JSON Method)

## EASIEST METHOD: Use Complete Service Account JSON

Instead of individual environment variables, use your entire key.json as one variable.

### Step 1: In Vercel Dashboard
Go to Environment Variables and add:

1. **GOOGLE_SERVICE_ACCOUNT_KEY** = [Copy your entire key.json file content]
2. **FIREBASE_STORAGE_BUCKET** = genai-3301

### Step 2: Format the JSON correctly
- Copy the ENTIRE content of your key.json file
- Make sure it's valid JSON (starts with { and ends with })
- No line breaks or extra spaces

### Step 3: Test
After saving, test these endpoints:
- /api/debug (should show GOOGLE_SERVICE_ACCOUNT_KEY available)
- /api/test-upload (should work now)

This method avoids all private key formatting issues!