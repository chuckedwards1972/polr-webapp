@echo off
echo Deploying Enhanced POLR Dashboard v2.1...
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git first: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if we're in a git repository
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Initializing Git repository...
    git init
    git remote add origin https://github.com/chuckedwards1972/polr-webapp.git
)

REM Add files
echo Adding files to Git...
git add index.html
git add POLR-WIRED.html
git add POLR-WIRED-ENHANCED.html

REM Commit changes
echo Committing changes...
git commit -m "Deploy Enhanced POLR Dashboard v2.1 with React architecture

- Added POLR-WIRED-ENHANCED.html with React 18 architecture
- Advanced design tokens and professional animations  
- Events Builder with team assignments and recurring events
- Advanced Notifications with response tracking
- Opening Soon Poster Generator with QR codes and video integration
- AI-powered reminders and encouragement system
- Token resolver for dynamic content replacement
- Collapsible cards with persistence
- Enhanced state management with localStorage sync
- Mobile responsive design with modern UI components
- Level-based navigation (L0-L6 access levels)
- Real-time dashboard with statistics and quick actions

This enhanced version provides a complete ministry platform with
professional UI/UX matching the local development version."

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Enhanced POLR Dashboard deployed to GitHub!
    echo.
    echo 📱 Your enhanced dashboard is now available at:
    echo https://chuckedwards1972.github.io/polr-webapp/POLR-WIRED-ENHANCED.html
    echo.
    echo 🎯 Enhanced Features:
    echo   • React 18 architecture for better performance
    echo   • Professional animations and micro-interactions
    echo   • Events Builder with team management
    echo   • Advanced Notifications with response tracking
    echo   • Poster Generator with QR codes
    echo   • AI-powered reminders
    echo   • Token resolver for dynamic content
    echo   • Collapsible cards with persistence
    echo   • Mobile responsive design
    echo   • Level-based access control (L0-L6)
    echo.
    echo 📊 Demo credentials:
    echo   • Username: demo@polrnetwork.com
    echo   • Auto-login enabled for demo
    echo.
) else (
    echo.
    echo ❌ ERROR: Failed to push to GitHub
    echo Please check your Git credentials and try again.
    echo.
)

pause
