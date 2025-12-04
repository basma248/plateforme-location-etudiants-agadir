# Script PowerShell pour créer le lien symbolique storage
$target = Join-Path $PSScriptRoot "storage\app\public"
$link = Join-Path $PSScriptRoot "public\storage"

if (Test-Path $link) {
    Write-Host "Le lien symbolique existe déjà"
} else {
    New-Item -ItemType SymbolicLink -Path $link -Target $target
    Write-Host "Lien symbolique créé avec succès"
}



