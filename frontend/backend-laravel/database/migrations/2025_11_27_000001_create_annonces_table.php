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
        Schema::create('annonces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->enum('type', ['chambre', 'studio', 'appartement', 'colocation']);
            $table->string('zone');
            $table->text('adresse')->nullable();
            $table->decimal('prix', 10, 2);
            $table->decimal('surface', 6, 2)->nullable();
            $table->integer('nb_chambres')->default(1);
            $table->text('description');
            $table->text('description_longue')->nullable();
            $table->boolean('meuble')->default(false);
            $table->string('disponibilite')->nullable();
            $table->enum('statut', ['en_attente', 'approuve', 'rejete', 'signale'])->default('en_attente');
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('nb_avis')->default(0);
            $table->integer('vues')->default(0);
            $table->integer('contacts')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('type');
            $table->index('zone');
            $table->index('prix');
            $table->index('statut');
            $table->index('created_at');
            $table->fullText(['titre', 'description', 'zone']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annonces');
    }
};