@echo off
echo ========================================
echo TUER SERVEURS LARAVEL - METHODE AGGRESSIVE
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/8] Methode 1: taskkill /F /IM php.exe...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo.

echo [2/8] Methode 2: Tuer par PID avec taskkill /F...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Tentative de tuer PID %%a...
    taskkill /F /PID %%a 2>nul >nul
    timeout /t 1 /nobreak >nul
)
echo.

echo [3/8] Methode 3: Tuer avec wmic (plus agressif)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Tentative wmic pour PID %%a...
    wmic process where "ProcessId=%%a" delete 2>nul >nul
    timeout /t 1 /nobreak >nul
)
echo.

echo [4/8] Attente de 5 secondes pour que les processus se terminent...
timeout /t 5 /nobreak >nul
echo.

echo [5/8] Verification du port 8000...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo Port 8000 est LIBRE! ✓
    goto :port_libre
)

echo Port 8000 est encore utilise! Nouvelle tentative...
echo.

echo [6/8] Methode 4: Tuer tous les processus Node.js aussi...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo.

echo [7/8] Methode 5: Tuer par nom de processus...
for /f "tokens=2" %%a in ('tasklist ^| findstr "php.exe"') do (
    echo Tentative de tuer PHP processus %%a...
    taskkill /F /PID %%a 2>nul >nul
)
timeout /t 3 /nobreak >nul
echo.

echo [8/8] Verification finale...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo Port 8000 est LIBRE! ✓
    goto :port_libre
) else (
    echo.
    echo ========================================
    echo ERREUR: Le port 8000 est toujours utilise!
    echo ========================================
    echo.
    echo Les processus sont persistants. 
    echo Il faut peut-etre redemarrer votre ordinateur.
    echo.
    echo Ou fermez manuellement tous les terminaux
    echo qui ont lance php artisan serve.
    echo.
    pause
    exit /b 1
)

:port_libre
echo.
echo ========================================
echo SUCCES!
echo ========================================
echo.
echo Le port 8000 est maintenant LIBRE! ✓
echo.
echo Vous pouvez maintenant demarrer UN SEUL serveur avec:
echo   .\DEMARRER_UN_SEUL_SERVEUR.bat
echo.
pause


