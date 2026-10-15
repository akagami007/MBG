<?php
$distribution = \App\Models\Distribution::first();
if ($distribution) {
    // Delete existing logs for this distribution to start fresh
    \App\Models\TelemetryLog::where('distribution_id', $distribution->id)->delete();
    
    // Create a rising temperature trend
    $temps = [18.5, 19.2, 20.1, 21.5, 22.8];
    $baseTime = time() - (count($temps) * 15 * 60); // start 1.25 hours ago

    foreach ($temps as $idx => $temp) {
        \App\Models\TelemetryLog::create([
            'distribution_id' => $distribution->id,
            'temperature' => $temp,
            'humidity' => 60,
            'recorded_at' => date('Y-m-d H:i:s', $baseTime + ($idx * 15 * 60))
        ]);
    }
    echo "Injected " . count($temps) . " telemetry logs for distribution {$distribution->id}!\n";
} else {
    echo "No distribution found.\n";
}
