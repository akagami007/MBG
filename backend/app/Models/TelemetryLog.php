<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelemetryLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'distribution_id',
        'temperature',
        'humidity',
        'recorded_at',
    ];

    protected $casts = [
        'temperature' => 'float',
        'humidity' => 'float',
        'recorded_at' => 'datetime',
    ];

    public function distribution()
    {
        return $this->belongsTo(Distribution::class);
    }
}
