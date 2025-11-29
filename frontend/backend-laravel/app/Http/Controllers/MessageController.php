<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Récupère les messages d'une annonce
     */
    public function getMessagesByAnnonce(Request $request, $annonceId)
    {
        $user = $request->user();
        $annonce = Annonce::findOrFail($annonceId);

        // Déterminer si l'utilisateur est le propriétaire de l'annonce
        $isProprietaire = $annonce->user_id == $user->id;
        
        // Trouver la conversation
        // Si c'est le propriétaire, chercher toutes les conversations pour cette annonce où il est propriétaire
        // Si c'est un locataire, chercher ou créer la conversation avec lui comme locataire
        if ($isProprietaire) {
            // Le propriétaire peut voir toutes les conversations pour son annonce
            // On prend la conversation la plus récente (avec le dernier message)
            $conversation = Conversation::where('annonce_id', $annonceId)
                ->where('proprietaire_id', $user->id)
                ->orderBy('updated_at', 'desc')
                ->first();
            
            if (!$conversation) {
                // Aucune conversation n'existe encore pour cette annonce
                // Retourner un tableau vide mais ne pas créer de conversation
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }
        } else {
            // Le locataire : trouver ou créer la conversation
            $conversation = Conversation::firstOrCreate(
                [
                    'annonce_id' => $annonceId,
                    'locataire_id' => $user->id,
                    'proprietaire_id' => $annonce->user_id,
                ]
            );
        }

        // Récupérer les messages
        $messages = $conversation->messages()
            ->with(['sender' => function ($query) {
                $query->select('id', 'nom', 'prenom', 'email', 'avatar');
            }])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'sender_id' => $message->sender_id,
                    'content' => $message->content,
                    'sujet' => $message->sujet,
                    'telephone' => $message->telephone,
                    'date_visite' => $message->date_visite,
                    'lu' => $message->lu,
                    'created_at' => $message->created_at->toISOString(),
                    'sender' => $message->sender ? [
                        'id' => $message->sender->id,
                        'nom' => $message->sender->nom,
                        'prenom' => $message->sender->prenom,
                        'email' => $message->sender->email,
                        'avatar' => $message->sender->avatar ?? $message->sender->profile_image ?? null,
                    ] : null,
                ];
            });

        // Marquer les messages comme lus
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Envoie un message
     */
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'annonceId' => 'required|exists:annonces,id',
            'content' => 'required|string|max:2000',
            'sujet' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'dateVisite' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $annonce = Annonce::findOrFail($request->annonceId);

        // Trouver ou créer la conversation
        $conversation = Conversation::firstOrCreate(
            [
                'annonce_id' => $request->annonceId,
                'locataire_id' => $user->id,
                'proprietaire_id' => $annonce->user_id,
            ]
        );

        // Créer le message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'content' => $request->content,
            'sujet' => $request->sujet,
            'telephone' => $request->telephone,
            'date_visite' => $request->dateVisite,
            'lu' => false,
        ]);

        $message->load(['sender' => function ($query) {
            $query->select('id', 'nom', 'prenom', 'email', 'avatar');
        }]);

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès',
            'data' => [
                'id' => $message->id,
                'conversation_id' => $message->conversation_id,
                'sender_id' => $message->sender_id,
                'content' => $message->content,
                'sujet' => $message->sujet,
                'telephone' => $message->telephone,
                'date_visite' => $message->date_visite,
                'lu' => $message->lu,
                'created_at' => $message->created_at->toISOString(),
                'sender' => $message->sender ? [
                    'id' => $message->sender->id,
                    'nom' => $message->sender->nom,
                    'prenom' => $message->sender->prenom,
                    'email' => $message->sender->email,
                    'avatar' => $message->sender->avatar ?? $message->sender->profile_image ?? null,
                ] : null,
            ]
        ], 201);
    }

    /**
     * Récupère toutes les conversations de l'utilisateur
     */
    public function getConversations(Request $request)
    {
        $user = $request->user();

        $conversations = Conversation::where(function($query) use ($user) {
                $query->where('locataire_id', $user->id)
                      ->orWhere('proprietaire_id', $user->id);
            })
            ->with([
                'annonce' => function ($query) {
                    $query->select('id', 'titre', 'prix', 'zone', 'type');
                },
                'annonce.images' => function ($query) {
                    $query->select('id', 'annonce_id', 'image_url')->orderBy('image_order')->limit(1);
                },
                'locataire' => function ($query) {
                    $query->select('id', 'nom', 'prenom', 'email', 'avatar');
                },
                'proprietaire' => function ($query) {
                    $query->select('id', 'nom', 'prenom', 'email', 'avatar');
                },
                'messages' => function ($query) {
                    $query->orderBy('created_at', 'desc')->limit(1);
                }
            ])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($user) {
                $otherUser = $conversation->getOtherUser($user->id);
                $lastMessage = $conversation->messages()->orderBy('created_at', 'desc')->first();
                $unreadCount = $conversation->unreadCount($user->id);
                
                // Récupérer la première image de l'annonce
                $firstImage = null;
                if ($conversation->annonce && $conversation->annonce->images && $conversation->annonce->images->count() > 0) {
                    $firstImage = $conversation->annonce->images->first()->image_url;
                    // Convertir en URL absolue si nécessaire
                    if ($firstImage && !str_starts_with($firstImage, 'http')) {
                        $firstImage = asset($firstImage);
                    }
                }

                return [
                    'id' => $conversation->id,
                    'annonce' => [
                        'id' => $conversation->annonce->id ?? null,
                        'titre' => $conversation->annonce->titre ?? 'Annonce',
                        'prix' => $conversation->annonce->prix ?? 0,
                        'zone' => $conversation->annonce->zone ?? '',
                        'type' => $conversation->annonce->type ?? '',
                        'image' => $firstImage,
                    ],
                    'other_user' => $otherUser ? [
                        'id' => $otherUser->id,
                        'nom' => $otherUser->nom ?? '',
                        'prenom' => $otherUser->prenom ?? '',
                        'email' => $otherUser->email ?? '',
                        'avatar' => $otherUser->avatar ?? $otherUser->profile_image ?? null,
                    ] : null,
                    'last_message' => $lastMessage ? [
                        'content' => $lastMessage->content,
                        'created_at' => $lastMessage->created_at->toISOString(),
                    ] : null,
                    'unread_count' => $unreadCount,
                    'created_at' => $conversation->created_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }
}

