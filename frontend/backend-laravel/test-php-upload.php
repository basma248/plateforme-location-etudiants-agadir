<?php
/**
 * Script de test pour vérifier la configuration PHP pour l'upload de fichiers
 */

echo "=== TEST CONFIGURATION PHP UPLOAD ===\n\n";

echo "1. Limites PHP:\n";
echo "   upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "   post_max_size: " . ini_get('post_max_size') . "\n";
echo "   max_file_uploads: " . ini_get('max_file_uploads') . "\n";
echo "   max_input_time: " . ini_get('max_input_time') . "\n";
echo "   memory_limit: " . ini_get('memory_limit') . "\n";
echo "   max_execution_time: " . ini_get('max_execution_time') . "\n\n";

echo "2. Vérification des permissions:\n";
$storagePath = __DIR__ . '/storage/app/public/avatars';
if (!is_dir($storagePath)) {
    echo "   ❌ Le dossier $storagePath n'existe pas\n";
    if (mkdir($storagePath, 0777, true)) {
        echo "   ✅ Dossier créé avec succès\n";
    } else {
        echo "   ❌ Impossible de créer le dossier\n";
    }
} else {
    echo "   ✅ Le dossier existe\n";
    echo "   Permissions: " . substr(sprintf('%o', fileperms($storagePath)), -4) . "\n";
    echo "   Writable: " . (is_writable($storagePath) ? 'OUI' : 'NON') . "\n";
}

echo "\n3. Vérification du lien symbolique:\n";
$linkPath = __DIR__ . '/public/storage';
if (is_link($linkPath)) {
    echo "   ✅ Le lien symbolique existe\n";
    echo "   Pointe vers: " . readlink($linkPath) . "\n";
} else {
    echo "   ❌ Le lien symbolique n'existe pas\n";
    echo "   Solution: Exécuter 'php artisan storage:link'\n";
}

echo "\n4. Test d'écriture:\n";
$testFile = $storagePath . '/test_' . time() . '.txt';
if (file_put_contents($testFile, 'test')) {
    echo "   ✅ Écriture réussie\n";
    unlink($testFile);
    echo "   ✅ Suppression réussie\n";
} else {
    echo "   ❌ Écriture échouée\n";
}

echo "\n=== FIN DU TEST ===\n";

