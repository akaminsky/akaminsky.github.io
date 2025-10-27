# Pillar MVP - Home Repair Triage App

Pillar helps homeowners understand what kind of home repair they need before hiring anyone. This MVP includes AI-powered issue triage, friend sharing, and professional matching features.

## 🚀 Features

- **AI-Powered Triage**: Uses OpenAI GPT-3.5 to analyze home repair issues
- **Personalized Recommendations**: Based on handiness level and home details
- **Friend Sharing**: Get free advice from trusted contacts
- **Professional Matching**: Find the right type of contractor
- **Clean, Modern UI**: Notion-style design with Pillar's color palette

## 🛠️ Setup Instructions

### 1. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Configure the App

1. Open the app in your browser
2. Navigate to **Settings** in the top navigation
3. Paste your OpenAI API key in the "OpenAI API Key" field
4. Click **Save API Key**
5. Click **Test Connection** to verify it's working

### 3. Start Using Pillar

1. Go to **Get Help** to start a new triage
2. Fill out the form with your home repair issue
3. Get your AI-powered Scout Summary
4. Share with friends or find professionals

## 🎨 Design System

### Color Palette
- **Background**: #FAF8F5 (warm off-white)
- **Surface**: #F2F0EC (soft eggshell)
- **Text Primary**: #2C2C2C (dark gray)
- **Text Secondary**: #6E6E6E (muted gray)
- **Primary**: #F97316 (bright orange)
- **Primary Hover**: #EA580C (darker orange)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi Bold), 700 (Bold)

## 📱 Pages

### `/triage` - Get Help
- Comprehensive form for issue description
- Handiness level, home type, room/system, urgency
- Optional photo/video upload
- AI-powered analysis and Scout Summary

### `/share` - Share with Friends
- Reuses Scout Summary from triage
- Generates shareable link
- Friend response collection
- Local storage of responses

### `/pros` - Find Professionals
- Specialist recommendations
- Hiring checklist tailored to contractor type
- Pro signup for future matching service

### `/settings` - Configuration
- OpenAI API key management
- Data export/import
- App information

## 🔧 Technical Details

### API Integration
- **Model**: GPT-3.5-turbo
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 500
- **Fallback**: Mock responses when API unavailable

### Data Storage
- **Local Storage**: All data stored in browser
- **API Key**: Securely stored locally
- **Export**: JSON format for data portability

### Error Handling
- Graceful fallback to mock responses
- User-friendly error messages
- API key validation
- Connection testing

## 🚀 Deployment

### Local Development
1. Open `index.html` in your browser
2. Configure API key in Settings
3. Start using the app

### Production Deployment
1. Upload files to your web server
2. Ensure HTTPS for API calls
3. Consider backend storage for production use

## 🔒 Security Notes

- API keys are stored locally in browser
- No server-side storage in this MVP
- For production, implement proper backend security
- Consider rate limiting for API calls

## 📊 Usage Analytics

The app tracks:
- Triage submissions
- Friend responses
- Pro signups
- API usage (via OpenAI dashboard)

## 🛠️ Development

### File Structure
```
pillar/
├── index.html          # Main app structure
├── styles.css          # Complete styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

### Key Functions
- `PillarApp` class: Main application logic
- `callOpenAI()`: API integration
- `displayScoutSummary()`: Results rendering
- `setupSharePage()`: Friend sharing
- `setupProsPage()`: Professional matching

## 🎯 Future Enhancements

- [ ] Photo/video upload processing
- [ ] Backend storage for responses
- [ ] Real pro matching service
- [ ] Mobile app version
- [ ] Advanced AI models (GPT-4)
- [ ] Multi-language support
- [ ] Integration with contractor platforms

## 📞 Support

For issues or questions:
1. Check the Settings page for API status
2. Verify your OpenAI API key is valid
3. Check browser console for error messages
4. Ensure you have internet connectivity

## 🔄 Version History

- **v1.0.0 MVP**: Initial release with core features
  - AI-powered triage
  - Friend sharing
  - Professional matching
  - Settings management


