@echo off
echo ========================================
echo FIX BLOQUAGE - Node.js v20
echo ========================================
echo.

echo [1/4] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/4] Desactivation du proxy...
if exist src\setupProxy.js (
    ren src\setupProxy.js setupProxy.js.temp2
    echo Proxy desactive.
) else (
    echo Proxy deja desactive.
)

echo [3/4] Nettoyage du cache webpack...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo Cache webpack supprime.
) else (
    echo Pas de cache webpack.
)

echo [4/4] Lancement de npm start...
echo.
echo ATTENDEZ 3-5 MINUTES pour la premiere compilation!
echo C'est normal que ca prenne du temps la premiere fois.
echo.
echo Si apres 5 minutes ca ne fonctionne toujours pas,
echo le probleme vient peut-etre d'un fichier qui cause une erreur.
echo.

call npm start


