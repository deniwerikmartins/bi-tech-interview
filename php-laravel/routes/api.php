<?php

use App\Http\Controllers\Api\PatientController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

/**
 * Health check — verifies app and database connectivity.
 */
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (\Exception $e) {
        $dbStatus = 'unavailable';
    }

    return response()->json([
        'status'   => $dbStatus === 'connected' ? 'ok' : 'degraded',
        'database' => $dbStatus,
        'app'      => config('app.name'),
    ], $dbStatus === 'connected' ? 200 : 503);
});

/**
 * Patient CRUD endpoints.
 */
Route::apiResource('patients', PatientController::class);
