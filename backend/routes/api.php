<?php

use App\Http\Controllers\MailController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group( function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login',[UserController::class, 'login']);
});


Route::middleware('auth:sanctum')->group( function () {
    Route::post('/logout',[UserController::class, 'logout']);
    Route::apiResource('/products',ProductController::class);
    Route::post('/purchase',[OrderController::class, 'purchaseProducts']);
    Route::get('/orders/{id}',[OrderController::class, 'customerOrders']);
    Route::get('/search-product',[ProductController::class, 'searchProduct']);
    Route::get('/user-profile',[UserController::class, 'index']);
    Route::get('/total-sales',[OrderController::class, 'totalSales']);
    Route::get('/sales-revenue',[OrderController::class, 'totalRevenue']);
    Route::put('/edit-profile',[UserController::class, 'updateProfile']);
});


