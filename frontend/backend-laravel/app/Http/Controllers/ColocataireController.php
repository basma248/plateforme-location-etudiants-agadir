<?php

namespace App\Http\Controllers;

use App\Models\Colocataire;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ColocataireController extends Controller
{
    /**
     * Lister toutes les demandes de colocataires (avec filtres)
     */
    public function index(Request $request)
    {
        $query = Colocataire::actifs()->with(['user']);

        $filters = $request->only([
            'zone', 'type_logement', 'budget_max', 'search', 'sort_by', 'sort_direction'
        ]);

        $query->withFilters($filters);

        $colocataires = $query->paginate(12);

        $colocataires->getCollection()->transform(function ($colocataire) {
            return [
                'id' => $colocataire->id,
                'titre' => $colocataire->titre,
                'description' => $colocataire->description,
                'zone_preferee' => $colocataire->zone_preferee,
                'budget_max' => $colocataire->budget_max,
                'budget_formatted' => $colocataire->budget_formatted,
                'type_logement' => $colocataire->type_logement,
                'preferences' => $colocataire->preferences,
                'statut' => $colocataire->statut,
                'contact_email' => $colocataire->contact_email,
                'contact_telephone' => $colocataire->contact_telephone,
                'vues' => $colocataire->vues,
                'contacts' => $colocataire->contacts,
                'created_at' => $colocataire->created_at,
                'updated_at' => $colocataire->updated_at,
                'etudiant' => [
                    'id' => $colocataire->user->id,
                    'nom' => $colocataire->user->nom,
                    'prenom' => $colocataire->user->prenom,
                    'nom_complet' => $colocataire->user->full_name,
                    'avatar' => $colocataire->user->profile_image,
                    'email' => $colocataire->user->email,
                    'telephone' => $colocataire->user->telephone,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $colocataires
        ]);
    }

    /**
     * Afficher une demande de colocataire spécifique
     */
    public function show(Request $request, $id)
    {
        $colocataire = Colocataire::with(['user'])->find($id);

        if (!$colocataire) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de colocataire non trouvée'
            ], 404);
        }

        // Incrémenter les vues si l'utilisateur est authentifié et n'est pas le propriétaire
        $user = $request->user();
        if ($user && $user->id !== $colocataire->user_id) {
            $colocataire->incrementViews();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $colocataire->id,
                'titre' => $colocataire->titre,
                'description' => $colocataire->description,
                'zone_preferee' => $colocataire->zone_preferee,
                'budget_max' => $colocataire->budget_max,
                'budget_formatted' => $colocataire->budget_formatted,
                'type_logement' => $colocataire->type_logement,
                'preferences' => $colocataire->preferences,
                'statut' => $colocataire->statut,
                'contact_email' => $colocataire->contact_email,
                'contact_telephone' => $colocataire->contact_telephone,
                'vues' => $colocataire->vues,
                'contacts' => $colocataire->contacts,
                'created_at' => $colocataire->created_at,
                'updated_at' => $colocataire->updated_at,
                'etudiant' => [
                    'id' => $colocataire->user->id,
                    'nom' => $colocataire->user->nom,
                    'prenom' => $colocataire->user->prenom,
                    'nom_complet' => $colocataire->user->full_name,
                    'avatar' => $colocataire->user->profile_image,
                    'email' => $colocataire->user->email,
                    'telephone' => $colocataire->user->telephone,
                ],
            ]
        ]);
    }

    /**
     * Créer une nouvelle demande de colocataire
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:200',
            'description' => 'required|string|max:2000',
            'zone_preferee' => 'nullable|string|max:100',
            'budget_max' => 'nullable|numeric|min:0',
            'type_logement' => 'nullable|in:chambre,studio,appartement',
            'genre' => 'nullable|in:homme,femme',
            'type_recherche' => 'nullable|in:chambre_seule,chambre_partagee,studio,appartement',
            'nb_personnes_recherche' => 'nullable|integer|min:1',
            'nb_personnes_souhaitees' => 'nullable|integer|min:1', // Alias
            'preferences' => 'nullable|string|max:1000',
            'contact_email' => 'nullable|email|max:255',
            'contact_telephone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $colocataire = Colocataire::create([
                'user_id' => $request->user()->id,
                'titre' => $request->titre,
                'description' => $request->description,
                'zone_preferee' => $request->zone_preferee ?? null,
                'budget_max' => $request->budget_max ?? null,
                'type_logement' => $request->type_logement ?? null,
                'genre' => $request->genre ?? null,
                'type_recherche' => $request->type_recherche ?? null,
                'nb_personnes_recherche' => $request->nb_personnes_recherche ?? $request->nb_personnes_souhaitees ?? null,
                'preferences' => $request->preferences ?? null,
                'contact_email' => $request->contact_email ?? null,
                'contact_telephone' => $request->contact_telephone ?? null,
                'statut' => 'actif',
            ]);

            $colocataire->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Demande de colocataire créée avec succès',
                'data' => [
                    'id' => $colocataire->id,
                    'titre' => $colocataire->titre,
                    'description' => $colocataire->description,
                    'zone_preferee' => $colocataire->zone_preferee,
                    'budget_max' => $colocataire->budget_max,
                    'budget_formatted' => $colocataire->budget_formatted,
                    'type_logement' => $colocataire->type_logement,
                    'preferences' => $colocataire->preferences,
                    'statut' => $colocataire->statut,
                    'contact_email' => $colocataire->contact_email,
                    'contact_telephone' => $colocataire->contact_telephone,
                    'created_at' => $colocataire->created_at,
                    'etudiant' => [
                        'id' => $colocataire->user->id,
                        'nom' => $colocataire->user->nom,
                        'prenom' => $colocataire->user->prenom,
                        'nom_complet' => $colocataire->user->full_name,
                        'avatar' => $colocataire->user->profile_image,
                    ],
                ]
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la demande de colocataire: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la demande',
                'errors' => ['database' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Mettre à jour une demande de colocataire
     */
    public function update(Request $request, $id)
    {
        $colocataire = Colocataire::find($id);

        if (!$colocataire) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de colocataire non trouvée'
            ], 404);
        }

        // Vérifier les permissions
        if (!$colocataire->canBeEditedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de modifier cette demande'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|required|string|max:200',
            'description' => 'sometimes|required|string|max:2000',
            'zone_preferee' => 'nullable|string|max:100',
            'budget_max' => 'nullable|numeric|min:0',
            'type_logement' => 'nullable|in:chambre,studio,appartement',
            'preferences' => 'nullable|string|max:1000',
            'contact_email' => 'nullable|email|max:255',
            'contact_telephone' => 'nullable|string|max:20',
            'statut' => 'sometimes|in:actif,trouve,ferme',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $colocataire->update($request->only([
                'titre', 'description', 'zone_preferee', 'budget_max',
                'type_logement', 'preferences', 'contact_email',
                'contact_telephone', 'statut'
            ]));

            $colocataire->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Demande de colocataire mise à jour avec succès',
                'data' => [
                    'id' => $colocataire->id,
                    'titre' => $colocataire->titre,
                    'description' => $colocataire->description,
                    'zone_preferee' => $colocataire->zone_preferee,
                    'budget_max' => $colocataire->budget_max,
                    'budget_formatted' => $colocataire->budget_formatted,
                    'type_logement' => $colocataire->type_logement,
                    'preferences' => $colocataire->preferences,
                    'statut' => $colocataire->statut,
                    'contact_email' => $colocataire->contact_email,
                    'contact_telephone' => $colocataire->contact_telephone,
                    'updated_at' => $colocataire->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour de la demande de colocataire: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'errors' => ['database' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Supprimer une demande de colocataire
     */
    public function destroy(Request $request, $id)
    {
        $colocataire = Colocataire::find($id);

        if (!$colocataire) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de colocataire non trouvée'
            ], 404);
        }

        // Vérifier les permissions
        if (!$colocataire->canBeDeletedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de supprimer cette demande'
            ], 403);
        }

        try {
            $colocataire->delete();

            return response()->json([
                'success' => true,
                'message' => 'Demande de colocataire supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression de la demande de colocataire: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'errors' => ['database' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Récupérer les demandes de colocataire de l'utilisateur connecté
     */
    public function myColocataires(Request $request)
    {
        $colocataires = Colocataire::where('user_id', $request->user()->id)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        $colocataires->transform(function ($colocataire) {
            return [
                'id' => $colocataire->id,
                'titre' => $colocataire->titre,
                'description' => $colocataire->description,
                'zone_preferee' => $colocataire->zone_preferee,
                'budget_max' => $colocataire->budget_max,
                'budget_formatted' => $colocataire->budget_formatted,
                'type_logement' => $colocataire->type_logement,
                'preferences' => $colocataire->preferences,
                'statut' => $colocataire->statut,
                'contact_email' => $colocataire->contact_email,
                'contact_telephone' => $colocataire->contact_telephone,
                'vues' => $colocataire->vues,
                'contacts' => $colocataire->contacts,
                'created_at' => $colocataire->created_at,
                'updated_at' => $colocataire->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $colocataires
        ]);
    }

    /**
     * Contacter un colocataire (incrémente le compteur de contacts)
     */
    public function contact(Request $request, $id)
    {
        $colocataire = Colocataire::find($id);

        if (!$colocataire) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de colocataire non trouvée'
            ], 404);
        }

        // Ne pas compter si c'est le propriétaire de la demande
        if ($request->user() && $request->user()->id !== $colocataire->user_id) {
            $colocataire->incrementContacts();
        }

        return response()->json([
            'success' => true,
            'message' => 'Contact enregistré',
            'data' => [
                'contact_email' => $colocataire->contact_email,
                'contact_telephone' => $colocataire->contact_telephone,
            ]
        ]);
    }
}
