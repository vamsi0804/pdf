@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   TRADITIONAL TELUGU APP - PUSH FROM DEVELOP TO PROD
echo ========================================================
echo.

:: 1. Ensure we are on develop branch
echo [1/5] Checking Git branch...
git checkout develop
if %errorlevel% neq 0 (
    echo [ERROR] Failed to switch to develop branch.
    pause
    exit /b %errorlevel%
)

:: 2. Stage and commit any pending changes on develop
echo [2/5] Staging pending changes on develop...
git add .
git diff --cached --quiet
if %errorlevel% neq 0 (
    set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=update: synchronize develop branch
    git commit -m "!COMMIT_MSG!"
) else (
    echo No uncommitted changes on develop.
)

:: 3. Push develop to GitHub (Hostinger Develop will auto-update)
echo [3/5] Pushing develop branch to GitHub...
git push origin develop
if %errorlevel% neq 0 (
    echo [WARNING] Could not push to remote origin develop. Check internet or remote configuration.
)

:: 4. Switch to prod and merge develop
echo [4/5] Switching to prod and merging develop...
git checkout prod
if %errorlevel% neq 0 (
    echo [ERROR] Failed to switch to prod branch.
    pause
    exit /b %errorlevel%
)

git merge develop -m "merge: release develop to production"
if %errorlevel% neq 0 (
    echo [ERROR] Merge conflict occurred. Please resolve conflicts manually.
    pause
    exit /b %errorlevel%
)

:: 5. Push prod to GitHub (Hostinger Production will auto-update)
echo [5/5] Pushing prod branch to GitHub...
git push origin prod
if %errorlevel% neq 0 (
    echo [WARNING] Could not push to remote origin prod.
)

:: Switch back to develop for active development
git checkout develop

echo.
echo ========================================================
echo   SUCCESS! Pushed from DEVELOP to PROD!
echo   Hostinger develop & prod domains will auto-deploy!
echo ========================================================
echo.
pause
