<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Envoyer un message de contact à l'admin
     */
    public function store(Request $request)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'type' => 'required|string|in:question,reclamation,contrainte,suggestion,annonce,technique,autre',
                'sujet' => 'required|string|max:255',
                'message' => 'required|string|min:10',
                'telephone' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Les données fournies sont invalides.',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérifier si la table existe, sinon la créer
            if (!DB::getSchemaBuilder()->hasTable('contact_messages')) {
                // Créer la table si elle n'existe pas
                DB::statement('CREATE TABLE IF NOT EXISTS contact_messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nom VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    telephone VARCHAR(20),
                    type ENUM(\'question\', \'reclamation\', \'contrainte\', \'suggestion\', \'annonce\', \'technique\', \'autre\') NOT NULL,
                    sujet VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    lu BOOLEAN DEFAULT FALSE,
                    traite BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_lu (lu),
                    INDEX idx_traite (traite),
                    INDEX idx_type (type),
                    INDEX idx_created_at (created_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
            }

            // Insérer le message dans la base de données
            $contactId = DB::table('contact_messages')->insertGetId([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone ?? null,
                'type' => $request->type,
                'sujet' => $request->sujet,
                'message' => $request->message,
                'lu' => false,
                'traite' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Log::info('Nouveau message de contact reçu', [
                'id' => $contactId,
                'email' => $request->email,
                'type' => $request->type,
                'sujet' => $request->sujet,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
                'data' => [
                    'id' => $contactId
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi du message de contact', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.'
            ], 500);
        }
    }

    /**
     * Récupérer tous les messages de contact (pour l'admin)
     */
    public function index(Request $request)
    {
        try {
            $query = DB::table('contact_messages')
                ->orderBy('created_at', 'desc');

            // Filtrer par statut lu/non lu
            if ($request->has('lu')) {
                $query->where('lu', $request->lu === 'true' ? 1 : 0);
            }

            // Filtrer par statut traité/non traité
            if ($request->has('traite')) {
                $query->where('traite', $request->traite === 'true' ? 1 : 0);
            }

            // Filtrer par type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            $messages = $query->get();

            return response()->json([
                'success' => true,
                'data' => $messages
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des messages de contact', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des messages.'
            ], 500);
        }
    }

    /**
     * Marquer un message comme lu
     */
    public function markAsRead($id)
    {
        try {
            DB::table('contact_messages')
                ->where('id', $id)
                ->update([
                    'lu' => true,
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Message marqué comme lu.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors du marquage du message comme lu', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue.'
            ], 500);
        }
    }

    /**
     * Marquer un message comme traité
     */
    public function markAsTreated($id)
    {
        try {
            DB::table('contact_messages')
                ->where('id', $id)
                ->update([
                    'traite' => true,
                    'lu' => true,
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Message marqué comme traité.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors du marquage du message comme traité', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue.'
            ], 500);
        }
    }

    /**
     * Supprimer un message de contact
     */
    public function destroy($id)
    {
        try {
            DB::table('contact_messages')
                ->where('id', $id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Message supprimé avec succès.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du message', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la suppression.'
            ], 500);
        }
    }
}

