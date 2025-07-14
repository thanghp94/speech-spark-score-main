# Speech Evaluation App with Azure AI Speech Service

A complete speech evaluation application that allows users to record themselves speaking English sentences and receive detailed pronunciation feedback using Microsoft Azure AI Speech service.

## 🌟 Features

- **Real-time Audio Recording**: Browser-based audio capture with visual feedback
- **Azure AI Integration**: Professional pronunciation assessment using Microsoft's Speech SDK
- **Detailed Feedback**: Word-by-word analysis with accuracy, fluency, completeness, and prosody scores
- **Kid-Friendly Interface**: Gamified experience with achievements and mascot guidance
- **Adult Interface**: Professional speech evaluation interface
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
speech-spark-score-main/
├── src/                          # Frontend React/TypeScript code
│   ├── components/
│   │   ├── SpeechEvaluator.tsx   # Adult-focused interface
│   │   ├── KidsSpeechEvaluator.tsx # Kid-friendly interface
│   │   └── ui/                   # Reusable UI components
│   └── pages/                    # Application pages
├── backend/                      # Node.js/Express backend
│   ├── server.js                 # Main server file
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Environment variables template
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Azure subscription with Speech Service resource
- Modern web browser with microphone access

### 1. Set up Azure Speech Service

1. Go to the [Azure Portal](https://portal.azure.com)
2. Create a new resource → AI + Machine Learning → Speech
3. Fill in the required information:
   - **Subscription**: Your Azure subscription
   - **Resource group**: Create new or use existing
   - **Region**: Choose a region close to you (e.g., East US, West Europe)
   - **Name**: Give your resource a unique name
   - **Pricing tier**: F0 (Free) for testing, S0 for production
4. Click "Review + create" then "Create"
5. Once deployed, go to your Speech resource
6. Navigate to "Keys and Endpoint" in the left sidebar
7. Copy **Key 1** and **Location/Region** - you'll need these for the backend

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   AZURE_SUBSCRIPTION_KEY=your_azure_speech_key_here
   AZURE_SERVICE_REGION=your_azure_region_here
   PORT=3001
   NODE_ENV=development
   ```
   
   Replace:
   - `your_azure_speech_key_here` with Key 1 from Azure
   - `your_azure_region_here` with your region (e.g., `eastus`, `westeurope`)

5. **Start the backend server**:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Speech Evaluation Backend running on port 3001
   📊 Health check: http://localhost:3001/api/health
   🎤 Evaluation endpoint: http://localhost:3001/api/evaluate
   ✅ Azure Speech Service configuration validated
   ```

### 3. Frontend Setup

1. **Navigate back to project root**:
   ```bash
   cd ..
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## 🎯 Usage

### Adult Interface
1. Navigate to the main page
2. Read the displayed sentence
3. Click the microphone button to start recording
4. Speak the sentence clearly
5. Click stop when finished
6. View your detailed pronunciation analysis

### Kid-Friendly Interface
1. Navigate to `/practice` page
2. Meet your friendly mascot guide
3. Read the colorful sentence
4. Press the magical microphone
5. Speak clearly and have fun!
6. Earn stars and achievements based on your performance

## 🔧 API Endpoints

### Backend API

- **GET** `/api/health` - Health check endpoint
- **POST** `/api/evaluate` - Main pronunciation evaluation endpoint

#### Evaluation Request
```javascript
// FormData with:
{
  audio: File,           // Audio file (WebM/WAV format)
  referenceText: string  // Text that was spoken
}
```

#### Evaluation Response
```javascript
{
  success: true,
  result: {
    recognizedText: string,
    accuracyScore: number,      // 0-100
    fluencyScore: number,       // 0-100
    completenessScore: number,  // 0-100
    prosodyScore: number,       // 0-100
    words: [
      {
        word: string,
        accuracyScore: number,
        errorType: string | null
      }
    ]
  },
  metadata: {
    audioSize: number,
    audioType: string,
    referenceText: string,
    timestamp: string
  }
}
```

## 🛠️ Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev          # Start with auto-restart
npm start            # Start production server
```

### Environment Variables

#### Backend (.env)
```env
# Required
AZURE_SUBSCRIPTION_KEY=your_azure_speech_key
AZURE_SERVICE_REGION=your_azure_region

# Optional
PORT=3001
NODE_ENV=development
```

## 🔍 Troubleshooting

### Common Issues

1. **"Azure Speech Service configuration missing"**
   - Check your `.env` file in the backend directory
   - Ensure `AZURE_SUBSCRIPTION_KEY` and `AZURE_SERVICE_REGION` are set correctly
   - Verify your Azure Speech Service resource is active

2. **"Could not access microphone"**
   - Ensure you're using HTTPS or localhost
   - Check browser permissions for microphone access
   - Try refreshing the page and allowing microphone access

3. **"No speech could be recognized"**
   - Speak more clearly and loudly
   - Check your microphone is working
   - Ensure there's minimal background noise
   - Try a shorter, simpler sentence

4. **CORS errors**
   - Ensure backend is running on port 3001
   - Check that frontend is making requests to the correct backend URL
   - Verify CORS configuration in server.js

5. **Audio format issues**
   - The app records in WebM format by default
   - Azure Speech SDK expects WAV format (conversion handled automatically)
   - If issues persist, try using a different browser

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your backend `.env` file.

## 📱 Browser Compatibility

- **Chrome**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **Edge**: Full support ✅

**Note**: Microphone access requires HTTPS in production or localhost in development.

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure Node.js 18+ is available
3. Run `npm install` and `npm start`
4. Configure CORS origins for your frontend domain

### Frontend Deployment
1. Update API endpoint URLs in components if needed
2. Run `npm run build`
3. Deploy the `dist` folder to your hosting platform
4. Ensure HTTPS is enabled for microphone access

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your Azure Speech Service setup
3. Check browser console for error messages
4. Ensure all dependencies are installed correctly

---

**Happy Speech Practicing! 🎤✨**
