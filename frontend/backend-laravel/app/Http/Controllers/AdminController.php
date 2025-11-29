<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Constructeur - vérifie que l'utilisateur est admin
     */
    public function __construct()
    {
        // Le middleware auth:sanctum est déjà appliqué dans les routes
        // On vérifie seulement que l'utilisateur est admin dans chaque méthode
    }
    
    /**
     * Vérifie que l'utilisateur est admin
     */
    private function checkAdmin($request)
    {
        if (!$request->user()) {
            \Log::warning('Tentative d\'accès admin sans authentification');
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }
        
        if (!$request->user()->isAdmin()) {
            \Log::warning('Tentative d\'accès admin par un non-admin: ' . $request->user()->email);
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Administrateur requis.'
            ], 403);
        }
        
        return null; // Pas d'erreur
    }

    /**
     * Récupère les statistiques du dashboard
     */
    public function getDashboardStats(Request $request)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $stats = [
                'totalAnnonces' => Annonce::count(),
                'totalUsers' => User::count(),
                'annoncesEnAttente' => Annonce::where('statut', 'en_attente')->count(),
                'annoncesSignalees' => Annonce::where('statut', 'signale')->count(),
                'usersSuspendus' => User::where('suspended', true)->count(),
                'totalMessages' => 0, // TODO: Implémenter si nécessaire
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans getDashboardStats: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère toutes les annonces (pour l'admin)
     */
    public function getAllAnnonces(Request $request)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $query = Annonce::query();

            // Charger uniquement les relations essentielles
            $query->with(['user']);

            // Filtres
            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }
            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('titre', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            }

            $annonces = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $annonces
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans getAllAnnonces: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des annonces: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Modère une annonce
     */
    public function moderateAnnonce(Request $request, $id)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:approuve,rejete,signale,approuver,rejeter',
                'reason' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $annonce = Annonce::findOrFail($id);
        
        // Convertir les actions en format backend
        $action = $request->action;
        if ($action === 'approuver') {
            $action = 'approuve';
        } elseif ($action === 'rejeter') {
            $action = 'rejete';
        }
        
            $annonce->statut = $action;
            $annonce->save();

            return response()->json([
                'success' => true,
                'message' => 'Annonce modérée avec succès',
                'data' => $annonce
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans moderateAnnonce: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modération: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une annonce (admin)
     */
    public function deleteAnnonce(Request $request, $id)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $annonce = Annonce::findOrFail($id);
            $annonce->delete();

            return response()->json([
                'success' => true,
                'message' => 'Annonce supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans deleteAnnonce: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère tous les utilisateurs
     */
    public function getAllUsers(Request $request)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $query = User::query();

            // Filtres
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }
            if ($request->has('suspended')) {
                $query->where('suspended', $request->suspended);
            }
            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('nom', 'like', '%' . $request->search . '%')
                      ->orWhere('prenom', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            $users = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans getAllUsers: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crée un nouvel utilisateur (admin)
     */
    public function createUser(Request $request)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'nom_utilisateur' => 'required|string|unique:users,nom_utilisateur',
            'email' => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'type_utilisateur' => 'required|in:etudiant,loueur',
            'cin' => 'required|string|max:20',
            'cne' => 'nullable|string|max:20',
            'role' => 'nullable|in:user,admin,administrator',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'nom_utilisateur' => $request->nom_utilisateur,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'mot_de_passe' => \Hash::make($request->password),
            'type_utilisateur' => $request->type_utilisateur,
            'cin' => $request->cin,
            'cne' => $request->cne,
            'role' => $request->role ?? 'user',
            'email_verifie' => false,
        ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Erreur dans createUser: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime un utilisateur (admin)
     */
    public function deleteUser(Request $request, $id)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $user = User::findOrFail($id);
            
            // Ne pas permettre de supprimer son propre compte
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas supprimer votre propre compte'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans deleteUser: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Suspend ou active un utilisateur
     */
    public function toggleUserStatus(Request $request, $id)
    {
        try {
            // Vérifier que l'utilisateur est admin
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $validator = Validator::make($request->all(), [
                'suspended' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::findOrFail($id);
            $user->suspended = $request->suspended;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => $request->suspended ? 'Utilisateur suspendu' : 'Utilisateur activé',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans toggleUserStatus: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du changement de statut: ' . $e->getMessage()
            ], 500);
        }
    }
}

