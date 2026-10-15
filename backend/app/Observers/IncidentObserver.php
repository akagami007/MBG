<?php

namespace App\Observers;

use App\Models\Incident;
use App\Models\Organization;
use App\Models\ProductionBatch;

class IncidentObserver
{
    /**
     * Handle the Incident "created" event.
     */
    public function created(Incident $incident): void
    {
        // Calculate penalty based on severity
        $penalty = 0;
        if ($incident->severity === 'CRITICAL') {
            $penalty = 15;
        } elseif ($incident->severity === 'HIGH') {
            $penalty = 5;
        }

        if ($penalty > 0 && $incident->production_batch_id) {
            // Find the responsible SPPG
            $batch = ProductionBatch::find($incident->production_batch_id);
            if ($batch && $batch->sppg_id) {
                $sppg = Organization::find($batch->sppg_id);
                if ($sppg) {
                    $sppg->trust_score -= $penalty;
                    
                    // Update trust status
                    if ($sppg->trust_score < 50) {
                        $sppg->trust_status = 'SUSPENDED';
                    } elseif ($sppg->trust_score < 70) {
                        $sppg->trust_status = 'PROBATION';
                    }
                    
                    $sppg->save();
                }
            }
        }
    }

    /**
     * Handle the Incident "updated" event.
     */
    public function updated(Incident $incident): void
    {
        // Could implement logic if an incident is reversed/dismissed to restore points
    }

    /**
     * Handle the Incident "deleted" event.
     */
    public function deleted(Incident $incident): void
    {
        //
    }

    /**
     * Handle the Incident "restored" event.
     */
    public function restored(Incident $incident): void
    {
        //
    }

    /**
     * Handle the Incident "force deleted" event.
     */
    public function forceDeleted(Incident $incident): void
    {
        //
    }
}
