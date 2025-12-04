<?php
/**
 * Script pour capturer l'erreur "Array to string conversion"
 * Active le mode debug et capture toutes les erreurs
 */

// Activer le rapport d'erreurs complet
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/storage/logs/php-errors.log');

// Handler personnalisé pour capturer "Array to string conversion"
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (strpos($errstr, 'Array to string conversion') !== false) {
        $logFile = __DIR__ . '/storage/logs/array-conversion-errors.log';
        $logMessage = sprintf(
            "[%s] ERREUR CAPTURÉE: %s\nFichier: %s\nLigne: %d\nStack trace:\n%s\n\n",
            date('Y-m-d H:i:s'),
            $errstr,
            $errfile,
            $errline,
            json_encode(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 15), JSON_PRETTY_PRINT)
        );
        file_put_contents($logFile, $logMessage, FILE_APPEND);
        echo "⚠️ ERREUR CAPTURÉE! Vérifiez: $logFile\n";
    }
    return false; // Laisser le handler par défaut gérer
}, E_ALL);

echo "=== CAPTURE D'ERREURS ACTIVÉE ===\n";
echo "Toutes les erreurs 'Array to string conversion' seront loggées dans:\n";
echo __DIR__ . "/storage/logs/array-conversion-errors.log\n\n";

// Tester les opérations qui pourraient causer l'erreur
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Laravel bootstrappé. Testez maintenant l'upload d'avatar depuis le frontend.\n";
echo "Les erreurs seront capturées automatiquement.\n\n";

// Garder le script actif pour capturer les erreurs
echo "Appuyez sur Ctrl+C pour arrêter...\n";
while (true) {
    sleep(1);
}



