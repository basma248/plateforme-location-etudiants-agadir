<?php
/**
 * Script de vérification et création de la table contact_messages
 * Exécutez: php check-contact-table.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "🔍 Vérification de la table contact_messages...\n\n";

try {
    // Vérifier si la table existe
    if (DB::getSchemaBuilder()->hasTable('contact_messages')) {
        echo "✅ La table contact_messages existe déjà.\n";
        
        // Compter les messages
        $count = DB::table('contact_messages')->count();
        echo "📊 Nombre de messages: $count\n";
    } else {
        echo "❌ La table contact_messages n'existe pas.\n";
        echo "🔨 Création de la table...\n";
        
        DB::statement('CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            telephone VARCHAR(20),
            type ENUM(\'question\', \'reclamation\', \'contrainte\', \'suggestion\', \'annonce\', \'technique\', \'autre\') NOT NULL,
            sujet VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            lu BOOLEAN DEFAULT FALSE,
            traite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_lu (lu),
            INDEX idx_traite (traite),
            INDEX idx_type (type),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
        
        echo "✅ Table créée avec succès!\n";
    }
    
    echo "\n✅ Tout est prêt!\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}


