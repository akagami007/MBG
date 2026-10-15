<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ProductionBatch;

$batches = ProductionBatch::all();
foreach ($batches as $batch) {
    // Generate an escrow amount like 5_000_000 to 15_000_000
    $batch->escrow_amount = rand(5000000, 15000000);
    $batch->payment_status = rand(0, 10) > 2 ? 'RELEASED' : 'PENDING';
    $batch->save();
}

echo "Updated " . count($batches) . " batches with escrow money!\n";
