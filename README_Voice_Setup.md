# 🎵 E-Voting System - Voice Narration Setup

This guide helps you generate bilingual voice narration MP3 files for the React E-Voting application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Google Cloud Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Text-to-Speech API**

#### Step 2: Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `evoting-tts-service`
4. Role: **Cloud Text-to-Speech User**
5. Download the JSON key file
6. Rename it to `service-account.json` and place in project root

### 3. Generate Voice Files
```bash
python generate_voice_narration.py
```

## 📁 Output Structure
```
Client/public/audio/
├── step1_landing.mp3     # Welcome message
├── step2_camera.mp3      # Camera instruction
├── step3_confirm.mp3     # Identity confirmation
├── step4_vote.mp3        # Voting instruction
├── step5_verify.mp3      # Identity verification
└── step6_thankyou.mp3    # Thank you message
```

## 🎯 Voice Configuration

### Primary Voice: `hi-IN-Wavenet-C`
- **Language**: Hindi (India)
- **Gender**: Female
- **Type**: Wavenet (Premium)

### Fallback Voice: `en-US-Wavenet-F`
- **Language**: English (US)
- **Gender**: Female
- **Type**: Wavenet (Premium)

## 📝 Generated Files

| File | Content |
|------|---------|
| `step1_landing.mp3` | Welcome message for landing page |
| `step2_camera.mp3` | Camera positioning instruction |
| `step3_confirm.mp3` | Identity confirmation prompt |
| `step4_vote.mp3` | Voting process guidance |
| `step5_verify.mp3` | Identity verification request |
| `step6_thankyou.mp3` | Vote confirmation and thanks |

## 🔧 Integration in React

Add to your React components:

```javascript
// Play voice narration
const playVoiceGuide = (step) => {
  const audio = new Audio(`/audio/step${step}_${page}.mp3`);
  audio.play().catch(console.error);
};

// Usage examples
playVoiceGuide('1', 'landing');     // Landing page
playVoiceGuide('2', 'camera');      // Camera page
playVoiceGuide('4', 'vote');        // Voting page
```

## 🛠️ Troubleshooting

### Authentication Issues
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
```

### Permission Errors
- Ensure service account has **Text-to-Speech User** role
- Check if Text-to-Speech API is enabled
- Verify billing is set up for Google Cloud project

### Voice Quality Issues
- Script automatically falls back to English voice if Hindi fails
- Adjust `speaking_rate` in script if needed (0.7-1.3 range)
- For better Hindi pronunciation, use SSML tags

## 📊 Cost Estimation

Google Cloud Text-to-Speech pricing (as of 2024):
- **Wavenet voices**: $16.00 per 1M characters
- **Standard voices**: $4.00 per 1M characters

Estimated cost for 6 files (~2000 characters): **~$0.03**

## 🇮🇳 Language Support

The generated files support:
- **Hindi (हिंदी)**: Native Devanagari script
- **English**: Roman script
- **Mixed content**: Bilingual narration
- **Indian pronunciation**: Proper Indian English accent

## 🎤 Audio Specifications

- **Format**: MP3
- **Quality**: High (Wavenet)
- **Speaking Rate**: 0.9 (slightly slower for clarity)
- **Pitch**: Neutral (0.0)
- **Volume**: Standard

## 📞 Support

For issues with this voice generation system:
1. Check Google Cloud console for API quotas
2. Verify service account permissions
3. Test with a simple English-only text first
4. Check the generated log files for detailed error messages 