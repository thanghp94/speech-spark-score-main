@echo off
echo 🚀 Setting up Speech Evaluation App...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ Created .env file
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env with your Azure credentials:
    echo    - AZURE_SUBSCRIPTION_KEY=your_azure_speech_key
    echo    - AZURE_SERVICE_REGION=your_azure_region
    echo.
) else (
    echo ✅ .env file already exists
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Configure your Azure Speech Service credentials in backend\.env
echo 2. Start the backend: cd backend ^&^& npm start
echo 3. Start the frontend: npm run dev
echo.
echo 📖 See README.md for detailed setup instructions
echo.
pause
