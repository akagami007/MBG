<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Organization;
use App\Models\SupplierLot;
use App\Models\ProductionBatch;
use App\Models\BatchComponent;
use App\Models\Distribution;
use App\Models\Incident;

class MbgDummySeeder extends Seeder
{
    public function run()
    {
        // 1. Create Organizations
        $sppg = Organization::create([
            'name' => 'SPPG Jakarta Selatan 1',
            'type' => 'SPPG'
        ]);

        $supplierRice = Organization::create([
            'name' => 'PT. Pangan Nusantara',
            'type' => 'SUPPLIER'
        ]);

        $supplierChicken = Organization::create([
            'name' => 'CV. Ayam Sehat',
            'type' => 'SUPPLIER'
        ]);

        $supplierVeg = Organization::create([
            'name' => 'Tani Mandiri',
            'type' => 'SUPPLIER'
        ]);

        $school1 = Organization::create([
            'name' => 'SDN 01 Pagi',
            'type' => 'SCHOOL'
        ]);

        $school2 = Organization::create([
            'name' => 'SDN 03 Petang',
            'type' => 'SCHOOL'
        ]);

        $school3 = Organization::create([
            'name' => 'SMPN 115',
            'type' => 'SCHOOL'
        ]);

        // 2. Create Supplier Lots
        $lotRice = SupplierLot::create([
            'supplier_id' => $supplierRice->id,
            'lot_code' => 'LOT-RICE-001',
            'commodity' => 'RICE',
            'quantity' => 200,
            'unit' => 'KG',
            'received_at' => now()->subDays(2)
        ]);

        $lotChicken = SupplierLot::create([
            'supplier_id' => $supplierChicken->id,
            'lot_code' => 'LOT-CHK-992',
            'commodity' => 'CHICKEN',
            'quantity' => 50,
            'unit' => 'KG',
            'received_at' => now()->subDays(1)
        ]);

        $lotVeg = SupplierLot::create([
            'supplier_id' => $supplierVeg->id,
            'lot_code' => 'LOT-VEG-445',
            'commodity' => 'VEGETABLE',
            'quantity' => 30,
            'unit' => 'KG',
            'received_at' => now()->subHours(12)
        ]);

        // 3. Create Production Batch (Force specific UUID for frontend hardcoding)
        $batchId = '11111111-2222-3333-4444-555555555555';
        $batch = ProductionBatch::create([
            'id' => $batchId,
            'sppg_id' => $sppg->id,
            'batch_code' => 'BATCH-2026-X892',
            'menu_label' => 'Chicken Rice Set',
            'quantity' => 150,
            'production_time' => now()->subHours(6)
        ]);

        // 4. Link Lots to Batch
        BatchComponent::create([
            'production_batch_id' => $batch->id,
            'supplier_lot_id' => $lotRice->id,
            'quantity_used' => 100
        ]);
        BatchComponent::create([
            'production_batch_id' => $batch->id,
            'supplier_lot_id' => $lotChicken->id,
            'quantity_used' => 25
        ]);
        BatchComponent::create([
            'production_batch_id' => $batch->id,
            'supplier_lot_id' => $lotVeg->id,
            'quantity_used' => 15
        ]);

        // 5. Create Distributions
        Distribution::create([
            'production_batch_id' => $batch->id,
            'destination_school_id' => $school1->id,
            'status' => 'DELIVERED',
            'dispatch_time' => now()->subHours(5),
            'receipt_time' => now()->subHours(4)
        ]);
        Distribution::create([
            'production_batch_id' => $batch->id,
            'destination_school_id' => $school2->id,
            'status' => 'DELIVERED',
            'dispatch_time' => now()->subHours(5),
            'receipt_time' => now()->subHours(3)
        ]);
        Distribution::create([
            'production_batch_id' => $batch->id,
            'destination_school_id' => $school3->id,
            'status' => 'DELIVERED',
            'dispatch_time' => now()->subHours(5),
            'receipt_time' => now()->subHours(3)
        ]);

        // 6. Create Incidents
        Incident::create([
            'production_batch_id' => $batch->id,
            'destination_school_id' => $school1->id,
            'category' => 'Quality Issue',
            'description' => 'Food smells sour.',
            'severity' => 'HIGH',
            'status' => 'DRAFT',
            'observed_time' => now()->subHours(1)
        ]);

        Incident::create([
            'production_batch_id' => $batch->id,
            'destination_school_id' => $school2->id,
            'category' => 'Delay',
            'description' => 'Delivery 2 hours late.',
            'severity' => 'MEDIUM',
            'status' => 'INVESTIGATING',
            'observed_time' => now()->subHours(2)
        ]);
        
        $this->command->info('Dummy data seeded! Batch ID: ' . $batch->id);
    }
}
