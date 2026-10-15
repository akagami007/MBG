<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TraceabilityService;
use App\Services\CorrelationService;
use App\Models\Incident;

class TraceabilityController extends Controller
{
    protected $traceabilityService;
    protected $correlationService;

    public function __construct(TraceabilityService $traceabilityService, CorrelationService $correlationService)
    {
        $this->traceabilityService = $traceabilityService;
        $this->correlationService = $correlationService;
    }

    /**
     * Backward Trace Endpoint
     * GET /api/trace/backward/{batch_id}
     */
    public function traceBackward($batchId)
    {
        try {
            $result = $this->traceabilityService->backwardTrace($batchId);
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Batch not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Forward Trace Endpoint
     * GET /api/trace/forward/{supplier_lot_id}
     */
    public function traceForward($supplierLotId)
    {
        try {
            $result = $this->traceabilityService->forwardTrace($supplierLotId);
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Supplier Lot not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Report an incident and get correlations
     * POST /api/incidents
     */
    public function reportIncident(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'description' => 'required|string',
            'severity' => 'required|in:LOW,MEDIUM,HIGH,CRITICAL',
            'observed_time' => 'required|date',
            'production_batch_id' => 'nullable|uuid|exists:production_batches,id',
            'destination_school_id' => 'nullable|uuid|exists:organizations,id',
        ]);

        $incident = Incident::create($validated);

        // Run correlation
        $alerts = $this->correlationService->correlateIncident($incident);

        return response()->json([
            'success' => true,
            'message' => 'Incident reported successfully.',
            'data' => [
                'incident' => $incident,
                'alerts' => $alerts
            ]
        ], 201);
    }

    /**
     * Get all incidents
     * GET /api/incidents
     */
    public function getIncidents()
    {
        $incidents = Incident::with(['batch', 'destinationSchool'])->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $incidents
        ]);
    }

    /**
     * Receive Batch via QR Scan
     * POST /api/distributions/receive
     */
    public function receiveBatch(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|uuid',
            // In a real app we'd validate the user's school ID matches the distribution destination
        ]);

        $batchId = $request->input('batch_id');

        // Find the distribution record
        $distribution = \App\Models\Distribution::where('production_batch_id', $batchId)
            ->whereNull('receipt_time')
            ->first();

        if (!$distribution) {
            return response()->json([
                'success' => false,
                'message' => 'Valid pending distribution not found for this batch.'
            ], 404);
        }

        // Update receipt
        $distribution->receipt_time = now();
        $distribution->status = 'RECEIVED';
        $distribution->save();

        // ----------------------------------------------------
        // Escrow Settlement Engine (FinOps)
        // ----------------------------------------------------
        $incidentCount = Incident::where('production_batch_id', $batchId)
            ->whereIn('severity', ['HIGH', 'CRITICAL'])
            ->whereNotIn('status', ['RESOLVED', 'DISMISSED'])
            ->count();
            
        $batch = \App\Models\ProductionBatch::find($batchId);
        if ($batch) {
            if ($incidentCount > 0) {
                $batch->payment_status = 'FROZEN';
            } else {
                $batch->payment_status = 'RELEASED';
            }
            $batch->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Batch received successfully. Escrow status updated to ' . ($batch->payment_status ?? 'UNKNOWN'),
            'data' => [
                'distribution' => $distribution,
                'payment_status' => $batch->payment_status ?? 'PENDING'
            ]
        ]);
    }

    /**
     * IoT Telemetry Receiver (Anomaly Engine)
     * POST /api/telemetry
     */
    public function recordTelemetry(Request $request)
    {
        $request->validate([
            'distribution_id' => 'required|uuid',
            'temperature' => 'required|numeric',
            'humidity' => 'nullable|numeric'
        ]);

        $log = \App\Models\TelemetryLog::create([
            'distribution_id' => $request->input('distribution_id'),
            'temperature' => $request->input('temperature'),
            'humidity' => $request->input('humidity'),
            'recorded_at' => now()
        ]);

        // Anomaly Engine: Spoilage Warning if Temp > 25 C
        if ($log->temperature > 25.0) {
            $dist = \App\Models\Distribution::find($log->distribution_id);
            if ($dist) {
                // Check if an active incident already exists for this batch
                $existing = Incident::where('production_batch_id', $dist->production_batch_id)
                    ->where('category', 'TEMPERATURE_VIOLATION')
                    ->whereNotIn('status', ['RESOLVED', 'DISMISSED'])
                    ->first();
                
                if (!$existing) {
                    Incident::create([
                        'production_batch_id' => $dist->production_batch_id,
                        'destination_school_id' => $dist->destination_school_id,
                        'category' => 'TEMPERATURE_VIOLATION',
                        'severity' => 'HIGH',
                        'status' => 'SUBMITTED',
                        'description' => "Cold-chain violation detected. Temperature reached {$log->temperature}°C during distribution.",
                        'observed_time' => now()
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }

    /**
     * Get Vendor Risk Board
     * GET /api/vendors/risk
     */
    public function getVendorRisk()
    {
        $vendors = \App\Models\Organization::whereIn('type', ['SPPG', 'SUPPLIER'])
            ->orderBy('trust_score', 'asc')
            ->limit(5)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $vendors
        ]);
    }
}
