@echo off
echo ========================================
echo TUER TOUS LES SERVEURS LARAVEL
echo ========================================
echo.

echo Il y a encore 5 serveurs Laravel qui tournent.
echo Je vais les tuer individuellement par leur PID.
echo.

echo [1/5] Liste des processus utilisant le port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Processus trouve: PID %%a
    echo Tentative de suppression du processus %%a...
    taskkill /F /PID %%a 2>nul
    if %errorlevel% equ 0 (
        echo Processus %%a tue avec succes! ✓
    ) else (
        echo Impossible de tuer le processus %%a. Il est peut-etre deja termine.
    )
)

timeout /t 3 /nobreak >nul

echo.
echo [2/5] Verification qu aucun serveur ne tourne...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo ATTENTION: Des serveurs tournent encore!
    echo Nouvelle tentative de suppression...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a 2>nul
    )
    timeout /t 2 /nobreak >nul
) else (
    echo Aucun serveur ne tourne! ✓
)
echo.

echo [3/5] Arret de tous les processus PHP...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Processus PHP arretes! ✓
echo.

echo [4/5] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
cd ..
echo Cache nettoye! ✓
echo.

echo [5/5] Verification finale du port 8000...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo ATTENTION: Le port 8000 est toujours utilise!
    echo Liste des PIDs:
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        echo   PID: %%a
    )
) else (
    echo Port 8000 est LIBRE! ✓
    echo Vous pouvez maintenant demarrer UN SEUL serveur Laravel.
)
echo.

echo ========================================
echo TERMINE
echo ========================================
echo.
echo Si le port 8000 est libre, demarrez le serveur avec:
echo   cd backend-laravel
echo   php artisan serve
echo.
pause


