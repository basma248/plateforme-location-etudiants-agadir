@echo off
echo ========================================
echo LIBERATION DU PORT 3000
echo ========================================
echo.

echo [1/3] Recherche des processus utilisant le port 3000...
netstat -ano | findstr :3000
echo.

echo [2/3] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Processus Node.js arretes.
) else (
    echo Aucun processus Node.js trouve.
)

echo.
echo [3/3] Arret des processus utilisant le port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Arret du processus PID: %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo Port 3000 libere!
echo.
echo Vous pouvez maintenant demarrer le frontend:
echo   node serve-with-proxy.js
echo.
pause


