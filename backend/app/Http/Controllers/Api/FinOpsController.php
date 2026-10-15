<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductionBatch;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;

class FinOpsController extends Controller
{
    /**
     * Get Escrow Dashboard Overview
     * GET /api/finops/overview
     */
    public function getOverview()
    {
        // Total funds requested/pending
        $totalPending = ProductionBatch::where('payment_status', 'PENDING')->sum('escrow_amount');
        
        // Total funds released
        $totalReleased = ProductionBatch::where('payment_status', 'RELEASED')->sum('escrow_amount');
        
        // Total funds frozen due to incidents
        $totalFrozen = ProductionBatch::where('payment_status', 'FROZEN')->sum('escrow_amount');

        // Get batches with their SPPGs
        $batches = ProductionBatch::with(['sppg', 'incidents'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'batch_code' => $batch->batch_code,
                    'menu_label' => $batch->menu_label,
                    'escrow_amount' => $batch->escrow_amount,
                    'payment_status' => $batch->payment_status,
                    'kitchen_name' => $batch->sppg->name ?? 'Unknown SPPG',
                    'incidents_count' => $batch->incidents->count(),
                    'created_at' => $batch->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'metrics' => [
                    'total_pending' => $totalPending,
                    'total_released' => $totalReleased,
                    'total_frozen' => $totalFrozen,
                ],
                'batches' => $batches
            ]
        ]);
    }
}
