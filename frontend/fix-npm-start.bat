@echo off
echo ========================================
echo Fix npm start bloque
echo ========================================
echo.

echo Arret de tous les processus Node.js...
taskkill /F /IM node.exe 2>nul

echo.
echo Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo Nettoyage du cache npm...
call npm cache clean --force

echo.
echo Suppression de node_modules et package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Reinstallation des dependances...
call npm install

echo.
echo ========================================
echo Maintenant, lancez: npm start
echo ========================================
pause


