@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   TRADITIONAL TELUGU APP - PUSH TO DEVELOP (STAGING)
echo ========================================================
echo.

git checkout develop
git add .
git diff --cached --quiet
if %errorlevel% neq 0 (
    set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=update: progress on develop
    git commit -m "!COMMIT_MSG!"
) else (
    echo No uncommitted changes to commit.
)

echo Pushing to GitHub develop...
git push origin develop

echo.
echo ========================================================
echo   SUCCESS! Pushed to DEVELOP!
echo   GitHub Action is now auto-deploying to Hostinger Develop!
echo   Track deployment at: https://github.com/vamsi0804/pdf/actions
echo ========================================================
echo.
pause
