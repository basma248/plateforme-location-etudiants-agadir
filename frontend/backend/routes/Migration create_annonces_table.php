<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annonces', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('zone')->nullable();
            $table->string('type')->nullable();
            $table->integer('prix')->nullable();
            $table->integer('surface')->nullable();
            $table->integer('nb_chambres')->nullable();
            $table->boolean('meuble')->default(false);
            $table->json('images')->nullable();
            $table->string('disponibilite')->nullable();
            $table->string('adresse')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annonces');
    }
};