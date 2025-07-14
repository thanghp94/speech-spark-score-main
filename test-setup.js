#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

async function testSetup() {
  log('blue', '🧪 Testing Speech Evaluation App Setup...\n');

  // Test 1: Check if backend dependencies are installed
  log('blue', '1. Checking backend dependencies...');
  try {
    const packagePath = path.join('backend', 'node_modules');
    if (fs.existsSync(packagePath)) {
      log('green', '✅ Backend dependencies installed');
    } else {
      log('red', '❌ Backend dependencies not found');
      log('yellow', '   Run: cd backend && npm install');
    }
  } catch (error) {
    log('red', '❌ Error checking backend dependencies');
  }

  // Test 2: Check if .env file exists
  log('blue', '\n2. Checking environment configuration...');
  const envPath = path.join('backend', '.env');
  if (fs.existsSync(envPath)) {
    log('green', '✅ .env file found');
    
    // Check if Azure keys are configured
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('your_azure_speech_key') || envContent.includes('your_azure_region')) {
      log('yellow', '⚠️  Azure credentials need to be configured in backend/.env');
    } else {
      log('green', '✅ Azure credentials appear to be configured');
    }
  } else {
    log('red', '❌ .env file not found');
    log('yellow', '   Run: cd backend && cp .env.example .env');
  }

  // Test 3: Check if backend server is running
  log('blue', '\n3. Testing backend server...');
  try {
    const response = await fetch('http://localhost:3001/api/health', {
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      log('green', '✅ Backend server is running');
      log('green', `   Status: ${data.status}`);
    } else {
      log('red', '❌ Backend server responded with error');
    }
  } catch (error) {
    log('red', '❌ Backend server is not running');
    log('yellow', '   Start with: cd backend && npm start');
  }

  // Test 4: Check frontend dependencies
  log('blue', '\n4. Checking frontend dependencies...');
  try {
    if (fs.existsSync('node_modules')) {
      log('green', '✅ Frontend dependencies installed');
    } else {
      log('red', '❌ Frontend dependencies not found');
      log('yellow', '   Run: npm install');
    }
  } catch (error) {
    log('red', '❌ Error checking frontend dependencies');
  }

  // Test 5: Check key files
  log('blue', '\n5. Checking project files...');
  const keyFiles = [
    'src/components/SpeechEvaluator.tsx',
    'src/components/KidsSpeechEvaluator.tsx',
    'backend/server.js',
    'backend/package.json'
  ];

  keyFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log('green', `✅ ${file}`);
    } else {
      log('red', `❌ ${file} missing`);
    }
  });

  log('blue', '\n🎉 Setup test complete!');
  log('blue', '\nNext steps:');
  log('yellow', '1. Configure Azure credentials in backend/.env');
  log('yellow', '2. Start backend: cd backend && npm start');
  log('yellow', '3. Start frontend: npm run dev');
  log('yellow', '4. Open http://localhost:5173');
}

// Handle the case where node-fetch might not be available
try {
  testSetup().catch(error => {
    console.error('Test failed:', error.message);
    process.exit(1);
  });
} catch (error) {
  console.log('Note: This test requires node-fetch. Running basic file checks...\n');
  
  // Basic file existence checks without network calls
  const files = [
    'backend/package.json',
    'backend/server.js',
    'src/components/SpeechEvaluator.tsx',
    'README.md'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
  
  console.log('\n🎯 Basic file check complete!');
}
