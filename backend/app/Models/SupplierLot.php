<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SupplierLot extends Model
{
    use HasUuids, Auditable;
    
    protected $guarded = [];

    public function supplier()
    {
        return $this->belongsTo(Organization::class, 'supplier_id');
    }
}
