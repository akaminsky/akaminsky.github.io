# 🚀 Netlify Deployment Guide for Hombiq

## ✅ Setup Complete!

Your Hombiq app is now configured to use Netlify Functions, which keeps your API key secure!

## 📋 **What Was Set Up:**

1. ✅ `netlify.toml` - Netlify configuration
2. ✅ `/netlify/functions/openai.js` - Serverless function to proxy OpenAI API
3. ✅ Updated frontend code to use Netlify function in production
4. ✅ Local development still works with direct API calls

## 🔐 **How to Deploy:**

### **Step 1: Push to GitHub**
Your code is now safe to push - no API keys are exposed!

```bash
git add .
git commit -m "Add Netlify Functions for secure API key handling"
git push
```

### **Step 2: Connect to Netlify**

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and select your `akaminsky.github.io` repository
4. **Important:** Set the base directory to `ai/hombiq`
5. Click "Deploy site"

### **Step 3: Add Environment Variable**

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Add:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `your-actual-openai-api-key-here`
4. Click "Save"
5. Trigger a new deploy (Site settings → Deploys → Trigger deploy)

### **Step 4: Done!**

Your Hombiq app will now be live at `your-site-name.netlify.app` with:
- ✅ Secure API key handling
- ✅ Working AI chat
- ✅ No exposed secrets

## 🧪 **Local Development:**

For local testing, add your API key to line 28 of `script.js`:

```javascript
this.openaiApiKey = 'your-key-here'; // ONLY for local testing
```

**Remember to remove it before committing!** Or keep it as `''` and test on Netlify instead.

## 🔄 **How It Works:**

### Production (Netlify):
```
User → Frontend → Netlify Function → OpenAI API
                   (has API key)
```

### Local Development:
```
User → Frontend → OpenAI API directly
      (uses key in script.js)
```

## 💡 **Tips:**

- The app automatically detects if you're on localhost or production
- In production, it uses `/.netlify/functions/openai`
- Locally, it uses OpenAI API directly (needs key in code)
- Your API key is NEVER exposed in production!

## 🆘 **Troubleshooting:**

**Issue:** "OpenAI API key not configured" error on Netlify
- **Fix:** Make sure you added the environment variable in Netlify dashboard

**Issue:** Not working locally
- **Fix:** Add your API key to line 28 of `script.js` for local testing

**Issue:** Netlify function not found
- **Fix:** Make sure base directory is set to `ai/hombiq` in Netlify settings

---

Need help? The setup is already done - just follow the 4 steps above! 🎉

