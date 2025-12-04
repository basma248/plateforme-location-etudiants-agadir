@echo off
echo ========================================
echo TEST D'ISOLATION - Identifier le probleme
echo ========================================
echo.

echo [1/5] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/5] Test 1: Sans proxy (deja fait)...
echo Le proxy est deja desactive (setupProxy.js.temp)
echo.

echo [3/5] Test 2: Sans ContactPage...
echo Commentation de ContactPage dans App.js...
powershell -Command "(Get-Content src\App.js) -replace '^import ContactPage', '// import ContactPage' -replace '<Route path=\"/contact\"', '// <Route path=\"/contact\"' | Set-Content src\App.js.temp"
echo Fichier temporaire cree: src\App.js.temp
echo.

echo [4/5] Test 3: Nettoyage du cache...
call npm cache clean --force
echo.

echo [5/5] Lancement de npm start...
echo.
echo Si ca fonctionne maintenant, le probleme venait de:
echo   - Le proxy (deja desactive)
echo   - ContactPage (a tester manuellement)
echo   - Le cache (deja nettoye)
echo.

call npm start


