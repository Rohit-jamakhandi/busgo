@echo off
echo ========================================
echo Pushing Bus-Go to GitHub
echo ========================================
echo.

echo Step 1: Adding all files...
git add .

echo Step 2: Committing changes...
git commit -m "Add Vercel deployment configuration and complete setup"

echo Step 3: Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo If push failed, try force push:
echo git push origin master --force
echo ========================================
pause
