@echo off
echo Liberation rapide des ports 8000 et 8001...
echo.

echo Arret des processus PHP...
taskkill /F /IM php.exe 2>nul >nul

echo Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul

timeout /t 2 /nobreak >nul

echo Ports liberes!
echo.
echo Verification:
netstat -ano | findstr ":8000" | findstr "LISTENING"
netstat -ano | findstr ":8001" | findstr "LISTENING"

echo.
echo Si aucune ligne n'est affichee, les ports sont libres.
echo.
pause


