<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AnnonceView;
use App\Models\User;
use App\Models\Annonce;

class TestViewRecording extends Command
{
    protected $signature = 'test:view-recording {user_id} {annonce_id}';
    protected $description = 'Test l\'enregistrement d\'une vue directement';

    public function handle()
    {
        $userId = $this->argument('user_id');
        $annonceId = $this->argument('annonce_id');
        
        $this->info('=== Test d\'enregistrement d\'une vue ===');
        
        // Vérifier que l'utilisateur existe
        $user = User::find($userId);
        if (!$user) {
            $this->error("Utilisateur ID {$userId} non trouvé");
            return 1;
        }
        $this->info("✅ Utilisateur trouvé: {$user->email}");
        
        // Vérifier que l'annonce existe
        $annonce = Annonce::find($annonceId);
        if (!$annonce) {
            $this->error("Annonce ID {$annonceId} non trouvée");
            return 1;
        }
        $this->info("✅ Annonce trouvée: {$annonce->titre}");
        
        // Vérifier si la vue existe déjà
        $existing = AnnonceView::where('user_id', $userId)
            ->where('annonce_id', $annonceId)
            ->first();
        
        if ($existing) {
            $this->warn("⚠️ Vue déjà existante (ID: {$existing->id})");
            return 0;
        }
        
        // Créer une nouvelle vue
        try {
            $view = new AnnonceView();
            $view->user_id = $userId;
            $view->annonce_id = $annonceId;
            $view->save();
            
            $this->info("✅ Vue créée avec succès (ID: {$view->id})");
            
            // Vérifier
            $verify = AnnonceView::find($view->id);
            if ($verify) {
                $this->info("✅ Vérification OK - Enregistrement confirmé");
            } else {
                $this->error("❌ ERREUR - L'enregistrement n'a pas été sauvegardé !");
                return 1;
            }
        } catch (\Exception $e) {
            $this->error("❌ ERREUR: " . $e->getMessage());
            $this->error("Stack trace: " . $e->getTraceAsString());
            return 1;
        }
        
        return 0;
    }
}

