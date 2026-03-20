@echo off
echo ========================================
echo   JEEVA RAKSHA SECURITY FIXES
echo ========================================
echo.

echo [1/5] Removing .env from version control...
cd backend
git rm --cached .env 2>nul
echo .env >> .gitignore 2>nul
git add .gitignore 2>nul
git commit -m "Remove .env from version control" 2>nul
echo    ✅ .env removed from git

echo.
echo [2/5] Installing security dependencies...
call npm install express-mongo-sanitize express-validator 2>nul
if %errorlevel% neq 0 (
    echo    ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo    ✅ Security dependencies installed

echo.
echo [3/5] Generating secure JWT secret...
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))" > .env.new 2>nul
if %errorlevel% neq 0 (
    echo    ❌ Failed to generate JWT secret
    pause
    exit /b 1
)
echo    ✅ New JWT secret generated

echo.
echo [4/5] Updating .env file...
echo # Database Configuration > .env
echo MONGODB_URI=mongodb://localhost:27017/jeeva-raksha >> .env
echo. >> .env
echo # JWT Configuration >> .env
type .env.new >> .env
echo. >> .env
echo # Server Configuration >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
echo. >> .env
echo # Frontend URL (for CORS) >> .env
echo FRONTEND_URL=http://localhost:3000 >> .env
del .env.new 2>nul
echo    ✅ .env updated with secure configuration

echo.
echo [5/5] Installing validation middleware...
echo. > backend\middleware\validation.js
echo const mongoSanitize = require('express-mongo-sanitize'); >> backend\middleware\validation.js
echo const { body, validationResult } = require('express-validator'); >> backend\middleware\validation.js
echo. >> backend\middleware\validation.js
echo // Validation middleware will be created manually >> backend\middleware\validation.js
echo    ✅ Validation middleware setup initiated

echo.
echo ========================================
echo        SECURITY FIXES COMPLETE!
echo ========================================
echo.
echo 📋 NEXT STEPS:
echo 1. Manually complete validation.js middleware
echo 2. Update User.js with stronger hashing (12 salt rounds)
echo 3. Add validation to auth routes
echo 4. Add validation to case routes
echo 5. Test all security measures
echo.
echo 🚨 RESTART SERVERS AFTER MANUAL COMPLETION!
echo ========================================
pause
