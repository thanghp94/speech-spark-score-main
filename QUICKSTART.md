# 🚀 Quick Start Guide

## 1. Install Dependencies

### Option A: Use Setup Scripts
**Linux/Mac:**
```bash
./setup.sh
```

**Windows:**
```batch
setup.bat
```

### Option B: Manual Installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## 2. Configure Azure Speech Service

1. **Create Azure Speech Resource:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create new resource → AI + Machine Learning → Speech
   - Choose F0 (Free) tier for testing
   - Note your **Key** and **Region**

2. **Configure Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your Azure credentials
   ```

   Your `.env` should look like:
   ```env
   AZURE_SUBSCRIPTION_KEY=your_actual_key_here
   AZURE_SERVICE_REGION=eastus
   PORT=3001
   NODE_ENV=development
   ```

## 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 4. Test the Application

1. Open http://localhost:5173
2. Allow microphone access
3. Click the microphone button
4. Say: "The quick brown fox jumps over the lazy dog"
5. View your pronunciation results!

## 🎯 URLs

- **Frontend:** http://localhost:5173
- **Kids Interface:** http://localhost:5173/practice
- **Backend Health:** http://localhost:3001/api/health
- **API Endpoint:** http://localhost:3001/api/evaluate

## 🔧 Troubleshooting

- **No microphone access:** Use HTTPS or localhost
- **Azure errors:** Check your .env configuration
- **CORS errors:** Ensure backend is running on port 3001

---

**Need help?** Check the full [README.md](README.md) for detailed instructions.
