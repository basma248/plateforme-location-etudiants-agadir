@echo off
echo ========================================
echo DESINSTALLATION DE NODE.JS V24
echo ========================================
echo.

echo [1/3] Recherche de Node.js installe...
echo.

REM Utiliser PowerShell pour lister les versions de Node.js installees
powershell -Command "Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like '*Node.js*' } | Select-Object Name, Version | Format-Table -AutoSize"

echo.
echo [2/3] Desinstallation de Node.js v24...
echo.

REM Methode 1: Utiliser wmic (si disponible)
wmic product where "name like 'Node.js%%'" get name,version 2>nul

echo.
echo [3/3] Instructions manuelles...
echo.
echo Si la commande ci-dessus n'a pas fonctionne, suivez ces etapes:
echo.
echo 1. Ouvrez le Panneau de configuration
echo 2. Allez dans "Programmes" ^> "Programmes et fonctionnalites"
echo 3. Cherchez "Node.js"
echo 4. Cliquez dessus ^> "Desinstaller"
echo.
echo OU utilisez cette commande PowerShell (executez en tant qu'administrateur):
echo.
echo powershell -Command "Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like '*Node.js*' -and $_.Version -like '24.*' } | ForEach-Object { $_.Uninstall() }"
echo.

pause


