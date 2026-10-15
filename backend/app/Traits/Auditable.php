<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    /**
     * Boot the auditable trait for a model.
     */
    public static function bootAuditable()
    {
        static::created(function ($model) {
            self::logAudit('CREATE', $model, null, $model->getAttributes());
        });

        static::updated(function ($model) {
            self::logAudit('UPDATE', $model, $model->getOriginal(), $model->getChanges());
        });

        static::deleted(function ($model) {
            self::logAudit('DELETE', $model, $model->getAttributes(), null);
        });
    }

    /**
     * Log the audit.
     */
    protected static function logAudit($action, $model, $oldValues = null, $newValues = null)
    {
        // Don't log if there are no changes on update
        if ($action === 'UPDATE' && empty($newValues)) {
            return;
        }

        $lastLog = AuditLog::orderBy('created_at', 'desc')->orderBy('id', 'desc')->first();
        $previousHash = $lastLog ? $lastLog->hash : 'GENESIS';

        $payload = [
            'old_values' => $oldValues,
            'new_values' => $newValues,
        ];

        // Create a deterministic string to hash
        $dataToHash = json_encode([
            'action' => $action,
            'entity_type' => get_class($model),
            'entity_id' => $model->id,
            'payload' => $payload,
            'previous_hash' => $previousHash
        ]);

        $hash = hash('sha256', $dataToHash);

        AuditLog::create([
            'user_id' => Auth::id(), // Could be null if CLI/Seeder
            'action' => $action,
            'entity_type' => get_class($model),
            'entity_id' => $model->id,
            'payload' => $payload,
            'ip_address' => request()->ip(),
            'previous_hash' => $previousHash,
            'hash' => $hash
        ]);
    }
}
