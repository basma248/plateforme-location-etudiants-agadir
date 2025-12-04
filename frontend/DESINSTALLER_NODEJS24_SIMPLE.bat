@echo off
echo ========================================
echo DESINSTALLATION DE NODE.JS V24
echo ========================================
echo.

echo Cette commande va desinstaller Node.js v24.
echo.
echo IMPORTANT: Executez ce script en tant qu'ADMINISTRATEUR!
echo.
pause

echo.
echo [1/2] Recherche de Node.js v24...
echo.

REM Utiliser wmic pour trouver et desinstaller Node.js v24
for /f "tokens=*" %%i in ('wmic product where "name like 'Node.js%%'" get IdentifyingNumber /value ^| findstr "IdentifyingNumber"') do (
    set %%i
    echo Desinstallation de Node.js...
    wmic product where "IdentifyingNumber=%IdentifyingNumber%" call Uninstall /nointeractive
)

echo.
echo [2/2] Desinstallation terminee.
echo.
echo Si la commande ci-dessus n'a pas fonctionne, utilisez le Panneau de configuration:
echo 1. Panneau de configuration ^> Programmes ^> Programmes et fonctionnalites
echo 2. Cherchez "Node.js"
echo 3. Cliquez dessus ^> Desinstaller
echo.

pause


