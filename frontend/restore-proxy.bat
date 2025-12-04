@echo off
echo Restauration du proxy...
if exist src\setupProxy.js.bak (
    ren src\setupProxy.js.bak setupProxy.js
    echo Proxy restaure
) else (
    echo Le fichier de sauvegarde du proxy n'existe pas
)
pause


