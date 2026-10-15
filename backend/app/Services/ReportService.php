<?php

namespace App\Services;

use App\Models\ProductionBatch;
use Carbon\Carbon;

class ReportService
{
    protected $traceabilityService;

    public function __construct(TraceabilityService $traceabilityService)
    {
        $this->traceabilityService = $traceabilityService;
    }

    /**
     * Generate a consolidated Audit Report for a specific batch.
     */
    public function generateBatchAuditReport(string $batchId): array
    {
        // 1. Fetch the Trace Data
        $traceData = $this->traceabilityService->backwardTrace($batchId);
        
        $batch = ProductionBatch::with(['incidents', 'distributions'])->findOrFail($batchId);

        // 2. Aggregate Incidents
        $incidents = $batch->incidents->map(function ($incident) {
            return [
                'incident_id' => $incident->id,
                'category' => $incident->category,
                'severity' => $incident->severity,
                'status' => $incident->status,
                'description' => $incident->description,
                'observed_time' => $incident->observed_time,
            ];
        });

        // 3. Data Quality Warnings
        $warnings = [];
        if ($batch->source_system === null) {
            $warnings[] = "WARN_MISSING_PROVENANCE: The production batch does not have a source_system defined.";
        }
        foreach ($traceData['ingredient_lineage'] as $lineage) {
            if (!isset($lineage['supplier_lot']['received_at']) || $lineage['supplier_lot']['received_at'] === null) {
                $warnings[] = "WARN_MISSING_TIMESTAMP: Ingredient lot {$lineage['supplier_lot']['lot_code']} is missing a received_at timestamp.";
            }
        }

        // 4. Construct Final Report
        $report = [
            'report_metadata' => [
                'generated_at' => Carbon::now()->toIso8601String(),
                'generator_system' => 'MBG SafeTrace v0.1',
                'report_type' => 'BATCH_AUDIT_REPORT',
                'target_id' => $batchId
            ],
            'traceability_summary' => $traceData,
            'incidents_summary' => [
                'total_incidents' => $incidents->count(),
                'highest_severity' => $this->calculateHighestSeverity($incidents->toArray()),
                'records' => $incidents
            ],
            'data_quality_warnings' => $warnings,
            'cryptographic_hash' => null // Placeholder for Phase 7 (digital signatures)
        ];

        // Assign a mock hash for the prototype
        $report['cryptographic_hash'] = hash('sha256', json_encode($report));

        return $report;
    }

    private function calculateHighestSeverity(array $incidents): string
    {
        if (empty($incidents)) return 'NONE';

        $severities = array_column($incidents, 'severity');
        if (in_array('CRITICAL', $severities)) return 'CRITICAL';
        if (in_array('HIGH', $severities)) return 'HIGH';
        if (in_array('MEDIUM', $severities)) return 'MEDIUM';
        return 'LOW';
    }
}
