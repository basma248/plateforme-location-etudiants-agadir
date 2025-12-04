# Script PowerShell pour vérifier les logs d'upload d'avatar
# Usage: .\check-avatar-logs.ps1

$logFile = "storage\logs\laravel.log"

if (Test-Path $logFile) {
    Write-Host "=== RECHERCHE DES LOGS D'UPLOAD AVATAR ===" -ForegroundColor Cyan
    Write-Host ""
    
    # Chercher les logs d'upload
    $uploadLogs = Get-Content $logFile -Tail 1000 | Select-String -Pattern "VÉRIFICATION FICHIER|hasFile.*avatar|AVATAR UPLOADÉ|SAUVEGARDE AVATAR|updateProfile" -Context 3
    
    if ($uploadLogs) {
        Write-Host "Logs trouvés:" -ForegroundColor Green
        $uploadLogs | ForEach-Object { Write-Host $_ }
    } else {
        Write-Host "Aucun log d'upload trouvé dans les 1000 dernières lignes." -ForegroundColor Yellow
        Write-Host "Cela signifie que l'upload n'a peut-être pas été tenté ou que le fichier n'est pas reçu." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "=== VÉRIFICATION DES LOGS DE RÉCUPÉRATION ===" -ForegroundColor Cyan
    Write-Host ""
    
    # Chercher les logs de récupération
    $getProfileLogs = Get-Content $logFile -Tail 500 | Select-String -Pattern "getProfile|RÉCUPÉRATION AVATAR|Avatar.*NULL" -Context 2
    
    if ($getProfileLogs) {
        Write-Host "Logs de récupération trouvés:" -ForegroundColor Green
        $getProfileLogs | ForEach-Object { Write-Host $_ }
    }
} else {
    Write-Host "Le fichier de log n'existe pas: $logFile" -ForegroundColor Red
}



