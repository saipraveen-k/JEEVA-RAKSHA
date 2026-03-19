@echo off
echo 🐾 JEEVA RAKSHA - Smart Animal Protection System
echo ================================================
echo.
echo 🚀 Starting application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running (basic check)
echo 🔍 Checking MongoDB connection...
mongosh --eval "db.adminCommand('ismaster')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB might not be running. Please start MongoDB first.
    echo If using MongoDB Atlas, update backend/.env with your connection string.
    echo.
    echo Continuing anyway...
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Seed database if needed
echo 🌱 Seeding database with demo data...
cd backend
node seed.js
cd ..

REM Start the application
echo.
echo 🎉 Starting JEEVA RAKSHA...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the application
echo.
npm run dev

pause
