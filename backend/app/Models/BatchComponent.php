<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BatchComponent extends Model
{
    use HasUuids;
    
    protected $guarded = [];

    public function batch()
    {
        return $this->belongsTo(ProductionBatch::class, 'production_batch_id');
    }
    
    public function supplierLot()
    {
        return $this->belongsTo(SupplierLot::class, 'supplier_lot_id');
    }
}
