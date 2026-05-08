# Netlify Setup Guide for NeuroPath AI

## ✅ What I've Done

I've migrated your project from Firebase Cloud Functions to **Netlify Functions** (free tier). Here's what's been set up:

### Files Created/Modified:
1. **netlify/functions/generateLearningPath.js** - Serverless function for learning paths
2. **netlify/functions/generateQuiz.js** - Serverless function for quiz generation
3. **netlify.toml** - Netlify configuration
4. **.env.example** - Environment variables template
5. **src/ai.js** - Updated to call Netlify functions (no more exposed API key!)

---

## 🚀 Deployment Steps

### 1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

### 2. **Create a .env.local file**
```bash
# Copy the .env.example and rename to .env.local
cp .env.example .env.local

# Add your OpenRouter API key:
OPENROUTER_API_KEY=your_api_key_here
```

### 3. **Connect to Netlify**
```bash
# Login to Netlify
netlify login

# Initialize your site
netlify init
```

When prompted:
- Choose "Create & configure a new site"
- Pick a site name (e.g., neuropath-ai)
- Authorize the connection

### 4. **Deploy**
```bash
# Deploy your site with functions
netlify deploy --prod
```

---

## 🔑 Important: Environment Variables

**On Netlify Dashboard:**
1. Go to your site → **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add: `OPENROUTER_API_KEY` = `your_api_key_here`
4. Redeploy

---

## ✨ Benefits of This Setup

✅ **Free** - Netlify free tier supports 125,000 function invocations/month  
✅ **Secure** - API key hidden from browser code  
✅ **Simple** - Almost identical to your old Firebase setup  
✅ **Scalable** - Auto-scales without premium plan  
✅ **Easy Dev** - Run locally with `netlify dev`

---

## 🔧 Local Development

```bash
# Start dev server with Netlify functions
netlify dev

# This runs on http://localhost:8888
```

---

## 📝 Verification Checklist

- [ ] Install Netlify CLI
- [ ] Create .env.local with API key
- [ ] Run `netlify init`
- [ ] Deploy with `netlify deploy --prod`
- [ ] Set environment variables in Netlify dashboard
- [ ] Test learning path generation
- [ ] Test quiz generation

---

## ❌ Remove Firebase Functions (Optional)

If you want to clean up:
```bash
rm -r functions
rm firebase.json
```

Note: Keep `.firebaserc` if you plan to use Firebase for other services (Auth, Firestore).

---

## 📞 Troubleshooting

**Functions not working?**
- Check that API key is set in Netlify dashboard
- Verify netlify.toml exists at project root
- Check function logs: `netlify functions:list`

**CORS issues?**
- Netlify handles CORS automatically for functions

**Functions 404?**
- Make sure `netlify.toml` has correct `functions` path: `netlify/functions`

---

Happy coding! 🎉
