@echo off
echo Creation du fichier .env optimise pour acceleration de compilation...
(
    echo SKIP_PREFLIGHT_CHECK=true
    echo GENERATE_SOURCEMAP=false
    echo FAST_REFRESH=true
    echo BROWSER=none
    echo PORT=3000
    echo TSC_COMPILE_ON_ERROR=true
    echo ESLINT_NO_DEV_ERRORS=true
    echo DISABLE_ESLINT_PLUGIN=true
    echo WATCHPACK_POLLING=true
) > .env
echo Fichier .env optimise cree!
echo.
echo Ces options vont:
echo - Desactiver les source maps (plus rapide)
echo - Desactiver ESLint (plus rapide)
echo - Activer le polling (plus fiable sur Windows)
echo.
pause


