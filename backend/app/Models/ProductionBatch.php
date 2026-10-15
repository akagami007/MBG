<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductionBatch extends Model
{
    use HasUuids, Auditable;
    
    protected $guarded = [];

    public function sppg()
    {
        return $this->belongsTo(Organization::class, 'sppg_id');
    }
    
    public function components()
    {
        return $this->hasMany(BatchComponent::class);
    }
    
    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function distributions()
    {
        return $this->hasMany(Distribution::class);
    }
}
