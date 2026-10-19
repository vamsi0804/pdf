@echo off
setlocal
echo ========================================================
echo  Hostinger Direct FTP Deployment Utility
echo ========================================================
echo.
echo Choose target environment:
echo  [1] Deploy to DEVELOP (Staging)
echo  [2] Deploy to PRODUCTION (Live)
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    powershell -ExecutionPolicy Bypass -File "%~dp0tools\deploy_ftp.ps1" -TargetEnv develop
) else if "%choice%"=="2" (
    powershell -ExecutionPolicy Bypass -File "%~dp0tools\deploy_ftp.ps1" -TargetEnv prod
) else (
    echo Invalid choice. Exiting.
)
pause
