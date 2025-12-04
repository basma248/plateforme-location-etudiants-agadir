@echo off
echo ========================================
echo FIX: Downgrade React vers version stable
echo ========================================
echo.

echo Le probleme identifie: React 19.2.0 est trop recent
echo et peut causer des problemes avec react-scripts 5.0.1
echo.

echo [1/3] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo OK
echo.

echo [2/3] Installation de React 18 (version stable)...
call npm install react@^18.2.0 react-dom@^18.2.0
echo.

echo [3/3] Verification...
call npm list react react-dom
echo.

echo ========================================
echo INSTALLATION TERMINEE
echo ========================================
echo.
echo Maintenant, essayez:
echo   npm start
echo.
echo React 18 est plus stable avec react-scripts 5.0.1
echo.
pause


