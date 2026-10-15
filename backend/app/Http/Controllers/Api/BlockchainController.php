<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class BlockchainController extends Controller
{
    /**
     * Get Blockchain Explorer Data
     * GET /api/blockchain/explorer
     */
    public function getExplorer(Request $request)
    {
        // Simple pagination for the explorer
        $logs = AuditLog::orderBy('created_at', 'desc')->paginate(10);
        
        // Map payload to metadata for UI
        $mappedLogs = $logs->getCollection()->map(function($log) {
            return [
                'id' => $log->id,
                'created_at' => $log->created_at,
                'hash' => $log->hash,
                'previous_hash' => $log->previous_hash,
                'nonce' => 84931, // Mocked for UI, as we don't have it in schema
                'metadata' => [
                    'action' => $log->action,
                    'entity_type' => $log->entity_type,
                    'entity_id' => $log->entity_id,
                    'payload' => $log->payload
                ]
            ];
        });

        $logs->setCollection($mappedLogs);
        
        return response()->json([
            'success' => true,
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total()
            ]
        ]);
    }
}
