<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1D4E89;
            margin-bottom: 10px;
        }
        .content {
            background-color: #ffffff;
            padding: 25px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #1D4E89;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #0d3a6b;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .link {
            word-break: break-all;
            color: #1D4E89;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Darna Agadir</div>
            <p>Plateforme de location étudiante</p>
        </div>

        <div class="content">
            <h2>Réinitialisation de votre mot de passe</h2>
            
            <p>Bonjour,</p>
            
            <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte sur Darna Agadir.</p>
            
            <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
            
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            
            <p>Ou copiez et collez ce lien dans votre navigateur :</p>
            <p class="link">{{ $resetUrl }}</p>
            
            <div class="warning">
                <strong>⚠️ Important :</strong> Ce lien est valide pendant 1 heure seulement. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </div>
            
            <p>Si vous ne pouvez pas cliquer sur le bouton, copiez et collez l'URL ci-dessus dans votre navigateur.</p>
            
            <p>Cordialement,<br>L'équipe Darna Agadir</p>
        </div>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            <p>&copy; {{ date('Y') }} Darna Agadir - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>


