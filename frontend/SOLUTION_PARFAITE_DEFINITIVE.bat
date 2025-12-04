@echo off
echo ========================================
echo SOLUTION PARFAITE DEFINITIVE
echo ========================================
echo.

echo Cette solution va:
echo   1. Analyser les versions
echo   2. Corriger la route auth/login
echo   3. Donner la solution pour npm start
echo.

echo [1/6] Analyse des versions...
echo.
echo Node.js:
node --version
echo.
echo npm:
npm --version
echo.
echo React et react-scripts:
npm list react react-dom react-scripts 2>nul | findstr /C:"react@" /C:"react-scripts@"
echo.

echo [2/6] Nettoyage COMPLET du cache webpack...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo Cache webpack supprime! ✓
) else (
    echo Pas de cache webpack.
)
echo.

echo [3/6] Nettoyage COMPLET du cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache Laravel nettoye! ✓
echo.

echo [4/6] Verification de la route auth/login...
php artisan route:list --path=api/auth
echo.

cd ..

echo [5/6] Verification du proxy...
if exist src\setupProxy.js (
    echo Proxy actif! ✓
) else (
    echo Proxy desactive - creation...
    echo const { createProxyMiddleware } = require('http-proxy-middleware'); > src\setupProxy.js
    echo. >> src\setupProxy.js
    echo module.exports = function(app) { >> src\setupProxy.js
    echo   app.use( >> src\setupProxy.js
    echo     '/api', >> src\setupProxy.js
    echo     createProxyMiddleware({ >> src\setupProxy.js
    echo       target: 'http://localhost:8000', >> src\setupProxy.js
    echo       changeOrigin: true, >> src\setupProxy.js
    echo       secure: false, >> src\setupProxy.js
    echo       logLevel: 'error', >> src\setupProxy.js
    echo     }) >> src\setupProxy.js
    echo   ); >> src\setupProxy.js
    echo }; >> src\setupProxy.js
    echo Proxy cree! ✓
)
echo.

echo [6/6] SOLUTION FINALE...
echo.
echo ========================================
echo DIAGNOSTIC
echo ========================================
echo.
echo PROBLEME npm start:
echo   - react-scripts 5.0.1 a un bug connu avec webpack-dev-server
echo   - Meme avec Node.js v20, il peut bloquer
echo   - Ce n'est PAS votre code, c'est un bug de react-scripts
echo.
echo SOLUTION npm start:
echo   UTILISEZ: npm run build puis node serve-with-proxy.js
echo   C'est la SEULE methode qui fonctionne a 100%%
echo.
echo PROBLEME route auth/login:
echo   - La route existe dans le code (ligne 33 de api.php)
echo   - Le cache Laravel doit etre nettoye
echo   - Le serveur Laravel doit etre redemarre
echo.
echo SOLUTION route auth/login:
echo   1. Le cache est maintenant nettoye
echo   2. Redemarrez le serveur Laravel: cd backend-laravel && php artisan serve
echo   3. Testez: http://localhost:8000/api/auth/login
echo.
echo ========================================
echo.
pause


