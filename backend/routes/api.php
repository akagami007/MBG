<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TraceabilityController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlockchainController;
use App\Http\Controllers\Api\FinOpsController;
use App\Http\Controllers\Api\GeoController;

/*
|--------------------------------------------------------------------------
| RBAC Matrix (SUPERADMIN memiliki akses ke SEMUA endpoint)
|--------------------------------------------------------------------------
| SUPERADMIN        → Full access (auto-bypass di middleware CheckRole)
| AUDITOR           → Dashboard, Trace, Incidents, Blockchain, FinOps, Reports, Geo, AI
| QUALITY_REVIEWER  → Dashboard, Trace, Incidents, Reports
| DATA_STEWARD      → Import, Trace, Telemetry
| SUPPLIER_CONTACT  → Vendor Portal (own data only)
| SPPG              → Vendor Portal, Production Batches (own data only)
| PIC_SCHOOL        → QR Scan, Receive Distribution, Report Incident
*/

// ── Public (No Auth) ────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/trace/{batch_code}', [App\Http\Controllers\Api\PublicController::class, 'verifyBatch']);

// ── Authenticated Routes ────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Profile & Session
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // ── Traceability Engine (Auditor, QR, Data Steward can trace) ──
    Route::prefix('trace')
        ->middleware('role:AUDITOR,QUALITY_REVIEWER,DATA_STEWARD')
        ->group(function () {
            Route::get('/backward/{batchId}', [TraceabilityController::class, 'traceBackward']);
            Route::get('/forward/{supplierLotId}', [TraceabilityController::class, 'traceForward']);
        });

    // ── Incidents ──
    Route::get('/incidents', [TraceabilityController::class, 'getIncidents'])
        ->middleware('role:AUDITOR,QUALITY_REVIEWER,PIC_SCHOOL');
    Route::post('/incidents', [TraceabilityController::class, 'reportIncident'])
        ->middleware('role:AUDITOR,QUALITY_REVIEWER,PIC_SCHOOL');

    // ── Field Operations (PIC School receives batches) ──
    Route::post('/distributions/receive', [TraceabilityController::class, 'receiveBatch'])
        ->middleware('role:PIC_SCHOOL');

    // ── Vendor Risk Board ──
    Route::get('/vendors/risk', [TraceabilityController::class, 'getVendorRisk'])
        ->middleware('role:AUDITOR,QUALITY_REVIEWER');

    // ── AI Copilot (Auditor, QR, Superadmin) ──
    Route::post('/ai/chat', [App\Http\Controllers\Api\CopilotController::class, 'chat'])
        ->middleware('role:AUDITOR,QUALITY_REVIEWER');

    // ── IoT Telemetry ──
    Route::post('/telemetry', [TraceabilityController::class, 'recordTelemetry'])
        ->middleware('role:DATA_STEWARD');

    // ── Bulk Import (Data Steward only) ──
    Route::prefix('import')
        ->middleware('role:DATA_STEWARD')
        ->group(function () {
            Route::post('/supplier-lots', [ImportController::class, 'importSupplierLots']);
        });

    // ── Reports & Audit (Auditor, QR) ──
    Route::prefix('reports')
        ->middleware('role:AUDITOR,QUALITY_REVIEWER')
        ->group(function () {
            Route::get('/batch/{batchId}', [ReportController::class, 'generateBatchReport']);
        });

    // ── Blockchain Explorer (Auditor) ──
    Route::prefix('blockchain')
        ->middleware('role:AUDITOR')
        ->group(function () {
            Route::get('/explorer', [BlockchainController::class, 'getExplorer']);
        });

    // ── FinOps & Escrow (Auditor) ──
    Route::prefix('finops')
        ->middleware('role:AUDITOR')
        ->group(function () {
            Route::get('/overview', [FinOpsController::class, 'getOverview']);
        });

    // ── Geospatial Map (Auditor, QR) ──
    Route::prefix('geo')
        ->middleware('role:AUDITOR,QUALITY_REVIEWER')
        ->group(function () {
            Route::get('/network', [GeoController::class, 'getNetwork']);
            Route::get('/incidents', [GeoController::class, 'getIncidents']);
        });

    // ── User Management (Superadmin only – role auto-bypass handles this) ──
    Route::prefix('admin')
        ->middleware('role:SUPERADMIN')
        ->group(function () {
            Route::get('/users', [AuthController::class, 'listUsers']);
            Route::post('/users', [AuthController::class, 'createUser']);
            Route::put('/users/{id}', [AuthController::class, 'updateUser']);
            Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
        });
});
