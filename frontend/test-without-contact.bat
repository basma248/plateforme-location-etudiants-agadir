@echo off
echo ========================================
echo Test SANS ContactPage
echo ========================================
echo.

echo [1/3] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/3] Commentaire temporaire de ContactPage dans App.js...
echo.

echo Si npm start fonctionne maintenant, le probleme vient de ContactPage!
echo.

echo [3/3] Lancement de npm start...
echo.
call npm start


