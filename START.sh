#!/bin/bash

echo "🐾 JEEVA RAKSHA - Smart Animal Protection System"
echo "================================================"
echo ""
echo "🚀 Starting application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is running (basic check)
echo "🔍 Checking MongoDB connection..."
if ! mongosh --eval "db.adminCommand('ismaster')" &> /dev/null; then
    echo "⚠️  MongoDB might not be running. Please start MongoDB first."
    echo "If using MongoDB Atlas, update backend/.env with your connection string."
    echo ""
    echo "Continuing anyway..."
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Seed database if needed
echo "🌱 Seeding database with demo data..."
cd backend
node seed.js
cd ..

# Start the application
echo ""
echo "🎉 Starting JEEVA RAKSHA..."
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""
npm run dev
