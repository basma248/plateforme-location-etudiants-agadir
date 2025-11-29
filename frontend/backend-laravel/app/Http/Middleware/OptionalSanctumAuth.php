<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class OptionalSanctumAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si un token est présent, essayer de l'authentifier
        $token = $request->bearerToken();
        
        \Log::info('=== OptionalSanctumAuth Middleware ===');
        \Log::info('Token présent: ' . ($token ? 'oui (' . substr($token, 0, 20) . '...)' : 'non'));
        
        if ($token) {
            try {
                $accessToken = PersonalAccessToken::findToken($token);
                \Log::info('AccessToken trouvé: ' . ($accessToken ? 'oui' : 'non'));
                
                if ($accessToken && $accessToken->tokenable) {
                    $user = $accessToken->tokenable;
                    \Log::info('User trouvé: ID ' . $user->id . ' - ' . $user->email);
                    
                    // Authentifier l'utilisateur avec le guard Sanctum
                    Auth::guard('sanctum')->setUser($user);
                    
                    // Aussi définir l'utilisateur sur la requête
                    $request->setUserResolver(function () use ($user) {
                        return $user;
                    });
                    
                    // Vérifier que ça fonctionne
                    $testUser = $request->user();
                    \Log::info('Vérification $request->user(): ' . ($testUser ? '✅ OK (ID: ' . $testUser->id . ')' : '❌ NULL'));
                } else {
                    \Log::warning('Token trouvé mais tokenable est null');
                }
            } catch (\Exception $e) {
                \Log::error('Erreur dans OptionalSanctumAuth: ' . $e->getMessage());
                \Log::error('Stack trace: ' . $e->getTraceAsString());
            }
        }
        
        return $next($request);
    }
}
