@echo off
echo Creation du fichier .env...
(
    echo SKIP_PREFLIGHT_CHECK=true
    echo GENERATE_SOURCEMAP=false
    echo FAST_REFRESH=true
    echo BROWSER=none
    echo PORT=3000
) > .env
echo Fichier .env cree avec succes!
echo.
pause


