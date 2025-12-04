@echo off
echo Restauration de ContactPage dans App.js...
powershell -Command "(Get-Content src\App.js) -replace '// import ContactPage', 'import ContactPage' -replace '// <Route path=\"/contact\"', '<Route path=\"/contact\"' -replace 'TEMPORAIREMENT DESACTIVE POUR TEST', '' | Set-Content src\App.js"
echo ContactPage restaure.
pause


