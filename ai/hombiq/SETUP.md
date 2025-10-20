# Hombiq Setup Instructions

## 🔐 API Key Setup

### Option 1: Environment Variables (Recommended)

1. Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=your_actual_api_key_here
```

2. The `.env` file is already in `.gitignore` so it won't be committed.

### Option 2: Direct Configuration

1. Open `script.js`
2. Replace `'your-api-key-here'` with your actual OpenAI API key
3. **Important**: Never commit this change to GitHub!

## 🚀 Deployment

### For GitHub Pages:
- The app works as a static site
- No server-side processing needed
- API calls are made directly from the browser

### For Production:
- Consider using a backend service to hide API keys
- Use environment variables in your hosting platform
- Implement rate limiting and security measures

## ⚠️ Security Notes

- Never commit API keys to version control
- Use environment variables in production
- Consider implementing API key rotation
- Monitor usage to prevent abuse