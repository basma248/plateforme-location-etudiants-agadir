@echo off
echo ========================================
echo TEST npm start SANS PROXY
echo ========================================
echo.

echo [1/3] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/3] Desactivation du proxy...
if exist src\setupProxy.js (
    ren src\setupProxy.js setupProxy.js.temp
    echo Proxy desactive
) else (
    echo Proxy deja desactive
)

echo [3/3] Lancement de npm start...
echo.
echo Si ca fonctionne maintenant, le probleme vient du PROXY.
echo Si ca reste bloque, le probleme vient de NODE.JS 24.
echo.

call npm start


