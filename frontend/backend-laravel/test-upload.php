<?php
/**
 * Script de test pour vérifier la configuration PHP pour les uploads
 * Usage: php test-upload.php
 */

echo "=== VÉRIFICATION CONFIGURATION PHP POUR UPLOADS ===\n\n";

echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "max_file_uploads: " . ini_get('max_file_uploads') . "\n";
echo "file_uploads: " . (ini_get('file_uploads') ? 'ON' : 'OFF') . "\n";
echo "upload_tmp_dir: " . (ini_get('upload_tmp_dir') ?: 'Défaut (système)') . "\n";
echo "max_input_time: " . ini_get('max_input_time') . "\n";
echo "max_execution_time: " . ini_get('max_execution_time') . "\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n\n";

echo "=== VÉRIFICATION PERMISSIONS STORAGE ===\n\n";
$storagePath = __DIR__ . '/storage/app/public/avatars';
echo "Chemin storage avatars: $storagePath\n";
echo "Existe: " . (file_exists($storagePath) ? 'OUI' : 'NON') . "\n";
echo "Est un dossier: " . (is_dir($storagePath) ? 'OUI' : 'NON') . "\n";
if (file_exists($storagePath)) {
    echo "Est accessible en écriture: " . (is_writable($storagePath) ? 'OUI' : 'NON') . "\n";
    echo "Permissions: " . substr(sprintf('%o', fileperms($storagePath)), -4) . "\n";
} else {
    echo "⚠️  Le dossier n'existe pas! Création...\n";
    if (mkdir($storagePath, 0755, true)) {
        echo "✅ Dossier créé avec succès\n";
    } else {
        echo "❌ Impossible de créer le dossier\n";
    }
}

echo "\n=== VÉRIFICATION SYMLINK ===\n\n";
$publicPath = __DIR__ . '/public/storage';
echo "Symlink public/storage: $publicPath\n";
echo "Existe: " . (file_exists($publicPath) ? 'OUI' : 'NON') . "\n";
if (file_exists($publicPath)) {
    echo "Est un lien symbolique: " . (is_link($publicPath) ? 'OUI' : 'NON') . "\n";
    if (is_link($publicPath)) {
        echo "Pointe vers: " . readlink($publicPath) . "\n";
    }
} else {
    echo "⚠️  Le symlink n'existe pas! Exécutez: php artisan storage:link\n";
}

echo "\n=== TEST COMPLET ===\n";
echo "Si toutes les valeurs ci-dessus sont correctes, le problème peut venir:\n";
echo "1. Du frontend qui n'envoie pas le fichier correctement\n";
echo "2. D'un middleware qui bloque les fichiers\n";
echo "3. D'un problème de Content-Type dans la requête\n";



