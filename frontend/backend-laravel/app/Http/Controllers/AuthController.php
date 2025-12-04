<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordResetToken;
use App\Mail\ResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    // Inscription
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'nom_utilisateur' => 'required|string|unique:users,nom_utilisateur',
            'email' => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            'type_utilisateur' => 'required|in:etudiant,loueur',
            'cin' => 'required|string|max:20',
            'cne' => 'nullable|string|max:20',
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
            'mot_de_passe' => Hash::make($request->password),
            'type_utilisateur' => $request->type_utilisateur,
            'cin' => $request->cin,
            'cne' => $request->cne,
            'role' => 'user',
            'email_verifie' => false,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ], 201);
    }

    // Connexion
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Récupérer l'utilisateur par email
        $user = User::where('email', $request->email)->first();

        // Vérifier le mot de passe
        if (!$user || !Hash::check($request->password, $user->mot_de_passe)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Vérifier si l'utilisateur est suspendu
        // Seuls les utilisateurs suspendus sont bloqués
        // Les utilisateurs signalés peuvent encore se connecter (c'est juste une alerte pour l'admin)
        if ($user->suspended) {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte a été suspendu. Veuillez contacter l\'administrateur pour plus d\'informations.'
            ], 403);
        }

        // Connecter l'utilisateur
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    // Récupérer l'utilisateur connecté
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }

    // Demande de réinitialisation de mot de passe
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
            return response()->json([
                'success' => true,
                'message' => 'Si cet email existe dans notre système, un lien de réinitialisation vous sera envoyé.'
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Pour des raisons de sécurité, on retourne le même message
            return response()->json([
                'success' => true,
                'message' => 'Si cet email existe dans notre système, un lien de réinitialisation vous sera envoyé.'
            ]);
        }

        // Marquer tous les anciens tokens comme utilisés
        PasswordResetToken::where('user_id', $user->id)
            ->where('used', false)
            ->update(['used' => true]);

        // Générer un nouveau token unique
        $token = Str::random(64);
        
        // Vérifier que le token est unique (très peu probable qu'il ne le soit pas, mais sécurité)
        while (PasswordResetToken::where('token', $token)->exists()) {
            $token = Str::random(64);
        }

        // Créer le token de réinitialisation (valide pendant 1 heure)
        $passwordReset = PasswordResetToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => Carbon::now()->addHours(1),
            'used' => false,
        ]);

        // Construire l'URL de réinitialisation
        $frontendUrl = env('FRONTEND_URL', config('app.url'));
        $resetUrl = $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

        // Envoyer l'email de réinitialisation
        try {
            Mail::to($user->email)->send(new ResetPasswordMail($token, $user->email, $resetUrl));
        } catch (\Exception $e) {
            // Logger l'erreur mais ne pas révéler à l'utilisateur
            \Log::error('Erreur lors de l\'envoi de l\'email de réinitialisation: ' . $e->getMessage());
            // On retourne quand même un message de succès pour des raisons de sécurité
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Si cet email existe dans notre système, un lien de réinitialisation vous sera envoyé.'
        ]);
    }

    // Réinitialisation du mot de passe
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email invalide'
            ], 422);
        }

        // Récupérer le token de réinitialisation
        $passwordReset = PasswordResetToken::byToken($request->token)
            ->where('user_id', $user->id)
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'message' => 'Token de réinitialisation invalide'
            ], 422);
        }

        // Vérifier si le token est valide (non utilisé et non expiré)
        if (!$passwordReset->isValid()) {
            if ($passwordReset->used) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce token de réinitialisation a déjà été utilisé'
                ], 422);
            }

            if ($passwordReset->expires_at->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce token de réinitialisation a expiré. Veuillez en demander un nouveau.'
                ], 422);
            }
        }

        // Mettre à jour le mot de passe
        $user->mot_de_passe = Hash::make($request->password);
        $user->save();

        // Marquer le token comme utilisé
        $passwordReset->markAsUsed();

        // Supprimer tous les autres tokens non utilisés pour cet utilisateur (sécurité)
        PasswordResetToken::where('user_id', $user->id)
            ->where('used', false)
            ->where('id', '!=', $passwordReset->id)
            ->update(['used' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès'
        ]);
    }
}
