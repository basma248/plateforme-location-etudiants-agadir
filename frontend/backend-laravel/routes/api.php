<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ColocataireController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
Route::get('/test', function () {
    return 'api working';
});
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes d'authentification (non protégées) - ROUTE EXPLICITE
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Routes publiques des annonces (consultation)
// IMPORTANT: La route /{id} doit être définie APRÈS les routes spécifiques comme /favorites/list
Route::prefix('annonces')->group(function () {
    Route::get('/', [AnnonceController::class, 'index']);           // Lister les annonces (public)
    Route::get('/{id}', [AnnonceController::class, 'show'])
        ->middleware(\App\Http\Middleware\OptionalSanctumAuth::class)
        ->where('id', '[0-9]+');        // Afficher une annonce (public avec auth optionnelle)
});

// Routes publiques des colocataires (consultation)
Route::prefix('colocataires')->group(function () {
    Route::get('/', [ColocataireController::class, 'index']);       // Lister les demandes (public)
    Route::get('/{id}', [ColocataireController::class, 'show'])
        ->middleware(\App\Http\Middleware\OptionalSanctumAuth::class)
        ->where('id', '[0-9]+');        // Afficher une demande (public avec auth optionnelle)
});

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Routes du profil utilisateur
    Route::prefix('users')->group(function () {
        Route::get('/me', [UserController::class, 'getProfile']);
        Route::put('/me', [UserController::class, 'updateProfile']);
        Route::post('/me/avatar', [UserController::class, 'uploadAvatar']); // Endpoint séparé pour l'upload d'avatar (POST)
        Route::put('/me/password', [UserController::class, 'updatePassword']);
        Route::delete('/me/avatar', [UserController::class, 'deleteAvatar']);
        Route::get('/me/annonces', [UserController::class, 'getMyAnnonces']);
        Route::get('/me/views', [UserController::class, 'getViewedAnnonces']);
        Route::delete('/me/views/{annonceId}', [UserController::class, 'removeViewedAnnonce'])->where('annonceId', '[0-9]+');
        Route::get('/me/test-auth', [UserController::class, 'testAuth']);
    });

    // Routes des annonces (modification)
    // IMPORTANT: Les routes spécifiques (comme /favorites/list) doivent être AVANT /{id}
    Route::prefix('annonces')->group(function () {
        Route::get('/favorites/list', [AnnonceController::class, 'favorites']); // Liste des favoris - AVANT /{id}
        Route::post('/', [AnnonceController::class, 'store']);          // Créer une annonce
        Route::post('/{id}/favorite', [AnnonceController::class, 'toggleFavorite'])->where('id', '[0-9]+'); // Favoris
        Route::delete('/{id}/favorite', [AnnonceController::class, 'removeFavorite'])->where('id', '[0-9]+'); // Supprimer favori
        Route::put('/{id}', [AnnonceController::class, 'update'])->where('id', '[0-9]+');      // Modifier une annonce
        Route::delete('/{id}', [AnnonceController::class, 'destroy'])->where('id', '[0-9]+');  // Supprimer une annonce
    });

    // Routes des messages
    Route::prefix('messages')->group(function () {
        Route::get('/conversations', [MessageController::class, 'getConversations']);
        Route::get('/annonce/{annonceId}', [MessageController::class, 'getMessagesByAnnonce']);
        Route::post('/', [MessageController::class, 'sendMessage']);
    });

    // Routes des colocataires (modification)
    Route::prefix('colocataires')->group(function () {
        Route::get('/me/list', [ColocataireController::class, 'myColocataires']); // Mes demandes
        Route::post('/', [ColocataireController::class, 'store']);                // Créer une demande
        Route::put('/{id}', [ColocataireController::class, 'update'])->where('id', '[0-9]+');  // Modifier une demande
        Route::delete('/{id}', [ColocataireController::class, 'destroy'])->where('id', '[0-9]+'); // Supprimer une demande
        Route::post('/{id}/contact', [ColocataireController::class, 'contact'])->where('id', '[0-9]+'); // Contacter un colocataire
    });

    // Routes de l'administration (réservées aux admins)
    Route::prefix('admin')->group(function () {
        // Statistiques
        Route::get('/stats', [AdminController::class, 'getDashboardStats']);

        // Gestion des annonces
        Route::get('/annonces', [AdminController::class, 'getAllAnnonces']);
        Route::post('/annonces/{id}/moderate', [AdminController::class, 'moderateAnnonce']);
        Route::delete('/annonces/{id}', [AdminController::class, 'deleteAnnonce'])->where('id', '[0-9]+');

        // Gestion des utilisateurs
        Route::get('/users', [AdminController::class, 'getAllUsers']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser'])->where('id', '[0-9]+');
        Route::put('/users/{id}/status', [AdminController::class, 'toggleUserStatus']);

        // Gestion des messages de contact
        Route::get('/contact-messages', [ContactController::class, 'index']);
        Route::put('/contact-messages/{id}/read', [ContactController::class, 'markAsRead'])->where('id', '[0-9]+');
        Route::put('/contact-messages/{id}/treated', [ContactController::class, 'markAsTreated'])->where('id', '[0-9]+');
        Route::delete('/contact-messages/{id}', [ContactController::class, 'destroy'])->where('id', '[0-9]+');
    });
});

// Route publique pour envoyer un message de contact (pas besoin d'authentification)
Route::post('/contact', [ContactController::class, 'store']);