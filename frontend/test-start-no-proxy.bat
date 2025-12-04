@echo off
echo ========================================
echo Test npm start SANS proxy
echo ========================================
echo.

echo [1/3] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/3] Desactivation temporaire du proxy...
if exist src\setupProxy.js (
    ren src\setupProxy.js setupProxy.js.bak
    echo Proxy desactive
) else (
    echo Proxy deja desactive
)

echo [3/3] Lancement de npm start...
echo.
echo Si ca fonctionne maintenant, le probleme vient du PROXY!
echo.
call npm start


