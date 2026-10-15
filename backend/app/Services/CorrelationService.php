<?php

namespace App\Services;

use App\Models\Incident;
use App\Models\ProductionBatch;
use App\Models\BatchComponent;

class CorrelationService
{
    /**
     * Run all correlation rules against a new incident.
     */
    public function correlateIncident(Incident $incident)
    {
        $alerts = [];

        // R-01: Same batch + incidents from >= 2 destinations
        if ($incident->production_batch_id) {
            $sameBatchAlert = $this->checkRule01($incident);
            if ($sameBatchAlert) $alerts[] = $sameBatchAlert;
            
            // R-02 & R-03: Same ingredient lot or supplier lot
            $lotAlerts = $this->checkRule02And03($incident);
            $alerts = array_merge($alerts, $lotAlerts);
        }

        // R-04: Data conflict - implemented as a separate job usually, but checking here 
        // if multiple evidence entries contradict each other (omitted for MVP brevity, can be expanded).
        
        return $alerts;
    }

    /**
     * Rule R-01: Same batch.
     * Trigger if at least two incidents from DIFFERENT destinations share a production batch.
     */
    private function checkRule01(Incident $incident)
    {
        $relatedIncidents = Incident::where('production_batch_id', $incident->production_batch_id)
            ->where('id', '!=', $incident->id)
            ->get();
            
        $destinations = $relatedIncidents->pluck('destination_school_id')->filter()->unique();
        $destinations->push($incident->destination_school_id);
        $uniqueDestinationsCount = $destinations->unique()->count();

        if ($uniqueDestinationsCount >= 2) {
            return [
                'rule' => 'R-01',
                'title' => 'Possible common-source pattern (Batch)',
                'confidence' => 'HIGH',
                'description' => "Multiple incidents reported across {$uniqueDestinationsCount} different destinations for the same production batch.",
                'trigger_batch_id' => $incident->production_batch_id,
                'related_incident_ids' => $relatedIncidents->pluck('id')->push($incident->id)->toArray(),
            ];
        }

        return null;
    }

    /**
     * Rule R-02 & R-03: Same ingredient lot / Same supplier lot.
     * Trigger if incidents map to batches sharing an ingredient lot or supplier lot.
     */
    private function checkRule02And03(Incident $incident)
    {
        $alerts = [];
        
        // Get the lots used in this incident's batch
        $lots = BatchComponent::where('production_batch_id', $incident->production_batch_id)
            ->pluck('supplier_lot_id');
            
        if ($lots->isEmpty()) return $alerts;
        
        // Find other batches that used these lots
        $otherBatches = BatchComponent::whereIn('supplier_lot_id', $lots)
            ->where('production_batch_id', '!=', $incident->production_batch_id)
            ->pluck('production_batch_id')
            ->unique();
            
        if ($otherBatches->isEmpty()) return $alerts;
        
        // Find incidents linked to those other batches
        $relatedIncidents = Incident::whereIn('production_batch_id', $otherBatches)
            ->get();
            
        if ($relatedIncidents->isNotEmpty()) {
            $alerts[] = [
                'rule' => 'R-02/R-03',
                'title' => 'Possible common-source pattern (Ingredient Lot)',
                'confidence' => 'MEDIUM',
                'description' => "Incidents reported across different batches that share the same ingredient lot(s).",
                'shared_lot_ids' => $lots->toArray(),
                'related_incident_ids' => $relatedIncidents->pluck('id')->push($incident->id)->toArray(),
            ];
        }

        return $alerts;
    }
}
