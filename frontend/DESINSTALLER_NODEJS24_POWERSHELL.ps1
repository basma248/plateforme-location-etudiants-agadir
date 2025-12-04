# Script PowerShell pour désinstaller Node.js v24
# Exécutez en tant qu'administrateur : PowerShell en tant qu'administrateur, puis : .\DESINSTALLER_NODEJS24_POWERSHELL.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DESINSTALLATION DE NODE.JS V24" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Recherche de Node.js installe..." -ForegroundColor Yellow
Write-Host ""

# Lister toutes les installations de Node.js
$nodejsApps = Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like '*Node.js*' }

if ($nodejsApps) {
    Write-Host "Versions de Node.js trouvees:" -ForegroundColor Green
    $nodejsApps | ForEach-Object {
        Write-Host "  - $($_.Name) (Version: $($_.Version))" -ForegroundColor White
    }
    Write-Host ""
    
    # Filtrer Node.js v24
    $nodejs24 = $nodejsApps | Where-Object { $_.Version -like '24.*' }
    
    if ($nodejs24) {
        Write-Host "[2/3] Node.js v24 trouve. Desinstallation en cours..." -ForegroundColor Yellow
        Write-Host ""
        
        $nodejs24 | ForEach-Object {
            Write-Host "Desinstallation de: $($_.Name) (Version: $($_.Version))" -ForegroundColor Yellow
            try {
                $_.Uninstall()
                Write-Host "  ✓ Desinstalle avec succes!" -ForegroundColor Green
            } catch {
                Write-Host "  ✗ Erreur lors de la desinstallation: $_" -ForegroundColor Red
                Write-Host "  Essayez de desinstaller manuellement via le Panneau de configuration." -ForegroundColor Yellow
            }
        }
        
        Write-Host ""
        Write-Host "[3/3] Desinstallation terminee." -ForegroundColor Green
        Write-Host ""
        Write-Host "Verifiez la version avec: node --version" -ForegroundColor Cyan
        Write-Host "Si la version est toujours v24, redemarrez votre ordinateur." -ForegroundColor Yellow
    } else {
        Write-Host "[2/3] Aucune version v24 de Node.js trouvee." -ForegroundColor Yellow
        Write-Host "Les versions trouvees sont:" -ForegroundColor White
        $nodejsApps | ForEach-Object {
            Write-Host "  - $($_.Name) (Version: $($_.Version))" -ForegroundColor White
        }
    }
} else {
    Write-Host "[1/3] Aucune installation de Node.js trouvee." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Verifiez manuellement dans:" -ForegroundColor Cyan
    Write-Host "  Panneau de configuration > Programmes > Programmes et fonctionnalites" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


