@echo off
echo ========================================
echo DEMARRAGE FINAL - Node.js v20
echo ========================================
echo.

echo [1/3] Verification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe!
    pause
    exit /b 1
)

echo.
echo [2/3] Reinstallation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo ERREUR lors de l'installation des dependances.
    pause
    exit /b 1
)

echo.
echo [3/3] Demarrage de l'application...
echo.
echo L'application va demarrer sur http://localhost:3000
echo.
call npm start


