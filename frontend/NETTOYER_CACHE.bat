@echo off
echo ========================================
echo NETTOYAGE COMPLET DU CACHE
echo ========================================
echo.

echo [1/4] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/4] Nettoyage du cache npm...
call npm cache clean --force
echo Cache nettoye.

echo [3/4] Suppression de node_modules et package-lock.json...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules supprime.
) else (
    echo node_modules n'existe pas.
)

if exist package-lock.json (
    del package-lock.json
    echo package-lock.json supprime.
) else (
    echo package-lock.json n'existe pas.
)

echo [4/4] Reinstallation des dependances...
call npm install
echo.

echo ========================================
echo Nettoyage termine.
echo Testez maintenant: npm start
echo ========================================
pause


