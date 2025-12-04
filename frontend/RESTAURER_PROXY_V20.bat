@echo off
echo Restauration du proxy...
if exist src\setupProxy.js.temp2 (
    ren src\setupProxy.js.temp2 setupProxy.js
    echo Proxy restaure.
) else (
    echo Pas de backup de proxy trouve.
)
pause


