@echo off
echo ========================================
echo SOLUTION COMPLETE - Debloquer npm start
echo ========================================
echo.

echo [1/6] Arret de tous les processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo OK
echo.

echo [2/6] Nettoyage du cache npm...
call npm cache clean --force
echo OK
echo.

echo [3/6] Suppression des dossiers temporaires...
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist .eslintcache del /q .eslintcache 2>nul
echo OK
echo.

echo [4/6] Verification du port 3000...
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo ATTENTION: Le port 3000 est deja utilise!
    echo Arret des processus sur le port 3000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /F /PID %%a 2>nul >nul
    )
    timeout /t 2 /nobreak >nul
)
echo OK
echo.

echo [5/6] Verification de setupProxy.js...
if exist src\setupProxy.js (
    echo Le fichier setupProxy.js existe - OK
) else (
    echo ATTENTION: setupProxy.js n'existe pas!
)
echo.

echo [6/6] Configuration de l'environnement...
if not exist .env (
    echo Creation du fichier .env...
    (
        echo SKIP_PREFLIGHT_CHECK=true
        echo GENERATE_SOURCEMAP=false
        echo FAST_REFRESH=true
        echo BROWSER=none
        echo PORT=3000
    ) > .env
    echo OK
) else (
    echo Le fichier .env existe deja
)
echo.

echo ========================================
echo NETTOYAGE TERMINE
echo ========================================
echo.
echo Maintenant, essayez:
echo   npm start
echo.
echo Si ca ne fonctionne toujours pas, attendez 2-3 minutes
echo Le serveur peut prendre du temps a compiler.
echo.
pause


