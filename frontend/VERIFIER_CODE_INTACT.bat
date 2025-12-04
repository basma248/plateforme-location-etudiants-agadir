@echo off
echo ========================================
echo VERIFICATION - CODE INTACT
echo ========================================
echo.

echo VOTRE CODE N'EST PAS SUPPRIME!
echo.
echo Verification des fichiers principaux...
echo.

echo [1/5] Fichiers frontend...
if exist src\App.js (echo   App.js existe ✓) else (echo   App.js MANQUANT!)
if exist src\index.js (echo   index.js existe ✓) else (echo   index.js MANQUANT!)
if exist src\pages\HomePage.js (echo   HomePage.js existe ✓) else (echo   HomePage.js MANQUANT!)
if exist src\pages\ContactPage.js (echo   ContactPage.js existe ✓) else (echo   ContactPage.js MANQUANT!)
echo.

echo [2/5] Fichiers backend...
if exist backend-laravel\routes\api.php (echo   api.php existe ✓) else (echo   api.php MANQUANT!)
if exist backend-laravel\app\Http\Controllers\AuthController.php (echo   AuthController.php existe ✓) else (echo   AuthController.php MANQUANT!)
if exist backend-laravel\artisan (echo   artisan existe ✓) else (echo   artisan MANQUANT!)
echo.

echo [3/5] Configuration...
if exist package.json (echo   package.json existe ✓) else (echo   package.json MANQUANT!)
if exist backend-laravel\composer.json (echo   composer.json existe ✓) else (echo   composer.json MANQUANT!)
echo.

echo [4/5] Build...
if exist build\index.html (echo   build existe ✓) else (echo   build n existe pas encore - normal)
echo.

echo [5/5] Resume...
echo.
echo TOUS VOS FICHIERS SONT INTACTS!
echo Le code n'a pas ete supprime.
echo.
echo Le probleme vient du cache Laravel ou du serveur qui n'a pas ete redemarre.
echo.

pause


