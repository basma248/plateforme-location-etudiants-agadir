<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Annonce;
use App\Models\UserFavorite;
use App\Models\AnnonceView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

class UserController extends Controller
{
    /**
     * Formate l'URL de l'avatar pour garantir qu'elle est absolue
     */
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
     * Helper pour logger de manière sécurisée (évite les erreurs de conversion)
     */
    private function safeLog($message, $value = null)
    {
        // S'assurer que $message est une chaîne
        $messageStr = is_string($message) ? $message : (is_array($message) ? json_encode($message) : (string)$message);
        
        if ($value === null) {
            \Log::info($messageStr);
            return;
        }
        
        // S'assurer que $value est converti en chaîne de manière sécurisée
        $valueStr = is_string($value) ? $value : json_encode($value);
        
        // Utiliser sprintf pour éviter les problèmes de concaténation
        \Log::info(sprintf('%s: %s', $messageStr, $valueStr));
    }
    
    private function formatAvatarUrl($avatar)
    {
        try {
            // Convertir en chaîne de manière sécurisée
            $avatarStr = $this->safeString($avatar);
            if (!$avatarStr) {
                return null;
            }
            
            // Si c'est déjà une URL absolue (http:// ou https://), la retourner telle quelle
            // $avatarStr est déjà une chaîne après safeString(), pas besoin de le refaire
            if (!$avatarStr) {
                return null;
            }
            
            // S'assurer que c'est bien une chaîne (double vérification)
            if (!is_string($avatarStr)) {
                \Log::error('ERREUR: $avatarStr n\'est pas une chaîne après safeString()! Type: ' . gettype($avatarStr));
                return null;
            }
            
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
            
            // S'assurer que $relativePath est une chaîne
            if (!is_string($relativePath)) {
                \Log::error('ERREUR: $relativePath n\'est pas une chaîne! Type: ' . gettype($relativePath));
                return null;
            }
            
            // S'assurer que $relativePath est une chaîne valide
            $relativePath = $this->safeString($relativePath);
            if (!$relativePath) {
                \Log::error('$relativePath est vide après conversion');
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
                $this->safeLog('URL construite manuellement (fallback)', $url);
            } else {
                $this->safeLog('Storage::url() retourné', $url);
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
                $this->safeLog('URL convertie en absolue', $url);
            }
            
            // Vérifier que le fichier existe
            $relativePathStr = $this->safeString($relativePath, '');
            $fileExists = $relativePathStr ? Storage::disk('public')->exists($relativePathStr) : false;
            $logFileExists = ($fileExists ? 'OUI' : 'NON');
            if ($relativePathStr) {
                $relativePathStrSafe = $this->safeString($relativePathStr, '');
                $logFileExists = sprintf('%s - Chemin: %s', $logFileExists, $relativePathStrSafe);
            }
            $this->safeLog('Fichier existe sur disque', $logFileExists);
            
            if (!$fileExists && $relativePathStr) {
                $this->safeLog('⚠️ Le fichier avatar n\'existe pas sur le disque', $relativePathStr);
            }
            
            $finalUrl = $this->safeString($url, '');
            $avatarStrSafe = $this->safeString($avatarStr, '');
            $finalUrlSafe = $this->safeString($finalUrl, '');
            $finalLog = sprintf('%s -> %s', $avatarStrSafe, $finalUrlSafe);
            $this->safeLog('Avatar formaté final', $finalLog);
            return $finalUrl ?: null;
        } catch (\Exception $e) {
            $errorMsg = $this->safeString($e->getMessage(), 'Erreur inconnue');
            $this->safeLog('Erreur dans formatAvatarUrl', $errorMsg);
            $this->safeLog('Avatar original', $avatar);
            return null;
        }
    }
    
    /**
     * Récupère le profil de l'utilisateur connecté
     */
    public function getProfile(Request $request)
    {
        try {
            \Log::info('=== DÉBUT getProfile ===');
            $user = $request->user();
            
            if (!$user) {
                \Log::warning('getProfile: Utilisateur non authentifié');
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }
            
            \Log::info('Récupération du profil pour l\'utilisateur ID: ' . $user->id);
            
            // Initialiser les valeurs par défaut
            $annoncesCount = 0;
            $favoritesCount = 0;
            $totalVues = 0;
            $avatarUrl = null;
            
            // Compter les annonces avec gestion d'erreur
            try {
                if (method_exists($user, 'annonces')) {
                    $annoncesCount = $user->annonces()->count();
                } else {
                    $annoncesCount = \App\Models\Annonce::where('user_id', $user->id)->count();
                }
                $this->safeLog('Nombre d\'annonces trouvées', (int)$annoncesCount);
            } catch (\Exception $e) {
                $this->safeLog('Erreur lors du comptage des annonces', $e->getMessage());
                $annoncesCount = 0;
            }
            
            // Compter les favoris - utiliser la relation favoriteAnnonces (belongsToMany)
            try {
                if (method_exists($user, 'favoriteAnnonces')) {
                    $favoritesCount = $user->favoriteAnnonces()->count();
                } else {
                    // Fallback: utiliser UserFavorite directement
                    $favoritesCount = \App\Models\UserFavorite::where('user_id', $user->id)->count();
                }
                $this->safeLog('Nombre de favoris trouvés', (int)$favoritesCount);
            } catch (\Exception $e) {
                $this->safeLog('Erreur lors du comptage des favoris', $e->getMessage());
                // Fallback: essayer avec la relation favorites (HasMany vers UserFavorite)
                try {
                    $favoritesCount = \App\Models\UserFavorite::where('user_id', $user->id)->count();
                    $this->safeLog('Favoris comptés via UserFavorite', (int)$favoritesCount);
                } catch (\Exception $e2) {
                    $this->safeLog('Erreur lors du comptage des favoris (fallback)', $e2->getMessage());
                    $favoritesCount = 0;
                }
            }
            
            // Calculer les vues totales (nombre d'annonces consultées par l'utilisateur)
            try {
                // Vérifier si la table existe avant de compter
                if (\Schema::hasTable('annonce_views')) {
                    $totalVues = AnnonceView::where('user_id', $user->id)->count();
                } else {
                    \Log::warning('La table annonce_views n\'existe pas');
                    $totalVues = 0;
                }
                $this->safeLog('Vues totales calculées (annonces consultées)', sprintf('%d pour l\'utilisateur ID %d', (int)$totalVues, (int)$user->id));
            } catch (\Exception $e) {
                $this->safeLog('Erreur lors du calcul des vues', $e->getMessage());
                $totalVues = 0;
            }
            
            // Formater l'avatar avec gestion d'erreur
            try {
                // Vérifier DIRECTEMENT dans la BD avec une requête SQL (plus fiable)
                $avatarRawDirect = DB::table('users')->where('id', $user->id)->value('avatar');
                \Log::info('=== RÉCUPÉRATION AVATAR (getProfile) ===');
                $this->safeLog('Avatar depuis DB::table (direct)', $avatarRawDirect ?? 'NULL');
                
                // Lire aussi avec Eloquent pour comparaison (sans refresh pour éviter les problèmes)
                $avatarRawEloquent = $user->avatar ?? null;
                $this->safeLog('Avatar depuis Eloquent (sans refresh)', $avatarRawEloquent ?? 'NULL');
                
                // Utiliser la valeur directe de la BD (plus fiable)
                $avatarRaw = $avatarRawDirect ?? $avatarRawEloquent ?? null;
                
                // Si l'avatar existe en BD mais pas dans le modèle, le mettre à jour
                if ($avatarRawDirect && $avatarRawDirect !== $avatarRawEloquent) {
                    \Log::warning('⚠️ Incohérence détectée dans getProfile!');
                    $this->safeLog('DB direct', $avatarRawDirect);
                    $this->safeLog('Eloquent', $avatarRawEloquent ?? 'NULL');
                    // Mettre à jour le modèle
                    $user->avatar = $avatarRawDirect;
                }
                
                if ($avatarRaw) {
                    // Vérifier si c'est déjà une URL (ne devrait pas arriver si on sauvegarde correctement)
                    if (str_starts_with($avatarRaw, 'http://') || str_starts_with($avatarRaw, 'https://')) {
                        $this->safeLog('Avatar est déjà une URL (ne devrait pas arriver)', $avatarRaw);
                        $avatarUrl = $avatarRaw;
                    } else {
                        // C'est un chemin relatif, le formater en URL
                        $avatarUrl = $this->formatAvatarUrl($avatarRaw);
                        $this->safeLog('Avatar formaté depuis chemin relatif', sprintf('%s -> %s', $this->safeString($avatarRaw, ''), $avatarUrl ?? 'NULL'));
                    }
                } else {
                    $this->safeLog('Aucun avatar dans la BD pour User ID', (int)$user->id);
                    $avatarUrl = null;
                }
            } catch (\Exception $e) {
                $this->safeLog('Erreur lors du formatage de l\'avatar', $e->getMessage());
                $this->safeLog('Stack trace', $e->getTraceAsString());
                $avatarUrl = null;
            }
            
            // Construire les données du profil
            $profileData = [
                'id' => $user->id,
                'nom' => $user->nom ?? '',
                'prenom' => $user->prenom ?? '',
                'nomComplet' => trim(($user->prenom ?? '') . ' ' . ($user->nom ?? '')) ?: ($user->email ?? 'Utilisateur'),
                'email' => $user->email ?? '',
                'telephone' => $user->telephone ?? '',
                'nom_utilisateur' => $user->nom_utilisateur ?? '',
                'type_utilisateur' => $user->type_utilisateur ?? '',
                'cin' => $user->cin ?? '',
                'cne' => $user->cne ?? '',
                'avatar' => $avatarUrl,
                'email_verifie' => $user->email_verifie ?? false,
                'dateInscription' => $user->created_at ? $user->created_at->toDateString() : null,
                'annoncesPubliees' => $annoncesCount,
                'annoncesFavorites' => $favoritesCount,
                'vuesTotales' => $totalVues,
            ];
            
            \Log::info('=== PROFIL RÉCUPÉRÉ AVEC SUCCÈS ===');
            $this->safeLog('User ID', (int)$user->id);
            $this->safeLog('Avatar', $avatarUrl ?? 'NULL');
            $this->safeLog('Annonces', (int)$annoncesCount);
            $this->safeLog('Favoris', (int)$favoritesCount);
            $this->safeLog('Vues', (int)$totalVues);
            
            return response()->json([
                'success' => true,
                'data' => $profileData
            ]);
        } catch (\Exception $e) {
            \Log::error('=== ERREUR DANS getProfile ===');
            $this->safeLog('Message', $e->getMessage());
            $this->safeLog('Fichier', sprintf('%s:%d', $e->getFile(), $e->getLine()));
            $this->safeLog('Stack trace', $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Met à jour le profil de l'utilisateur connecté
     */
    public function updateProfile(Request $request)
    {
        \Log::info('=== DÉBUT updateProfile ===');
        \Log::info('User ID: ' . ($request->user() ? $request->user()->id : 'NULL'));
        \Log::info('Method: ' . $request->method());
        \Log::info('Content-Type: ' . ($request->header('Content-Type') ?? 'NULL'));
        \Log::info('Content-Length: ' . ($request->header('Content-Length') ?? 'NULL'));
        
        // Vérifier les limites PHP AVANT de vérifier les fichiers
        \Log::info('PHP upload_max_filesize: ' . ini_get('upload_max_filesize'));
        \Log::info('PHP post_max_size: ' . ini_get('post_max_size'));
        \Log::info('PHP max_file_uploads: ' . ini_get('max_file_uploads'));
        \Log::info('PHP max_input_time: ' . ini_get('max_input_time'));
        \Log::info('PHP memory_limit: ' . ini_get('memory_limit'));
        
        // Vérifier $_FILES DIRECTEMENT (avant Laravel)
        \Log::info('=== VÉRIFICATION $_FILES DIRECTE ===');
        $filesExists = isset($_FILES) ? 'OUI' : 'NON';
        $this->safeLog('$_FILES existe', $filesExists);
        if (isset($_FILES)) {
            $filesKeys = array_keys($_FILES);
            $filesKeysStr = implode(', ', array_map(function($k) { return (string)$k; }, $filesKeys));
            $this->safeLog('Clés $_FILES', $filesKeysStr);
            foreach ($_FILES as $key => $file) {
                $name = (is_array($file) && isset($file['name'])) ? (string)$file['name'] : 'NULL';
                $size = (is_array($file) && isset($file['size'])) ? (string)$file['size'] : 'NULL';
                $error = (is_array($file) && isset($file['error'])) ? (string)$file['error'] : 'NULL';
                $type = (is_array($file) && isset($file['type'])) ? (string)$file['type'] : 'NULL';
                $keyStr = $this->safeString($key, 'unknown');
                $logMsg = sprintf('$_FILES[%s]: name=%s, size=%s, error=%s, type=%s', $keyStr, $name, $size, $error, $type);
                \Log::info($logMsg);
            }
        } else {
            \Log::warning('$_FILES n\'existe PAS du tout!');
        }
        
        // Vérifier le body brut (pour debug)
        $rawBody = $request->getContent();
        $rawBodyLen = strlen($rawBody);
        $this->safeLog('Raw body length', (string)$rawBodyLen);
        $rawBodyPreview = substr($rawBody, 0, 500);
        $this->safeLog('Raw body preview (first 500 chars)', $rawBodyPreview);
        
        $hasFile = $request->hasFile('avatar') ? 'OUI' : 'NON';
        $this->safeLog('hasFile(avatar)', $hasFile);
        $hasAvatar = $request->has('avatar') ? 'OUI' : 'NON';
        $this->safeLog('has(avatar)', $hasAvatar);
        $allKeys = array_keys($request->all());
        $allKeysStr = implode(', ', array_map(function($k) { return (string)$k; }, $allKeys));
        $this->safeLog('All request data keys', $allKeysStr);
        $allFilesKeys = array_keys($request->allFiles());
        $allFilesKeysStr = implode(', ', array_map(function($k) { return (string)$k; }, $allFilesKeys));
        $this->safeLog('All files in request', $allFilesKeysStr);
        $inputKeys = array_keys($request->input());
        $inputKeysStr = implode(', ', array_map(function($k) { return (string)$k; }, $inputKeys));
        $this->safeLog('Request input keys', $inputKeysStr);
        
        // Vérifier si le fichier est dans $_FILES
        if (isset($_FILES['avatar'])) {
            \Log::info('✅ $_FILES[avatar] existe!');
            $avatarError = isset($_FILES['avatar']['error']) ? (string)$_FILES['avatar']['error'] : 'NULL';
            $this->safeLog('$_FILES[avatar] error', $avatarError);
            $avatarSize = isset($_FILES['avatar']['size']) ? (string)$_FILES['avatar']['size'] : 'NULL';
            $this->safeLog('$_FILES[avatar] size', $avatarSize);
            $avatarName = isset($_FILES['avatar']['name']) ? (string)$_FILES['avatar']['name'] : 'NULL';
            $this->safeLog('$_FILES[avatar] name', $avatarName);
            $avatarTmpName = isset($_FILES['avatar']['tmp_name']) ? (string)$_FILES['avatar']['tmp_name'] : 'NULL';
            $this->safeLog('$_FILES[avatar] tmp_name', $avatarTmpName);
            $avatarType = isset($_FILES['avatar']['type']) ? (string)$_FILES['avatar']['type'] : 'NULL';
            $this->safeLog('$_FILES[avatar] type', $avatarType);
        } else {
            \Log::warning('❌ $_FILES[avatar] n\'existe PAS!');
        }
        
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'avatar' => 'nullable', // Peut être un fichier ou une URL
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // IMPORTANT: Ne PAS utiliser $user->save() ici car cela peut écraser l'avatar
        // On mettra à jour les champs APRÈS l'upload de l'avatar (si présent)
        // ou directement avec DB::table si pas d'avatar
        $hasOtherFields = $request->has('nom') || $request->has('prenom') || $request->has('email') || $request->has('telephone');

        // Gérer l'upload de l'avatar (fichier)
        \Log::info('=== VÉRIFICATION FICHIER AVATAR ===');
        \Log::info('hasFile(avatar): ' . ($request->hasFile('avatar') ? 'OUI' : 'NON'));
        \Log::info('allFiles(): ' . json_encode(array_keys($request->allFiles())));
        \Log::info('$_FILES existe: ' . (isset($_FILES) ? 'OUI' : 'NON'));
        if (isset($_FILES)) {
            \Log::info('Clés $_FILES: ' . implode(', ', array_keys($_FILES)));
        }
        
        if ($request->hasFile('avatar')) {
            \Log::info('✅ Fichier avatar détecté, début de l\'upload...');
            try {
                // Valider le fichier
                $file = $request->file('avatar');
                \Log::info('Fichier reçu - Nom: ' . $file->getClientOriginalName() . ', Taille: ' . $file->getSize() . ' bytes');
                if (!$file->isValid()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fichier avatar invalide'
                    ], 422);
                }

                // Vérifier que c'est bien une image
                $mimeType = $file->getMimeType();
                if (!str_starts_with($mimeType, 'image/')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le fichier doit être une image'
                    ], 422);
                }

                // Vérifier la taille (5MB max)
                if ($file->getSize() > 5 * 1024 * 1024) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le fichier est trop volumineux (max 5MB)'
                    ], 422);
                }

                // Supprimer l'ancien avatar s'il existe et n'est pas une URL externe
                if ($user->avatar && !str_starts_with($user->avatar, 'http://') && !str_starts_with($user->avatar, 'https://')) {
                    $oldPath = str_replace('/storage/', '', parse_url($user->avatar, PHP_URL_PATH));
                    if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                // Supprimer l'ancien avatar s'il existe
                if ($user->avatar) {
                    try {
                        $oldPath = $user->avatar;
                        // Si c'est une URL, extraire le chemin
                        if (str_contains($oldPath, '/storage/')) {
                            $oldPath = str_replace('/storage/', '', parse_url($oldPath, PHP_URL_PATH));
                        }
                        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                            \Log::info('Ancien avatar supprimé: ' . $oldPath);
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Erreur lors de la suppression de l\'ancien avatar: ' . $e->getMessage());
                    }
                }
                
                // Stocker le nouveau avatar
                $extension = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'jpg';
                $filename = 'avatar_' . $user->id . '_' . time() . '.' . $extension;
                \Log::info('Tentative de stockage du fichier: ' . $filename);
                
                $path = $file->storeAs('avatars', $filename, 'public');
                \Log::info('Résultat storeAs(): ' . ($path ?: 'NULL'));
                \Log::info('Type de $path: ' . gettype($path));
                
                // Vérifier que le fichier a bien été stocké
                if (!$path) {
                    \Log::error('❌ ERREUR: storeAs() a retourné NULL ou false!');
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors du stockage du fichier: storeAs() a échoué'
                    ], 500);
                }
                
                if (!Storage::disk('public')->exists($path)) {
                    \Log::error('❌ ERREUR: Le fichier avatar n\'a pas été stocké correctement: ' . $path);
                    \Log::error('Chemin complet: ' . Storage::disk('public')->path($path));
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors du stockage du fichier: le fichier n\'existe pas après l\'upload'
                    ], 500);
                }
                
                // Sauvegarder uniquement le chemin relatif dans la base de données
                // Format: avatars/filename.jpg
                $relativePath = $path;
                \Log::info('Chemin relatif défini: ' . $relativePath);
                \Log::info('Type de $relativePath: ' . gettype($relativePath));
                \Log::info('Longueur: ' . strlen($relativePath));
                
                \Log::info('=== AVATAR UPLOADÉ ===');
                \Log::info('Path: ' . $path);
                \Log::info('Relative Path: ' . $relativePath);
                \Log::info('Fichier existe: ' . (Storage::disk('public')->exists($path) ? 'OUI' : 'NON'));
                \Log::info('User ID: ' . $user->id);
                
                // Vérifier que la colonne avatar existe
                if (!Schema::hasColumn('users', 'avatar')) {
                    \Log::error('❌ ERREUR CRITIQUE: La colonne avatar n\'existe pas dans la table users!');
                    // Créer la colonne
                    Schema::table('users', function (Blueprint $table) {
                        $table->string('avatar', 500)->nullable()->after('role');
                    });
                    \Log::info('✅ Colonne avatar créée');
                }
                
                // Sauvegarder DIRECTEMENT avec DB::table (plus fiable que Eloquent)
                \Log::info('=== SAUVEGARDE AVATAR DANS BD ===');
                \Log::info('Chemin relatif à sauvegarder: ' . $relativePath);
                \Log::info('User ID: ' . $user->id);
                \Log::info('Type de $relativePath: ' . gettype($relativePath));
                \Log::info('Valeur de $relativePath: ' . var_export($relativePath, true));
                
                // Vérifier AVANT la sauvegarde
                $avatarBefore = DB::table('users')->where('id', $user->id)->value('avatar');
                \Log::info('Avatar AVANT update: ' . ($avatarBefore ?? 'NULL'));
                
                \Log::info('Tentative de sauvegarde avec DB::table()->update()...');
                $directUpdate = DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'avatar' => $relativePath,
                        'updated_at' => now()
                    ]);
                
                \Log::info('DB::table()->update() retourné: ' . var_export($directUpdate, true));
                \Log::info('Type de retour: ' . gettype($directUpdate));
                
                // Vérifier IMMÉDIATEMENT après la sauvegarde (sans délai)
                $avatarFromDBDirect = DB::table('users')->where('id', $user->id)->value('avatar');
                \Log::info('Avatar depuis DB::table (après update, IMMÉDIAT): ' . var_export($avatarFromDBDirect, true));
                \Log::info('Type: ' . gettype($avatarFromDBDirect));
                \Log::info('Chemin attendu: ' . var_export($relativePath, true));
                \Log::info('Correspondance stricte: ' . ($avatarFromDBDirect === $relativePath ? '✅ OUI' : '❌ NON'));
                \Log::info('Correspondance lâche: ' . ($avatarFromDBDirect == $relativePath ? '✅ OUI' : '❌ NON'));
                
                // Si NULL, essayer plusieurs fois (parfois il y a un délai)
                if (!$avatarFromDBDirect) {
                    \Log::warning('⚠️ Avatar NULL après update, nouvelle tentative...');
                    sleep(1); // Attendre 1 seconde
                    $avatarFromDBDirect = DB::table('users')->where('id', $user->id)->value('avatar');
                    \Log::info('Avatar après attente: ' . var_export($avatarFromDBDirect, true));
                }
                
                if ($avatarFromDBDirect !== $relativePath) {
                    \Log::error('❌ ERREUR CRITIQUE: La sauvegarde directe a échoué!');
                    \Log::error('Attendu: ' . var_export($relativePath, true));
                    \Log::error('Obtenu: ' . var_export($avatarFromDBDirect, true));
                    
                    // Essayer avec une requête SQL brute
                    \Log::info('Tentative avec requête SQL brute...');
                    DB::statement("UPDATE users SET avatar = ? WHERE id = ?", [$relativePath, $user->id]);
                    $avatarAfterSQL = DB::table('users')->where('id', $user->id)->value('avatar');
                    \Log::info('Avatar après SQL brut: ' . var_export($avatarAfterSQL, true));
                    
                    if ($avatarAfterSQL === $relativePath) {
                        \Log::info('✅ Avatar sauvegardé avec succès via SQL brut');
                        $avatarFromDBDirect = $avatarAfterSQL;
                    } else {
                        // Essayer avec Eloquent comme dernier recours
                        \Log::info('Tentative avec Eloquent comme dernier recours...');
                        $user->avatar = $relativePath;
                        $eloquentSaved = $user->save();
                        \Log::info('Eloquent save() retourné: ' . var_export($eloquentSaved, true));
                        
                        // Vérifier à nouveau
                        $avatarAfterEloquent = DB::table('users')->where('id', $user->id)->value('avatar');
                        \Log::info('Avatar après Eloquent: ' . var_export($avatarAfterEloquent, true));
                        
                        if ($avatarAfterEloquent === $relativePath) {
                            \Log::info('✅ Avatar sauvegardé avec succès via Eloquent');
                            $avatarFromDBDirect = $avatarAfterEloquent;
                        } else {
                            \Log::error('❌ ÉCHEC TOTAL: Aucune méthode n\'a fonctionné!');
                            Storage::disk('public')->delete($path);
                            return response()->json([
                                'success' => false,
                                'message' => 'Erreur critique: Impossible de sauvegarder l\'avatar dans la base de données. Vérifiez les logs pour plus de détails.'
                            ], 500);
                        }
                    }
                } else {
                    \Log::info('✅ Avatar correctement sauvegardé dans la BD via DB::table: ' . $avatarFromDBDirect);
                }
                
                // IMPORTANT: Ne PAS appeler refresh() ici car cela peut écraser l'avatar
                // Au lieu de cela, recharger l'utilisateur depuis la BD pour avoir la valeur à jour
                $user = User::find($user->id);
                
                // Vérifier que l'avatar est bien dans la BD après le rechargement
                $avatarAfterReload = DB::table('users')->where('id', $user->id)->value('avatar');
                \Log::info('Avatar après rechargement User::find() depuis DB: ' . ($avatarAfterReload ?? 'NULL'));
                
                if ($avatarAfterReload !== $relativePath) {
                    \Log::error('❌ ERREUR: Avatar perdu après rechargement!');
                    \Log::error('Attendu: ' . $relativePath);
                    \Log::error('Obtenu: ' . ($avatarAfterReload ?? 'NULL'));
                    // Forcer la mise à jour
                    DB::table('users')->where('id', $user->id)->update(['avatar' => $relativePath]);
                    $user = User::find($user->id);
                    \Log::info('Avatar forcé dans la BD et rechargé');
                }
                
                // S'assurer que l'avatar est dans les attributs du modèle
                $user->avatar = $relativePath;
                \Log::info('Avatar défini dans le modèle User: ' . $user->avatar);
                
                // Formater l'URL de l'avatar pour la réponse immédiate
                $avatarUrl = $this->formatAvatarUrl($relativePath);
                \Log::info('Avatar URL formatée: ' . ($avatarUrl ?? 'NULL'));
                
                // Marquer que l'avatar a déjà été sauvegardé
                $avatarAlreadySaved = true;
                
                // IMPORTANT: Sauvegarder les autres champs SÉPARÉMENT pour éviter d'écraser l'avatar
                // Ne PAS utiliser $user->save() car cela peut écraser l'avatar
                if ($request->has('nom') || $request->has('prenom') || $request->has('email') || $request->has('telephone')) {
                    \Log::info('Sauvegarde des autres champs SÉPARÉMENT (sans toucher à l\'avatar)...');
                    
                    // Sauvegarder les autres champs avec DB::table pour ne pas toucher à l'avatar
                    $updateData = [];
                    if ($request->has('nom')) $updateData['nom'] = $request->nom;
                    if ($request->has('prenom')) $updateData['prenom'] = $request->prenom;
                    if ($request->has('email')) {
                        $updateData['email'] = $request->email;
                        // Si l'email change, réinitialiser la vérification
                        $oldEmail = DB::table('users')->where('id', $user->id)->value('email');
                        if ($request->email !== $oldEmail) {
                            $updateData['email_verifie'] = false;
                        }
                    }
                    if ($request->has('telephone')) $updateData['telephone'] = $request->telephone;
                    $updateData['updated_at'] = now();
                    
                    // NE PAS inclure l'avatar dans cette mise à jour
                    DB::table('users')->where('id', $user->id)->update($updateData);
                    \Log::info('Autres champs sauvegardés avec DB::table (avatar préservé)');
                    
                    // Vérifier que l'avatar est toujours là après la mise à jour
                    $avatarAfterUpdate = DB::table('users')->where('id', $user->id)->value('avatar');
                    \Log::info('Avatar après update des autres champs (depuis DB): ' . ($avatarAfterUpdate ?? 'NULL'));
                    if ($avatarAfterUpdate !== $relativePath) {
                        \Log::error('❌ ERREUR: Avatar perdu après update des autres champs! Réinitialisation...');
                        // Réinitialiser l'avatar directement dans la BD
                        DB::table('users')->where('id', $user->id)->update(['avatar' => $relativePath]);
                        \Log::info('Avatar réinitialisé dans la BD');
                    }
                    
                    // Recharger l'utilisateur
                    $user = User::find($user->id);
                }
            } catch (\Exception $e) {
                \Log::error('Erreur lors de l\'upload de l\'avatar: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'upload de l\'avatar: ' . $e->getMessage()
                ], 500);
            }
        }

        // Sauvegarder les autres champs (si l'avatar n'a pas déjà été sauvegardé avec les autres champs)
        // IMPORTANT: Utiliser DB::table pour éviter d'écraser l'avatar
        if ((!isset($avatarAlreadySaved) || !$avatarAlreadySaved) && $hasOtherFields) {
            \Log::info('Sauvegarde des autres champs (pas d\'avatar uploadé)...');
            
            $updateData = [];
            if ($request->has('nom')) $updateData['nom'] = $request->nom;
            if ($request->has('prenom')) $updateData['prenom'] = $request->prenom;
            if ($request->has('email')) {
                $updateData['email'] = $request->email;
                // Si l'email change, réinitialiser la vérification
                $oldEmail = DB::table('users')->where('id', $user->id)->value('email');
                if ($request->email !== $oldEmail) {
                    $updateData['email_verifie'] = false;
                }
            }
            if ($request->has('telephone')) $updateData['telephone'] = $request->telephone;
            $updateData['updated_at'] = now();
            
            // Sauvegarder avec DB::table pour ne pas toucher à l'avatar
            $updated = DB::table('users')->where('id', $user->id)->update($updateData);
            \Log::info('Autres champs sauvegardés avec DB::table: ' . $updated . ' ligne(s) modifiée(s)');
            
            if ($updated === false) {
                \Log::error('Erreur lors de la sauvegarde des autres champs pour l\'utilisateur ID: ' . $user->id);
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la sauvegarde du profil'
                ], 500);
            }
        }
        
        // IMPORTANT: Lire DIRECTEMENT depuis la BD AVANT toute autre opération
        $avatarFromDBDirect = DB::table('users')->where('id', $user->id)->value('avatar');
        \Log::info('=== FIN updateProfile - Vérification finale ===');
        \Log::info('Avatar dans la BD (raw) depuis DB direct: ' . ($avatarFromDBDirect ?? 'NULL') . ' pour User ID: ' . $user->id);
        
        // Si un avatar a été uploadé mais n'est pas dans la BD, le forcer
        if (isset($avatarAlreadySaved) && $avatarAlreadySaved && isset($relativePath) && !$avatarFromDBDirect) {
            \Log::error('❌ ERREUR CRITIQUE: Avatar uploadé mais perdu dans la BD!');
            \Log::error('Réinitialisation de l\'avatar dans la BD...');
            DB::table('users')->where('id', $user->id)->update(['avatar' => $relativePath]);
            $avatarFromDBDirect = DB::table('users')->where('id', $user->id)->value('avatar');
            \Log::info('Avatar réinitialisé: ' . ($avatarFromDBDirect ?? 'NULL'));
        }
        
        // Recharger l'utilisateur depuis la BD si nécessaire
        if (!isset($avatarAlreadySaved) || !$avatarAlreadySaved) {
            $user = User::find($user->id);
        } else {
            // Si l'avatar a été sauvegardé, recharger l'utilisateur pour avoir la valeur à jour
            $user = User::find($user->id);
        }
        
        // Utiliser la valeur directe de la BD (plus fiable)
        $avatarFromDB = $avatarFromDBDirect;
        
        // Si l'avatar existe en BD mais pas dans le modèle, le mettre à jour
        if ($avatarFromDB && $user->avatar !== $avatarFromDB) {
            \Log::warning('⚠️ Avatar présent en BD mais différent dans le modèle!');
            \Log::warning('Modèle: ' . ($user->avatar ?? 'NULL'));
            \Log::warning('BD direct: ' . $avatarFromDB);
            $user->avatar = $avatarFromDB;
        }
        
        // Formater l'URL de l'avatar pour la réponse
        // Si l'avatar a été uploadé dans cette requête, utiliser la variable $avatarUrl déjà définie
        if (!isset($avatarUrl) || !$avatarUrl) {
            if ($avatarFromDB) {
                $avatarUrl = $this->formatAvatarUrl($avatarFromDB);
                \Log::info('Avatar formaté pour la réponse: ' . ($avatarUrl ?? 'NULL'));
            } else {
                $avatarUrl = null;
                \Log::info('Aucun avatar à formater');
            }
        } else {
            \Log::info('Utilisation de l\'avatar URL déjà formatée: ' . $avatarUrl);
        }
        
        // VÉRIFICATION FINALE CRITIQUE: S'assurer que l'avatar est bien dans la BD
        // Cette vérification est CRUCIALE car elle garantit que l'avatar persiste
        $finalCheck = DB::table('users')->where('id', $user->id)->value('avatar');
        \Log::info('=== VÉRIFICATION FINALE CRITIQUE ===');
        \Log::info('Avatar dans BD (vérification finale): ' . ($finalCheck ?? 'NULL'));
        \Log::info('$relativePath défini: ' . (isset($relativePath) ? 'OUI' : 'NON'));
        if (isset($relativePath)) {
            \Log::info('Valeur de $relativePath: ' . $relativePath);
        }
        
        // Si un avatar a été uploadé mais n'est pas dans la BD, LE FORCER
        if (isset($relativePath) && isset($avatarAlreadySaved) && $avatarAlreadySaved) {
            if ($finalCheck !== $relativePath) {
                \Log::error('❌ ERREUR CRITIQUE: Avatar uploadé mais perdu dans la BD!');
                \Log::error('Attendu: ' . $relativePath);
                \Log::error('Obtenu: ' . ($finalCheck ?? 'NULL'));
                \Log::error('FORCEMENT de la sauvegarde...');
                
                // Forcer la sauvegarde avec plusieurs méthodes
                $forced1 = DB::table('users')->where('id', $user->id)->update(['avatar' => $relativePath]);
                \Log::info('DB::table()->update() forcé: ' . $forced1);
                
                // Vérifier immédiatement
                $checkAfterForce = DB::table('users')->where('id', $user->id)->value('avatar');
                \Log::info('Avatar après force DB::table: ' . ($checkAfterForce ?? 'NULL'));
                
                if ($checkAfterForce !== $relativePath) {
                    // Essayer avec SQL brut
                    \Log::error('DB::table() a échoué, essai avec SQL brut...');
                    DB::statement("UPDATE users SET avatar = ? WHERE id = ?", [$relativePath, $user->id]);
                    $checkAfterSQL = DB::table('users')->where('id', $user->id)->value('avatar');
                    \Log::info('Avatar après force SQL brut: ' . ($checkAfterSQL ?? 'NULL'));
                    
                    if ($checkAfterSQL !== $relativePath) {
                        \Log::error('❌ ÉCHEC TOTAL: Impossible de forcer la sauvegarde!');
                        return response()->json([
                            'success' => false,
                            'message' => 'Erreur critique: Impossible de sauvegarder l\'avatar. Vérifiez les permissions de la base de données.'
                        ], 500);
                    } else {
                        $finalCheck = $checkAfterSQL;
                        \Log::info('✅ Avatar forcé avec succès via SQL brut');
                    }
                } else {
                    $finalCheck = $checkAfterForce;
                    \Log::info('✅ Avatar forcé avec succès via DB::table');
                }
                
                $avatarUrl = $this->formatAvatarUrl($relativePath);
                \Log::info('Avatar URL formatée après force: ' . ($avatarUrl ?? 'NULL'));
            } else {
                \Log::info('✅ Avatar correctement présent dans la BD');
            }
        }
        
        \Log::info('=== PROFIL MIS À JOUR ===');
        \Log::info('User ID: ' . $user->id);
        \Log::info('Avatar dans BD (raw): ' . ($avatarFromDB ?? 'NULL'));
        \Log::info('Avatar formaté (URL): ' . ($avatarUrl ?? 'NULL'));
        \Log::info('$avatarUrl défini: ' . (isset($avatarUrl) ? 'OUI' : 'NON'));
        \Log::info('$avatarAlreadySaved défini: ' . (isset($avatarAlreadySaved) ? 'OUI' : 'NON'));
        \Log::info('$relativePath défini: ' . (isset($relativePath) ? 'OUI' : 'NON'));
        if (isset($relativePath)) {
            \Log::info('Valeur de $relativePath: ' . $relativePath);
        }
        \Log::info('Fichier existe: ' . ($avatarFromDB && Storage::disk('public')->exists($avatarFromDB) ? 'OUI' : 'NON'));

        // S'assurer que l'avatar est bien formaté avant de le retourner
        $finalAvatarUrl = $avatarUrl ?? null;
        
        // Si l'avatar a été uploadé mais $avatarUrl est NULL, le récupérer depuis la BD
        if (!$finalAvatarUrl && isset($avatarAlreadySaved) && $avatarAlreadySaved && isset($relativePath)) {
            \Log::warning('⚠️ Avatar uploadé mais $avatarUrl est NULL! Récupération depuis la BD...');
            $avatarFromBDCheck = DB::table('users')->where('id', $user->id)->value('avatar');
            \Log::info('Avatar depuis BD (dernière vérification): ' . ($avatarFromBDCheck ?? 'NULL'));
            
            if ($avatarFromBDCheck) {
                $finalAvatarUrl = $this->formatAvatarUrl($avatarFromBDCheck);
                \Log::info('Avatar récupéré et formaté: ' . ($finalAvatarUrl ?? 'NULL'));
            } else {
                // Forcer la sauvegarde une dernière fois
                \Log::error('❌ Avatar toujours NULL dans la BD! Dernière tentative de sauvegarde...');
                DB::table('users')->where('id', $user->id)->update(['avatar' => $relativePath]);
                $avatarFromBDCheck = DB::table('users')->where('id', $user->id)->value('avatar');
                if ($avatarFromBDCheck) {
                    $finalAvatarUrl = $this->formatAvatarUrl($avatarFromBDCheck);
                    \Log::info('Avatar sauvegardé et formaté (dernière tentative): ' . ($finalAvatarUrl ?? 'NULL'));
                }
            }
        }
        
        if ($finalAvatarUrl && !str_starts_with($finalAvatarUrl, 'http://') && !str_starts_with($finalAvatarUrl, 'https://')) {
            // Si l'URL n'est pas absolue, la formater à nouveau
            $finalAvatarUrl = $this->formatAvatarUrl($avatarFromDB);
            \Log::info('Avatar re-formaté pour la réponse finale: ' . ($finalAvatarUrl ?? 'NULL'));
        }
        
        \Log::info('=== RÉPONSE FINALE updateProfile ===');
        \Log::info('Avatar dans la réponse: ' . ($finalAvatarUrl ?? 'NULL'));
        \Log::info('Avatar dans BD (vérification finale): ' . (DB::table('users')->where('id', $user->id)->value('avatar') ?? 'NULL'));
        
        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'nomComplet' => trim(($user->prenom ?? '') . ' ' . ($user->nom ?? '')) ?: ($user->email ?? 'Utilisateur'),
                'email' => $user->email,
                'telephone' => $user->telephone,
                'avatar' => $finalAvatarUrl, // Toujours retourner l'URL formatée
                'email_verifie' => $user->email_verifie ?? false,
            ]
        ]);
    }

    /**
     * Change le mot de passe de l'utilisateur connecté
     */
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ancienMotDePasse' => 'required|string',
            'nouveauMotDePasse' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Vérifier l'ancien mot de passe
        if (!Hash::check($request->ancienMotDePasse, $user->mot_de_passe)) {
            return response()->json([
                'success' => false,
                'message' => 'L\'ancien mot de passe est incorrect'
            ], 422);
        }

        // Mettre à jour le mot de passe
        $user->mot_de_passe = Hash::make($request->nouveauMotDePasse);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }

    /**
     * Récupère les annonces de l'utilisateur connecté
     */
    public function getMyAnnonces(Request $request)
    {
        $user = $request->user();
        
        $annonces = $user->annonces()
            ->with(['images', 'equipements', 'regles'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($annonce) {
                return [
                    'id' => $annonce->id,
                    'titre' => $annonce->titre,
                    'zone' => $annonce->zone,
                    'prix' => (float) $annonce->prix,
                    'type' => $annonce->type,
                    'statut' => $annonce->statut,
                    'vues' => $annonce->vues ?? 0,
                    'contacts' => $annonce->contacts ?? 0,
                    'main_image' => $annonce->main_image,
                    'created_at' => $annonce->created_at ? $annonce->created_at->toISOString() : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $annonces
        ]);
    }

    /**
     * Récupère les annonces consultées (vues) par l'utilisateur connecté
     */
    public function getViewedAnnonces(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            \Log::info('Récupération des annonces vues pour l\'utilisateur ID: ' . $user->id);

            // Vérifier d'abord combien d'enregistrements existent dans annonce_views
            $viewsCount = \App\Models\AnnonceView::where('user_id', $user->id)->count();
            \Log::info('Nombre total d\'enregistrements dans annonce_views pour l\'utilisateur: ' . $viewsCount);

            // Récupérer les IDs des annonces vues depuis annonce_views
            $viewedAnnonceIds = \App\Models\AnnonceView::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->pluck('annonce_id')
                ->toArray();
            
            \Log::info('IDs des annonces vues: ' . json_encode($viewedAnnonceIds));

            // Si aucune annonce vue, retourner un tableau vide
            if (empty($viewedAnnonceIds)) {
                \Log::info('Aucune annonce vue trouvée pour l\'utilisateur');
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }

            // Récupérer les annonces correspondantes (uniquement les approuvées)
            $viewedAnnonces = \App\Models\Annonce::whereIn('id', $viewedAnnonceIds)
                ->where('statut', 'approuve')
                ->with(['images', 'equipements', 'regles', 'user'])
                ->get()
                ->sortBy(function ($annonce) use ($viewedAnnonceIds) {
                    return array_search($annonce->id, $viewedAnnonceIds);
                })
                ->values();

            \Log::info('Nombre d\'annonces vues récupérées (après filtres): ' . $viewedAnnonces->count());

            // Récupérer les dates de consultation depuis annonce_views
            $viewDates = \App\Models\AnnonceView::where('user_id', $user->id)
                ->whereIn('annonce_id', $viewedAnnonceIds)
                ->pluck('created_at', 'annonce_id')
                ->toArray();

            $viewedAnnonces = $viewedAnnonces->map(function ($annonce) use ($user, $viewDates) {
                    // Calculer les images
                    $imageUrls = [];
                    if ($annonce->images && $annonce->images->count() > 0) {
                        foreach ($annonce->images as $image) {
                            if ($image->image_url) {
                                $url = $image->image_url;
                                if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                                    if (str_starts_with($url, '/storage/')) {
                                        $url = asset($url);
                                    } else {
                                        $url = asset('storage/' . $url);
                                    }
                                }
                                $imageUrls[] = $url;
                            }
                        }
                    }

                    // Image principale
                    $mainImage = !empty($imageUrls) ? $imageUrls[0] : null;

                    // Vérifier si l'annonce est en favori
                    $isFavorite = false;
                    if ($user) {
                        $isFavorite = $user->isFavorited($annonce);
                    }

                    return [
                        'id' => $annonce->id,
                        'titre' => $annonce->titre,
                        'type' => $annonce->type,
                        'zone' => $annonce->zone,
                        'adresse' => $annonce->adresse,
                        'prix' => (float) $annonce->prix,
                        'surface' => $annonce->surface ? (float) $annonce->surface : null,
                        'nb_chambres' => $annonce->nb_chambres ?? 1,
                        'description' => $annonce->description,
                        'description_longue' => $annonce->description_longue,
                        'meuble' => (bool) $annonce->meuble,
                        'disponibilite' => $annonce->disponibilite,
                        'statut' => $annonce->statut,
                        'rating' => $annonce->rating ? (float) $annonce->rating : 0,
                        'nb_avis' => $annonce->nb_avis ?? 0,
                        'vues' => $annonce->vues ?? 0,
                        'contacts' => $annonce->contacts ?? 0,
                        'main_image' => $mainImage,
                        'images' => $imageUrls,
                        'equipements' => $annonce->equipements ? $annonce->equipements->pluck('equipement')->toArray() : [],
                        'regles' => $annonce->regles ? $annonce->regles->pluck('regle')->toArray() : [],
                        'user' => $annonce->user ? [
                            'id' => $annonce->user->id,
                            'nom' => $annonce->user->nom ?? '',
                            'prenom' => $annonce->user->prenom ?? '',
                            'nomComplet' => trim(($annonce->user->prenom ?? '') . ' ' . ($annonce->user->nom ?? '')) ?: ($annonce->user->email ?? 'Utilisateur'),
                            'email' => $annonce->user->email ?? '',
                            'telephone' => $annonce->user->telephone ?? '',
                            'avatar' => $annonce->user->avatar ?? $annonce->user->profile_image ?? null,
                        ] : null,
                        'is_favorite' => $isFavorite,
                        'created_at' => $annonce->created_at ? $annonce->created_at->toISOString() : null,
                        'updated_at' => $annonce->updated_at ? $annonce->updated_at->toISOString() : null,
                        'viewed_at' => isset($viewDates[$annonce->id]) && $viewDates[$annonce->id] ? $viewDates[$annonce->id]->toISOString() : null,
                    ];
                });

            \Log::info('Annonces vues retournées: ' . $viewedAnnonces->count());

            return response()->json([
                'success' => true,
                'data' => $viewedAnnonces
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des annonces vues: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des annonces vues: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une annonce de la liste des vues de l'utilisateur
     */
    public function removeViewedAnnonce(Request $request, $annonceId)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $view = \App\Models\AnnonceView::where('user_id', $user->id)
                ->where('annonce_id', $annonceId)
                ->first();

            if (!$view) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vue non trouvée'
                ], 404);
            }

            $view->delete();

            return response()->json([
                'success' => true,
                'message' => 'Annonce retirée de vos vues'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression de la vue: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Endpoint de test pour vérifier l'authentification
     */
    public function testAuth(Request $request)
    {
        $token = $request->bearerToken();
        $user = $request->user();
        
        \Log::info('=== Test Auth ===');
        $this->safeLog('Token présent', $token ? 'oui' : 'non');
        $userInfo = $user ? sprintf('User ID %d', (int)$user->id) : 'null';
        $this->safeLog('User via $request->user()', $userInfo);
        
        // Essayer de trouver le token manuellement
        $manualUser = null;
        if ($token) {
            try {
                $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                if ($accessToken && $accessToken->tokenable) {
                    $manualUser = $accessToken->tokenable;
                    $this->safeLog('User via token manuel', sprintf('User ID %d', (int)$manualUser->id));
                }
            } catch (\Exception $e) {
                $this->safeLog('Erreur', $e->getMessage());
            }
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'token_present' => !!$token,
                'user_via_request' => $user ? ['id' => $user->id, 'email' => $user->email] : null,
                'user_via_manual' => $manualUser ? ['id' => $manualUser->id, 'email' => $manualUser->email] : null,
            ]
        ]);
    }

    /**
     * Supprime l'avatar de l'utilisateur connecté
     */
    /**
     * Upload l'avatar de l'utilisateur connecté (POST - pour éviter les problèmes avec PUT et multipart/form-data)
     */
    public function uploadAvatar(Request $request)
    {
        // Activer le rapport d'erreurs pour capturer toutes les erreurs
        error_reporting(E_ALL);
        ini_set('display_errors', 0); // Ne pas afficher, juste logger
        ini_set('log_errors', 1);
        
        // Handler personnalisé pour capturer "Array to string conversion"
        set_error_handler(function($errno, $errstr, $errfile, $errline) {
            if (strpos($errstr, 'Array to string conversion') !== false) {
                \Log::error(sprintf('ERREUR CAPTURÉE: %s dans %s ligne %d', $errstr, $errfile, $errline));
                \Log::error('Stack trace: ' . json_encode(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10)));
            }
            return false; // Laisser le handler par défaut gérer
        });
        
        \Log::info('=== DÉBUT uploadAvatar (POST) ===');
        $userId = $request->user() ? (int)$request->user()->id : null;
        $this->safeLog('User ID', $userId);
        $this->safeLog('Method', $request->method());
        $this->safeLog('Content-Type', $request->header('Content-Type'));
        $this->safeLog('Content-Length', $request->header('Content-Length'));
        
        $user = $request->user();
        
        // Vérifier $_FILES DIRECTEMENT
        \Log::info('=== VÉRIFICATION $_FILES DIRECTE ===');
        $filesExists = isset($_FILES) ? 'OUI' : 'NON';
        $this->safeLog('$_FILES existe', $filesExists);
        if (isset($_FILES)) {
            $filesKeys = array_keys($_FILES);
            $filesKeysStr = implode(', ', array_map(function($k) { return (string)$k; }, $filesKeys));
            $this->safeLog('Clés $_FILES', $filesKeysStr);
            foreach ($_FILES as $key => $file) {
                $name = (is_array($file) && isset($file['name'])) ? (string)$file['name'] : 'NULL';
                $size = (is_array($file) && isset($file['size'])) ? (string)$file['size'] : 'NULL';
                $error = (is_array($file) && isset($file['error'])) ? (string)$file['error'] : 'NULL';
                $type = (is_array($file) && isset($file['type'])) ? (string)$file['type'] : 'NULL';
                $keyStr = $this->safeString($key, 'unknown');
                $logMsg = sprintf('$_FILES[%s]: name=%s, size=%s, error=%s, type=%s', $keyStr, $name, $size, $error, $type);
                \Log::info($logMsg);
            }
        }
        
        $hasFile = $request->hasFile('avatar') ? 'OUI' : 'NON';
        $this->safeLog('hasFile(avatar)', $hasFile);
        $allFilesKeys = array_keys($request->allFiles());
        $allFilesKeysStr = implode(', ', array_map(function($k) { return (string)$k; }, $allFilesKeys));
        $this->safeLog('All files in request', $allFilesKeysStr);
        
        if (!$request->hasFile('avatar')) {
            \Log::warning('❌ Aucun fichier avatar reçu');
            return response()->json([
                'success' => false,
                'message' => 'Aucun fichier avatar fourni'
            ], 422);
        }
        
        try {
            $file = $request->file('avatar');
            \Log::info('✅ Fichier avatar détecté, début de l\'upload...');
            $fileName = $this->safeString($file->getClientOriginalName(), 'unknown');
            $fileSizeNum = $file->getSize();
            $fileSize = is_numeric($fileSizeNum) ? (string)$fileSizeNum : '0';
            $this->safeLog('Fichier reçu - Nom', $fileName);
            $fileSizeWithUnit = $this->safeString($fileSize, '0') . ' bytes';
            $this->safeLog('Fichier reçu - Taille', $fileSizeWithUnit);
            
            if (!$file->isValid()) {
                \Log::error('Fichier invalide');
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier avatar invalide'
                ], 422);
            }
            
            // Vérifier que c'est bien une image
            $mimeType = $file->getMimeType();
            $mimeTypeStr = $this->safeString($mimeType, '');
            if (!$mimeTypeStr || !str_starts_with($mimeTypeStr, 'image/')) {
                $this->safeLog('Type MIME invalide', $mimeTypeStr);
                return response()->json([
                    'success' => false,
                    'message' => 'Le fichier doit être une image'
                ], 422);
            }
            
            // Supprimer l'ancien avatar s'il existe
            if ($user->avatar) {
                try {
                    $oldAvatarPath = $this->safeString($user->avatar, '');
                    if ($oldAvatarPath && Storage::disk('public')->exists($oldAvatarPath)) {
                        Storage::disk('public')->delete($oldAvatarPath);
                        $this->safeLog('✅ Ancien avatar supprimé', $oldAvatarPath);
                    }
                } catch (\Exception $e) {
                    \Log::warning('Erreur lors de la suppression de l\'ancien avatar: ' . $e->getMessage());
                }
            }
            
            // Générer un nom de fichier unique
            $extension = $this->safeString($file->getClientOriginalExtension(), 'jpg');
            $userId = (int)$user->id;
            $timestamp = time();
            $uniqueId = uniqid();
            $filename = sprintf('avatar_%d_%d_%s.%s', $userId, $timestamp, $uniqueId, $extension);
            
            // Stocker le fichier
            $relativePath = $file->storeAs('avatars', $filename, 'public');
            \Log::info('=== AVATAR UPLOADÉ ===');
            
            // S'assurer que $relativePath est une chaîne (storeAs() devrait retourner une chaîne, mais vérifions)
            $relativePathStr = $this->safeString($relativePath, '');
            if (!$relativePathStr) {
                \Log::error('ERREUR: storeAs() a retourné une valeur invalide: ' . json_encode($relativePath));
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors du stockage du fichier'
                ], 500);
            }
            
            $this->safeLog('Relative Path', $relativePathStr);
            
            // Sauvegarder le chemin dans la base de données
            $directUpdate = DB::table('users')->where('id', $user->id)->update([
                'avatar' => $relativePathStr,
                'updated_at' => now()
            ]);
            $this->safeLog('DB::table()->update() retourné', $directUpdate);
            
            // Vérifier immédiatement
            $avatarFromDB = DB::table('users')->where('id', $user->id)->value('avatar');
            $this->safeLog('Avatar dans BD (après update)', $avatarFromDB);
            
            // S'assurer que $avatarFromDB est une chaîne
            $avatarFromDBStr = $this->safeString($avatarFromDB, '');
            
            if ($avatarFromDBStr !== $relativePathStr) {
                \Log::warning('Avatar non sauvegardé correctement, nouvelle tentative...');
                // Nouvelle tentative avec SQL brut
                DB::statement('UPDATE users SET avatar = ?, updated_at = ? WHERE id = ?', [
                    $relativePathStr,
                    now(),
                    $user->id
                ]);
                $avatarFromDB = DB::table('users')->where('id', $user->id)->value('avatar');
                $avatarFromDBStr = $this->safeString($avatarFromDB, '');
                $this->safeLog('Avatar dans BD (après SQL brut)', $avatarFromDBStr);
            }
            
            // Formater l'URL de manière sécurisée
            $avatarUrl = $this->formatAvatarUrl($relativePathStr);
            
            // S'assurer que $avatarUrl est une chaîne ou null (pas un tableau)
            $avatarUrlFinal = null;
            if ($avatarUrl !== null) {
                if (is_string($avatarUrl)) {
                    $avatarUrlFinal = $avatarUrl;
                } elseif (is_array($avatarUrl)) {
                    \Log::error('ERREUR CRITIQUE: $avatarUrl est un tableau! Valeur: ' . json_encode($avatarUrl));
                    $avatarUrlFinal = !empty($avatarUrl) ? (string)reset($avatarUrl) : null;
                } else {
                    $avatarUrlFinal = (string)$avatarUrl;
                }
            }
            
            // Recharger l'utilisateur depuis la BD pour avoir les données les plus récentes
            $user->refresh();
            
            // Vérification finale avant la réponse
            if ($avatarUrlFinal !== null && !is_string($avatarUrlFinal)) {
                \Log::error('ERREUR FINALE: $avatarUrlFinal n\'est pas une chaîne avant la réponse JSON! Type: ' . gettype($avatarUrlFinal) . ' - Valeur: ' . json_encode($avatarUrlFinal));
                $avatarUrlFinal = null;
            }
            
            // Construire la réponse avec des types garantis (tous primitifs)
            $userId = (int)$user->id;
            $avatarValue = $avatarUrlFinal; // null ou string, jamais array
            
            $responseData = [
                'success' => true,
                'message' => 'Avatar uploadé avec succès',
                'data' => [
                    'id' => $userId,
                    'avatar' => $avatarValue
                ]
            ];
            
            $this->safeLog('Réponse JSON préparée', $responseData);
            
            // Utiliser json_encode manuellement pour plus de contrôle et éviter les erreurs
            try {
                $jsonResponse = json_encode($responseData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                if ($jsonResponse === false) {
                    \Log::error('Erreur json_encode: ' . json_last_error_msg());
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors de la préparation de la réponse'
                    ], 500);
                }
                return response($jsonResponse, 200)->header('Content-Type', 'application/json');
            } catch (\Exception $e) {
                \Log::error('Erreur lors de la création de la réponse JSON: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la création de la réponse'
                ], 500);
            }
            
        } catch (\Exception $e) {
            $errorMsg = $this->safeString($e->getMessage(), 'Erreur inconnue');
            $this->safeLog('Erreur lors de l\'upload de l\'avatar', $errorMsg);
            $this->safeLog('Stack trace', $e->getTraceAsString());
            $this->safeLog('Fichier', $e->getFile() . ':' . $e->getLine());
            
            // Vérifier si c'est une erreur "Array to string conversion"
            if (strpos($errorMsg, 'Array to string') !== false || strpos($e->getMessage(), 'Array to string') !== false) {
                \Log::error('⚠️⚠️⚠️ ERREUR "Array to string conversion" DÉTECTÉE! ⚠️⚠️⚠️');
                \Log::error('Fichier: ' . $e->getFile());
                \Log::error('Ligne: ' . $e->getLine());
                \Log::error('Message: ' . $e->getMessage());
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload de l\'avatar: ' . $errorMsg
            ], 500);
        } finally {
            // Restaurer le handler d'erreur par défaut
            restore_error_handler();
        }
    }

    public function deleteAvatar(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            \Log::info('=== SUPPRESSION AVATAR ===');
            \Log::info('User ID: ' . $user->id);
            \Log::info('Avatar actuel: ' . ($user->avatar ?? 'NULL'));

            // Supprimer le fichier du disque
            if ($user->avatar) {
                try {
                    $avatarPath = $user->avatar;
                    // Si c'est une URL, extraire le chemin
                    if (str_contains($avatarPath, '/storage/')) {
                        $avatarPath = str_replace('/storage/', '', parse_url($avatarPath, PHP_URL_PATH));
                    }
                    
                    if ($avatarPath && Storage::disk('public')->exists($avatarPath)) {
                        Storage::disk('public')->delete($avatarPath);
                        \Log::info('✅ Fichier avatar supprimé du disque: ' . $avatarPath);
                    } else {
                        \Log::warning('Fichier avatar non trouvé sur le disque: ' . $avatarPath);
                    }
                } catch (\Exception $e) {
                    \Log::warning('Erreur lors de la suppression du fichier avatar: ' . $e->getMessage());
                }
            }

            // Supprimer l'avatar de la base de données
            $user->avatar = null;
            $saved = $user->save();
            
            if (!$saved) {
                \Log::error('Erreur lors de la suppression de l\'avatar dans la BD');
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la suppression de l\'avatar'
                ], 500);
            }
            
            $user->refresh();

            \Log::info('✅ Avatar supprimé de la BD pour User ID: ' . $user->id);

            return response()->json([
                'success' => true,
                'message' => 'Avatar supprimé avec succès',
                'data' => [
                    'id' => $user->id,
                    'avatar' => null
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression de l\'avatar: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'avatar: ' . $e->getMessage()
            ], 500);
        }
    }
}

