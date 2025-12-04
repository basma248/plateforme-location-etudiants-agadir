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
            // Pour "logement_trouve" : détails sur les colocataires recherchés
            $table->integer('nb_colocataires_recherches')->nullable()->after('colocation_type');
            $table->integer('nb_colocataires_trouves')->default(0)->after('nb_colocataires_recherches');
            $table->text('conditions_colocation')->nullable()->after('nb_colocataires_trouves');
            
            // Pour "logement_recherche" : détails sur la recherche
            $table->enum('genre_recherche', ['homme', 'femme', 'mixte'])->nullable()->after('conditions_colocation');
            $table->enum('type_recherche', ['chambre_seule', 'chambre_partagee', 'studio', 'appartement'])->nullable()->after('genre_recherche');
            $table->integer('nb_personnes_recherche')->nullable()->after('type_recherche');
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
                'type_recherche',
                'nb_personnes_recherche'
            ]);
        });
    }
};
