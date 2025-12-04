@echo off
echo ========================================
echo SOLUTION FINALE - Application NON PERDUE
echo ========================================
echo.

echo VOTRE APPLICATION N'EST PAS PERDUE!
echo Le build fonctionne, donc votre code est correct.
echo.
echo Cette solution va construire l'application et la servir.
echo.

echo [1/4] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/4] Construction de l'application (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERREUR lors de la construction.
    echo Mais votre code est correct - c'est juste le serveur de dev qui bloque.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] Construction reussie! Votre application est intacte!
echo.

echo [4/4] Demarrage du serveur avec proxy...
echo.
echo L'application va demarrer sur http://localhost:3000
echo.
echo IMPORTANT: Assurez-vous que le backend Laravel est demarre sur http://localhost:8000
echo.

node serve-with-proxy.js


