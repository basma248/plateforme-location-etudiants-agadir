Write-Host "========================================"
Write-Host "Reconstruction du build..."
Write-Host "========================================"
Write-Host ""

Write-Host "Suppression de l'ancien build..."
if (Test-Path build) {
    Remove-Item -Recurse -Force build
    Write-Host "Build supprime"
}

Write-Host ""
Write-Host "Reconstruction avec npm run build..."
npm run build

Write-Host ""
Write-Host "========================================"
Write-Host "Reconstruction terminee!"
Write-Host "========================================"
Write-Host ""
Write-Host "Redemarrez votre serveur avec:"
Write-Host ".\SOLUTION_FINALE_API.bat"
Write-Host ""


