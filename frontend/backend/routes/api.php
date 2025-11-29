<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnnonceController;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::get('annonces', [AnnonceController::class, 'index']);
Route::get('annonces/{id}', [AnnonceController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    Route::post('annonces', [AnnonceController::class, 'store']);
    Route::put('annonces/{id}', [AnnonceController::class, 'update']);
    Route::delete('annonces/{id}', [AnnonceController::class, 'destroy']);
});