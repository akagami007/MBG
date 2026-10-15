<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Incident extends Model
{
    use HasUuids, Auditable;
    
    protected $guarded = [];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
    
    public function destinationSchool()
    {
        return $this->belongsTo(Organization::class, 'destination_school_id');
    }
    
    public function batch()
    {
        return $this->belongsTo(ProductionBatch::class, 'production_batch_id');
    }
}
