<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Example API routes
Route::middleware('api')->group(function () {
    Route::post('/register', 'App\Http\Controllers\AuthController@register');
    Route::post('/login', 'App\Http\Controllers\AuthController@login');
    Route::get('/user', 'App\Http\Controllers\UserController@show')->middleware('auth:api');
});

// Additional routes can be added here as needed.