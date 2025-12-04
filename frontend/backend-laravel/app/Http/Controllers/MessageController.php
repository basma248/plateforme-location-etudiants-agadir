<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Helper pour convertir une valeur en chaîne de manière sécurisée
     */
    private function safeString($value, $default = null)
    {
        if (is_null($value)) {
            return $default;
        }
        if (is_string($value)) {
            return trim($value) ?: $default;
        }
        if (is_array($value)) {
            return !empty($value) ? (string)reset($value) : $default;
        }
        if (is_object($value)) {
            return null; // Ne pas convertir les objets
        }
        $str = (string)$value;
        return ($str && $str !== 'Array') ? $str : $default;
    }
    
    /**
     * Formate l'URL de l'avatar pour garantir qu'elle est absolue
     */
    private function formatAvatarUrl($avatar)
    {
        try {
            // Convertir en chaîne de manière sécurisée
            $avatarStr = $this->safeString($avatar);
            if (!$avatarStr) {
                return null;
            }
            
            // Si c'est déjà une URL absolue (http:// ou https://), la retourner telle quelle
            if (str_starts_with($avatarStr, 'http://') || str_starts_with($avatarStr, 'https://')) {
                return $avatarStr;
            }
            
            // Si c'est un chemin qui commence par /storage/, le nettoyer
            if (str_starts_with($avatarStr, '/storage/')) {
                $relativePath = str_replace('/storage/', '', $avatarStr);
            } else {
                // Sinon, c'est probablement un chemin relatif (avatars/filename.jpg)
                $relativePath = $avatarStr;
            }
            
            // S'assurer que $relativePath est une chaîne valide
            $relativePath = $this->safeString($relativePath);
            if (!$relativePath) {
                return null;
            }
            
            // Utiliser Storage::url() pour générer l'URL complète
            $url = Storage::disk('public')->url($relativePath);
            
            // S'assurer que $url est une chaîne
            $url = $this->safeString($url);
            if (!$url) {
                // Fallback: construire l'URL manuellement
                $baseUrl = request()->getSchemeAndHttpHost();
                $relativePathStr = $this->safeString($relativePath, '');
                if ($relativePathStr) {
                    $url = sprintf('%s/storage/%s', $baseUrl, ltrim($relativePathStr, '/'));
                } else {
                    $url = null;
                }
            }
            
            if (!$url) {
                return null;
            }
            
            // Si Storage::url() retourne une URL relative, la convertir en absolue
            $urlStr = $this->safeString($url, '');
            if ($urlStr && !str_starts_with($urlStr, 'http://') && !str_starts_with($urlStr, 'https://')) {
                $baseUrl = request()->getSchemeAndHttpHost();
                // S'assurer que l'URL commence par /storage/
                if (!str_starts_with($urlStr, '/storage/')) {
                    $urlStr = sprintf('/storage/%s', ltrim($urlStr, '/'));
                }
                $urlStr = sprintf('%s/%s', $baseUrl, ltrim($urlStr, '/'));
                $url = $urlStr;
            }
            
            return $url ?: null;
        } catch (\Exception $e) {
            \Log::error('Erreur dans formatAvatarUrl: ' . $e->getMessage());
            return null;
        }
    }
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
            ->map(function ($message) use ($user, $annonce) {
                // Déterminer si le message est de l'utilisateur connecté ou du propriétaire
                $isFromCurrentUser = $message->sender_id == $user->id;
                $senderType = $isFromCurrentUser ? 'moi' : 'proprietaire';
                
                // Récupérer l'avatar directement depuis la BD pour plus de fiabilité
                $avatarRaw = null;
                if ($message->sender) {
                    // Essayer d'abord depuis le modèle
                    $avatarRaw = $message->sender->avatar ?? null;
                    
                    // Si null, récupérer directement depuis la BD
                    if (!$avatarRaw) {
                        $avatarRaw = DB::table('users')->where('id', $message->sender->id)->value('avatar');
                    }
                }
                
                return [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'sender_id' => $message->sender_id,
                    'sender' => $senderType, // Chaîne 'moi' ou 'proprietaire' pour le frontend
                    'content' => $message->content,
                    'sujet' => $message->sujet,
                    'telephone' => $message->telephone,
                    'dateVisite' => $message->date_visite ? $message->date_visite->toDateString() : null,
                    'date_visite' => $message->date_visite ? $message->date_visite->toDateString() : null,
                    'lu' => $message->lu,
                    'timestamp' => $message->created_at->toISOString(),
                    'created_at' => $message->created_at->toISOString(),
                    'sender_data' => $message->sender ? [
                        'id' => $message->sender->id,
                        'nom' => $message->sender->nom ?? '',
                        'prenom' => $message->sender->prenom ?? '',
                        'nomComplet' => trim(($message->sender->prenom ?? '') . ' ' . ($message->sender->nom ?? '')) ?: ($message->sender->email ?? 'Utilisateur'),
                        'email' => $message->sender->email ?? '',
                        'avatar' => $this->formatAvatarUrl($avatarRaw),
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

        // Déterminer si le message est de l'utilisateur connecté ou du propriétaire
        $isFromCurrentUser = $message->sender_id == $user->id;
        $senderType = $isFromCurrentUser ? 'moi' : 'proprietaire';
        
        // Récupérer l'avatar directement depuis la BD pour plus de fiabilité
        $avatarRaw = null;
        if ($message->sender) {
            // Essayer d'abord depuis le modèle
            $avatarRaw = $message->sender->avatar ?? null;
            
            // Si null, récupérer directement depuis la BD
            if (!$avatarRaw) {
                $avatarRaw = DB::table('users')->where('id', $message->sender->id)->value('avatar');
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès',
            'data' => [
                'id' => $message->id,
                'conversation_id' => $message->conversation_id,
                'sender_id' => $message->sender_id,
                'sender' => $senderType, // Chaîne 'moi' ou 'proprietaire' pour le frontend
                'content' => $message->content,
                'sujet' => $message->sujet,
                'telephone' => $message->telephone,
                'dateVisite' => $message->date_visite ? $message->date_visite->toDateString() : null,
                'date_visite' => $message->date_visite ? $message->date_visite->toDateString() : null,
                'lu' => $message->lu,
                'timestamp' => $message->created_at->toISOString(),
                'created_at' => $message->created_at->toISOString(),
                'sender_data' => $message->sender ? [
                    'id' => $message->sender->id,
                    'nom' => $message->sender->nom ?? '',
                    'prenom' => $message->sender->prenom ?? '',
                    'nomComplet' => trim(($message->sender->prenom ?? '') . ' ' . ($message->sender->nom ?? '')) ?: ($message->sender->email ?? 'Utilisateur'),
                    'email' => $message->sender->email ?? '',
                    'avatar' => $this->formatAvatarUrl($avatarRaw),
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

                // Récupérer l'avatar de l'autre utilisateur directement depuis la BD pour plus de fiabilité
                $avatarRaw = null;
                if ($otherUser) {
                    // Essayer d'abord depuis le modèle
                    $avatarRaw = $otherUser->avatar ?? null;
                    
                    // Si null, récupérer directement depuis la BD
                    if (!$avatarRaw) {
                        $avatarRaw = DB::table('users')->where('id', $otherUser->id)->value('avatar');
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
                        'nomComplet' => trim(($otherUser->prenom ?? '') . ' ' . ($otherUser->nom ?? '')) ?: ($otherUser->email ?? 'Utilisateur'),
                        'email' => $otherUser->email ?? '',
                        'avatar' => $this->formatAvatarUrl($avatarRaw),
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

