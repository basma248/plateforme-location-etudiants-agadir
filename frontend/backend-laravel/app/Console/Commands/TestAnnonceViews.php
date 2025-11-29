<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AnnonceView;
use App\Models\User;
use App\Models\Annonce;

class TestAnnonceViews extends Command
{
    protected $signature = 'test:annonce-views {user_id?}';
    protected $description = 'Test et affiche les enregistrements dans annonce_views';

    public function handle()
    {
        $userId = $this->argument('user_id');
        
        $this->info('=== Test des annonces vues ===');
        
        // Compter tous les enregistrements
        $totalViews = AnnonceView::count();
        $this->info("Total d'enregistrements dans annonce_views: {$totalViews}");
        
        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("Utilisateur ID {$userId} non trouvé");
                return;
            }
            
            $this->info("\n=== Vues pour l'utilisateur ID {$userId} ({$user->email}) ===");
            $userViews = AnnonceView::where('user_id', $userId)->get();
            $this->info("Nombre de vues: " . $userViews->count());
            
            foreach ($userViews as $view) {
                $annonce = Annonce::find($view->annonce_id);
                $titre = $annonce ? $annonce->titre : 'N/A';
                $this->line("- Annonce ID: {$view->annonce_id} - {$titre} (Consultée le: {$view->created_at})");
            }
        } else {
            // Afficher tous les enregistrements
            $this->info("\n=== Tous les enregistrements ===");
            $views = AnnonceView::with(['user', 'annonce'])->get();
            
            foreach ($views as $view) {
                $titre = $view->annonce ? $view->annonce->titre : 'N/A';
                $this->line("User ID: {$view->user_id} - Annonce ID: {$view->annonce_id} - {$titre} (Consultée le: {$view->created_at})");
            }
        }
        
        // Vérifier la structure de la table
        $this->info("\n=== Structure de la table ===");
        $columns = \DB::select('DESCRIBE annonce_views');
        foreach ($columns as $column) {
            $this->line("- {$column->Field} ({$column->Type})");
        }
    }
}
