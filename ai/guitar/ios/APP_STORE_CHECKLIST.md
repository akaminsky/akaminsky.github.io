# App Store Submission Checklist for Fret Not

This checklist covers everything you need to do before submitting your app to the App Store.

## ✅ Already Done

- ✅ App name set to "Fret Not"
- ✅ Bundle identifier configured (`com.akaminsky.neverfret`)
- ✅ Development team set (`US3KMK749L`)
- ✅ Microphone permission description added
- ✅ iCloud entitlements configured
- ✅ App icon configured (1024x1024)
- ✅ Version number set (1.0.0)
- ✅ Build number set (1)
- ✅ Category set (Music)

## 📋 Required Before Submission

### 1. Code Signing & Distribution

- [ ] **Change Code Sign Identity for Release:**
  - In Xcode: Project Settings → Signing & Capabilities
  - Release configuration should use "Apple Distribution" (not "Apple Development")
  - You'll need to create a Distribution certificate in App Store Connect if you haven't

- [ ] **Create App Store Connect Record:**
  - Go to [App Store Connect](https://appstoreconnect.apple.com)
  - Click "My Apps" → "+" → "New App"
  - Fill in:
    - **Platform**: iOS
    - **Name**: Fret Not
    - **Primary Language**: English
    - **Bundle ID**: `com.akaminsky.neverfret` (must match exactly)
    - **SKU**: `fretnot` (unique identifier, can be anything)
    - **User Access**: Full Access (or select users)

### 2. App Icon

- [ ] **Verify App Icon:**
  - App icon should be exactly 1024x1024 pixels
  - No transparency, rounded corners, or shadows (Apple adds these)
  - Current file: `neverfreticon.png` - verify it's 1024x1024
  - Icon should represent the app clearly

### 3. App Store Listing Information

- [ ] **App Description** (up to 4,000 characters):
  - Write a compelling description of your app
  - Include key features
  - Explain what makes it unique

- [ ] **Keywords** (up to 100 characters):
  - e.g., "guitar,chords,tuner,songbook,music,spotify"
  - Separate with commas, no spaces

- [ ] **Screenshots Required:**
  - iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max): 1-10 screenshots
  - iPhone 6.5" (iPhone 11 Pro Max, XS Max): 1-10 screenshots
  - iPhone 5.5" (iPhone 8 Plus): 1-10 screenshots (optional)
  - iPad Pro 12.9" (if supporting iPad): 1-10 screenshots (optional)
  - Minimum 1 screenshot required, recommended: 3-5 per device size

- [ ] **App Preview Video** (optional):
  - Up to 30 seconds
  - Shows app in action
  - Can increase conversion rates

- [ ] **Promotional Text** (optional, up to 170 characters):
  - Can be updated without new submission
  - Shown above description

- [ ] **Support URL:**
  - Required: Create a support page (can be `http://fretnot.app/support`)
  - Or use a contact form

- [ ] **Marketing URL** (optional):
  - Your website: `http://fretnot.app`

- [ ] **App Age Rating:**
  - Complete the questionnaire in App Store Connect
  - Based on content, likely: 4+ (All Ages)

### 4. Privacy Information

- [ ] **Privacy Policy URL:**
  - Required if your app:
    - Collects user data
    - Uses third-party analytics
    - Accesses user content
  - You'll need to create one at: `http://fretnot.app/privacy`
  - Required because:
    - App uses iCloud (data sync)
    - App may access Spotify data
    - App stores user songs locally

- [ ] **Privacy Nutrition Labels in App Store Connect:**
  - Declare what data you collect:
    - **Data Collected**: 
      - App Functionality: User Content (songs, chords, notes)
      - App Functionality: Identifiers (if using any analytics)
    - **Data Linked to User**: User Content (songs stored in iCloud)
    - **Data Used to Track You**: None (unless you add analytics)
    - **Purpose**: App Functionality

### 5. Required Privacy Permissions

Your app currently requests:
- ✅ **Microphone** - Has usage description ✅

Check these are properly declared in App Store Connect under "App Privacy"

### 6. Build & Archive

- [ ] **Archive the App:**
  - In Xcode: Product → Destination → "Any iOS Device"
  - Product → Archive
  - Wait for build to complete

- [ ] **Validate the Archive:**
  - In Organizer window (opens after archive)
  - Click "Validate App"
  - Fix any issues it finds

- [ ] **Upload to App Store Connect:**
  - In Organizer → Distribute App
  - Choose "App Store Connect"
  - Follow the wizard
  - Can take 10-30 minutes to process

### 7. Version & Build Numbers

- [ ] **Update Build Number:**
  - Each submission needs a unique build number
  - Current: 1
  - For future updates: 2, 3, 4, etc.
  - In Xcode: Target → General → Build
  - Or in `project.pbxproj`: `CURRENT_PROJECT_VERSION`

### 8. Testing

- [ ] **Test on Real Devices:**
  - Test on multiple iPhone models
  - Test on iPad if supporting it
  - Test all major features:
    - Adding/editing/deleting songs
    - Chord diagrams
    - Tuner functionality
    - Spotify search
    - Playlist import
    - iCloud sync
    - Settings

- [ ] **TestFlight Beta Testing** (Recommended):
  - Upload a build to TestFlight
  - Test internally first
  - Then invite external testers
  - Get feedback before public release

### 9. App Review Information

In App Store Connect, fill in:
- [ ] **Contact Information:**
  - First Name
  - Last Name
  - Phone Number
  - Email Address

- [ ] **Demo Account** (if needed):
  - Do reviewers need an account? (Probably not for your app)
  - Spotify access? (No, it's optional)

- [ ] **Notes:**
  - Any special instructions for reviewers
  - Explain any non-obvious features

### 10. Additional Considerations

- [ ] **Spotify API:**
  - Make sure Netlify backend is deployed and working
  - Document Spotify integration in App Review notes if needed
  - App works without Spotify (uses demo data), so this shouldn't block review

- [ ] **iCloud Sync:**
  - Test cross-device sync
  - Make sure it works properly

- [ ] **Export Compliance:**
  - Most apps: "No encryption"
  - Unless using HTTPS only (which you are, but that's exempt)
  - Answer: "No" to encryption questions

### 11. Code Changes Needed

#### Release Build Configuration:

- [ ] **Update Release Code Signing:**
  ```
  In project.pbxproj or Xcode UI:
  Release → Signing → Code Sign Identity: "Apple Distribution"
  ```

- [ ] **Add App Store Categories** (if not already):
  - Primary: Music
  - Secondary (optional): Education, Entertainment

#### Optional Improvements:

- [ ] **Add Launch Screen:**
  - Create a nice launch screen
  - Or use the auto-generated one (already configured)

- [ ] **Error Handling:**
  - Make sure all errors are handled gracefully
  - User-friendly error messages

### 12. Legal Requirements

- [ ] **Terms of Service** (Optional but recommended):
  - Create at `http://fretnot.app/terms`

- [ ] **Privacy Policy** (Required):
  - Create at `http://fretnot.app/privacy`
  - Include:
    - What data you collect
    - How you use it
    - iCloud sync explanation
    - Third-party services (Spotify, Netlify)
    - User rights (data deletion, etc.)

## 📝 Quick Reference

### Current Configuration:
- **Bundle ID**: `com.akaminsky.neverfret`
- **Version**: 1.0.0
- **Build**: 1
- **Display Name**: Fret Not
- **Team**: US3KMK749L
- **Category**: Music

### Important URLs to Create:
- Privacy Policy: `http://fretnot.app/privacy`
- Support: `http://fretnot.app/support` (or contact form)
- Terms: `http://fretnot.app/terms` (optional)

### Timeline Estimate:
- First-time submission: 2-7 days for review
- Typical review time: 24-48 hours (can be faster or slower)
- Plan for 1-2 weeks total (including fixes if rejected)

## 🚨 Common Rejection Reasons to Avoid

1. **Missing Privacy Policy** - Must have if collecting any data
2. **Broken Functionality** - Test everything thoroughly
3. **Misleading Screenshots** - Must accurately represent app
4. **Incomplete Metadata** - Fill in all required fields
5. **Placeholder Content** - Remove any "lorem ipsum" or test content
6. **Crashes** - Test on real devices, fix any crashes

## 📚 Helpful Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

## Next Steps

1. Create privacy policy and support pages
2. Take screenshots on different device sizes
3. Archive and validate the app
4. Upload to App Store Connect
5. Fill in all App Store listing information
6. Submit for review

Good luck! 🎸

