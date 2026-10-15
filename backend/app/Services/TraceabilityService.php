<?php

namespace App\Services;

use App\Models\ProductionBatch;
use App\Models\SupplierLot;
use App\Models\Incident;

class TraceabilityService
{
    /**
     * Backward Trace: Trace a batch back to its ingredients and forward to its distributions.
     * Often initiated from a Batch ID when an incident is reported.
     */
    public function backwardTrace(string $batchId)
    {
        $batch = ProductionBatch::with([
            'sppg',
            'components.supplierLot.supplier',
            'distributions.destinationSchool',
            'distributions.telemetryLogs'
        ])->findOrFail($batchId);

        return [
            'type' => 'backward_trace',
            'batch_id' => $batch->id,
            'batch_code' => $batch->batch_code,
            'menu_label' => $batch->menu_label,
            'production_time' => $batch->production_time,
            'sppg' => $batch->sppg,
            'ingredient_lineage' => $batch->components->map(function ($component) {
                return [
                    'component_id' => $component->id,
                    'quantity_used' => $component->quantity_used,
                    'supplier_lot' => $component->supplierLot,
                    'supplier' => $component->supplierLot->supplier ?? null,
                ];
            }),
            'distribution_destinations' => $batch->distributions->map(function ($distribution) {
                return [
                    'distribution_id' => $distribution->id,
                    'status' => $distribution->status,
                    'destination_school' => $distribution->destinationSchool,
                    'dispatch_time' => $distribution->dispatch_time,
                    'receipt_time' => $distribution->receipt_time,
                    'telemetry' => $this->calculateTelemetryPrediction($distribution->telemetryLogs),
                ];
            }),
            'provenance' => [
                'source_system' => $batch->source_system,
                'source_ref' => $batch->source_ref,
            ]
        ];
    }

    /**
     * Machine Learning: Simple Linear Regression for Spoilage Prediction
     */
    private function calculateTelemetryPrediction($telemetryLogs)
    {
        $points = $telemetryLogs->sortBy('recorded_at')->values();
        $n = count($points);
        
        $results = [];
        foreach ($points as $p) {
            $results[] = [
                'id' => $p->id,
                'recorded_at' => $p->recorded_at,
                'temperature' => $p->temperature,
                'is_prediction' => false
            ];
        }

        if ($n < 2) return $results;

        // Convert times to relative seconds for regression
        $firstTime = strtotime($points[0]->recorded_at);
        $sumX = 0; $sumY = 0; $sumXY = 0; $sumX2 = 0;

        foreach ($points as $p) {
            $x = strtotime($p->recorded_at) - $firstTime;
            $y = $p->temperature;
            $sumX += $x;
            $sumY += $y;
            $sumXY += ($x * $y);
            $sumX2 += ($x * $x);
        }

        $denominator = ($n * $sumX2) - ($sumX * $sumX);
        $slope = 0;
        if ($denominator != 0) {
            $slope = (($n * $sumXY) - ($sumX * $sumY)) / $denominator;
        }
        $intercept = ($sumY - ($slope * $sumX)) / $n;

        // Extrapolate if slope is positive (temperature is rising)
        // Predict 4 more points, 15 mins apart (900 seconds)
        if ($slope > 0) {
            $lastTime = strtotime($points[$n - 1]->recorded_at);
            $lastRelativeTime = $lastTime - $firstTime;
            
            // The starting point of prediction matches the last known point
            $results[count($results)-1]['predicted_temperature'] = $points[$n - 1]->temperature;

            for ($i = 1; $i <= 4; $i++) {
                $futureRelativeTime = $lastRelativeTime + ($i * 900); // +15 mins each
                $futureTemp = ($slope * $futureRelativeTime) + $intercept;
                
                $results[] = [
                    'id' => 'pred_' . $i,
                    'recorded_at' => date('Y-m-d H:i:s', $lastTime + ($i * 900)),
                    'predicted_temperature' => round($futureTemp, 2),
                    'is_prediction' => true
                ];
            }
        }

        return $results;
    }


    /**
     * Forward Trace: Trace a Supplier Lot forward to all batches it was used in, 
     * and subsequently all schools that received those batches.
     */
    public function forwardTrace(string $supplierLotId)
    {
        $lot = SupplierLot::with([
            'supplier',
            'batchComponents.batch.distributions.destinationSchool'
        ])->findOrFail($supplierLotId);

        return [
            'type' => 'forward_trace',
            'supplier_lot_id' => $lot->id,
            'lot_code' => $lot->lot_code,
            'commodity' => $lot->commodity,
            'quantity' => $lot->quantity,
            'supplier' => $lot->supplier,
            'usage_lineage' => $lot->batchComponents->map(function ($component) {
                $batch = $component->batch;
                return [
                    'quantity_used_in_batch' => $component->quantity_used,
                    'production_batch' => [
                        'batch_id' => $batch->id,
                        'batch_code' => $batch->batch_code,
                        'menu_label' => $batch->menu_label,
                        'sppg_id' => $batch->sppg_id,
                        'distributions' => $batch->distributions->map(function ($dist) {
                            return [
                                'school_id' => $dist->destination_school_id,
                                'school_name' => $dist->destinationSchool->name ?? null,
                                'status' => $dist->status
                            ];
                        })
                    ]
                ];
            }),
            'provenance' => [
                'source_system' => $lot->source_system,
                'source_ref' => $lot->source_ref,
            ]
        ];
    }
}
