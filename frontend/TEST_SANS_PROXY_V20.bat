@echo off
echo ========================================
echo TEST SANS PROXY - Node.js v20
echo ========================================
echo.

echo [1/3] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/3] Desactivation du proxy...
if exist src\setupProxy.js (
    ren src\setupProxy.js setupProxy.js.temp2
    echo Proxy desactive.
) else (
    echo Proxy deja desactive.
)

echo [3/3] Lancement de npm start SANS PROXY...
echo.
echo ATTENDEZ 2-3 minutes pour la compilation...
echo Si ca fonctionne, le probleme venait du PROXY qui attend le backend Laravel.
echo.

call npm start


