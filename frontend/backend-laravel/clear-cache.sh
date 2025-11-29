#!/bin/bash
# Script pour vider tous les caches Laravel

php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear

echo "Tous les caches ont été vidés!"

