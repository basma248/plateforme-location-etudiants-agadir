<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Utiliser DB::statement pour éviter les problèmes avec renameColumn
        // Vérifier et ajouter/renommer les colonnes manquantes
        if (Schema::hasColumn('annonces', 'type_chambre_recherche') && !Schema::hasColumn('annonces', 'type_chambre_recherchee')) {
            // Renommer la colonne
            DB::statement('ALTER TABLE `annonces` CHANGE `type_chambre_recherche` `type_chambre_recherchee` ENUM(\'chambre_seule\', \'chambre_partagee\', \'indifferent\') NULL');
        } elseif (!Schema::hasColumn('annonces', 'type_chambre_recherchee')) {
            // Créer la colonne si elle n'existe pas
            Schema::table('annonces', function (Blueprint $table) {
                $table->enum('type_chambre_recherchee', ['chambre_seule', 'chambre_partagee', 'indifferent'])->nullable()->after('genre_recherche');
            });
        }
        
        if (Schema::hasColumn('annonces', 'nb_personnes_chambre') && !Schema::hasColumn('annonces', 'nb_personnes_souhaitees')) {
            // Renommer la colonne
            DB::statement('ALTER TABLE `annonces` CHANGE `nb_personnes_chambre` `nb_personnes_souhaitees` INT NULL');
        } elseif (!Schema::hasColumn('annonces', 'nb_personnes_souhaitees')) {
            // Créer la colonne si elle n'existe pas
            Schema::table('annonces', function (Blueprint $table) {
                $table->integer('nb_personnes_souhaitees')->nullable()->after('type_chambre_recherchee');
            });
        }
        
        // Ajouter cherche_seul si n'existe pas
        if (!Schema::hasColumn('annonces', 'cherche_seul')) {
            Schema::table('annonces', function (Blueprint $table) {
                $table->boolean('cherche_seul')->default(false)->after('nb_personnes_souhaitees');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Ne rien faire en down pour éviter de casser la base de données
    }
};
