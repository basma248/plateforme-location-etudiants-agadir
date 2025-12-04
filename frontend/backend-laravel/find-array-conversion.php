<?php
/**
 * Script pour trouver toutes les concaténations de chaînes dans UserController
 */

$file = __DIR__ . '/app/Http/Controllers/UserController.php';
$content = file_get_contents($file);

echo "=== RECHERCHE DES CONCATÉNATIONS DANGEREUSES ===\n\n";

// Rechercher toutes les concaténations
$lines = explode("\n", $content);
$lineNum = 0;
$dangerousLines = [];

foreach ($lines as $line) {
    $lineNum++;
    
    // Chercher les patterns dangereux
    if (preg_match('/\.\s*\$|\.\s*[\'"]|[\'"]\s*\./', $line)) {
        // Vérifier si c'est dans formatAvatarUrl ou uploadAvatar
        $context = '';
        for ($i = max(0, $lineNum - 10); $i < min(count($lines), $lineNum + 10); $i++) {
            if (strpos($lines[$i], 'function formatAvatarUrl') !== false || 
                strpos($lines[$i], 'function uploadAvatar') !== false) {
                $context = 'formatAvatarUrl/uploadAvatar';
                break;
            }
        }
        
        if ($context || $lineNum > 20 && $lineNum < 150) {
            $dangerousLines[] = [
                'line' => $lineNum,
                'content' => trim($line),
                'context' => $context
            ];
        }
    }
}

echo "Lignes avec concaténations trouvées:\n";
foreach ($dangerousLines as $item) {
    echo sprintf("Ligne %d: %s\n", $item['line'], substr($item['content'], 0, 80));
}

echo "\n=== FIN ===\n";



