#!/bin/bash

echo "🚀 Setting up Speech Evaluation App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env with your Azure credentials:"
    echo "   - AZURE_SUBSCRIPTION_KEY=your_azure_speech_key"
    echo "   - AZURE_SERVICE_REGION=your_azure_region"
    echo ""
else
    echo "✅ .env file already exists"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your Azure Speech Service credentials in backend/.env"
echo "2. Start the backend: cd backend && npm start"
echo "3. Start the frontend: npm run dev"
echo ""
echo "📖 See README.md for detailed setup instructions"
