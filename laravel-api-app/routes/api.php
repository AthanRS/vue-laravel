<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Post;

Route::get('/posts/check-title', function(Request $request) {
    $title = $request->query('title');
    $exists = Post::where('title', $title)->exists();
    return response()->json(['exists' => $exists]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->get('/users', function () {
    return App\Models\User::all();
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/email/resend', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification email resent']);
    });

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


Route::get('/email/verify/{id}/{hash}', function (Request $request) {
    $user = User::findOrFail($request->route('id'));

    // Manually check if hash is valid
    if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link.');
    }

    // Mark as verified if not yet
    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        Log::info("Email verified for user ID: " . $user->id);
    }

    return redirect('http://localhost:5173/verification-success');
})->middleware('signed')->name('verification.verify');



Route::middleware('auth:sanctum')->delete('/users/{id}', [UserController::class, 'destroy']);
Route::middleware('auth:sanctum')->put('/users/{id}', [UserController::class, 'update']);

Route::post('/verification-success', [AuthController::class,'verification-success']);
Route::apiResource('posts', PostController::class);
Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);
Route::post('/logout', [AuthController::class,'logout'])->middleware('auth:sanctum');
