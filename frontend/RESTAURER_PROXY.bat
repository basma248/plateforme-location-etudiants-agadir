@echo off
echo Restauration du proxy...
if exist src\setupProxy.js.temp (
    ren src\setupProxy.js.temp setupProxy.js
    echo Proxy restaure
) else (
    echo Pas de backup de proxy trouve
)


