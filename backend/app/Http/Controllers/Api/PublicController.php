<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductionBatch;
use App\Models\Incident;

class PublicController extends Controller
{
    /**
     * Get public trace summary for a batch code
     * GET /api/public/trace/{batch_code}
     */
    public function verifyBatch($batchCode)
    {
        $batch = ProductionBatch::with(['sppg'])
            ->where('batch_code', $batchCode)
            ->first();

        if (!$batch) {
            return response()->json([
                'success' => false,
                'message' => 'Kode Batch tidak ditemukan. Pastikan Anda memasukkan kode yang benar.'
            ], 404);
        }

        // Check if there are any critical/high incidents causing a recall
        $incidents = Incident::where('production_batch_id', $batch->id)
            ->whereIn('severity', ['HIGH', 'CRITICAL'])
            ->whereNotIn('status', ['RESOLVED', 'DISMISSED'])
            ->count();
            
        $isSafe = $incidents === 0;

        return response()->json([
            'success' => true,
            'data' => [
                'batch_code' => $batch->batch_code,
                'menu_label' => $batch->menu_label,
                'production_time' => $batch->production_time,
                'kitchen_name' => $batch->sppg->name ?? 'Dapur Umum MBG',
                'is_safe' => $isSafe,
                'status_message' => $isSafe ? 'Makanan Aman Dikonsumsi' : 'PERINGATAN: Makanan sedang dalam status Penarikan (Recall)'
            ]
        ]);
    }
}
