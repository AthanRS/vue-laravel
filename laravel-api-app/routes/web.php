<?php

use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized. Please log in via frontend.'], 401);
})->name('login');
