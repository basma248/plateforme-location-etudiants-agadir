<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('annonces', function (Blueprint $table) {
            // Pour "J'ai trouvé un logement"
            if (!Schema::hasColumn('annonces', 'nb_colocataires_recherches')) {
                $table->integer('nb_colocataires_recherches')->nullable()->after('colocation_type'); // Nombre de colocataires recherchés
            }
            if (!Schema::hasColumn('annonces', 'nb_colocataires_trouves')) {
                $table->integer('nb_colocataires_trouves')->default(0)->after('colocation_type'); // Nombre déjà trouvés
            }
            if (!Schema::hasColumn('annonces', 'conditions_colocation')) {
                $table->text('conditions_colocation')->nullable()->after('colocation_type'); // Conditions spécifiques
            }
            
            // Pour "Je cherche un logement + colocataire"
            if (!Schema::hasColumn('annonces', 'genre_recherche')) {
                $table->enum('genre_recherche', ['homme', 'femme', 'mixte'])->nullable()->after('colocation_type'); // Genre recherché
            }
            if (!Schema::hasColumn('annonces', 'type_chambre_recherchee')) {
                $table->enum('type_chambre_recherchee', ['chambre_seule', 'chambre_partagee', 'indifferent'])->nullable()->after('colocation_type'); // Type de chambre recherchée
            }
            if (!Schema::hasColumn('annonces', 'nb_personnes_souhaitees')) {
                $table->integer('nb_personnes_souhaitees')->nullable()->after('colocation_type'); // Nombre de personnes souhaitées
            }
            if (!Schema::hasColumn('annonces', 'cherche_seul')) {
                $table->boolean('cherche_seul')->default(false)->after('colocation_type'); // Cherche seul
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('annonces', function (Blueprint $table) {
            $table->dropColumn([
                'nb_colocataires_recherches',
                'nb_colocataires_trouves',
                'conditions_colocation',
                'genre_recherche',
                'type_chambre_recherchee',
                'nb_personnes_souhaitees',
                'cherche_seul'
            ]);
        });
    }
};
