<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, HasApiTokens;

    // Role constants
    const ROLE_SUPERADMIN = 'SUPERADMIN';
    const ROLE_QUALITY_REVIEWER = 'QUALITY_REVIEWER';
    const ROLE_AUDITOR = 'AUDITOR';
    const ROLE_DATA_STEWARD = 'DATA_STEWARD';
    const ROLE_SUPPLIER_CONTACT = 'SUPPLIER_CONTACT';
    const ROLE_PIC_SCHOOL = 'PIC_SCHOOL';
    const ROLE_SPPG = 'SPPG';

    const ALL_ROLES = [
        self::ROLE_SUPERADMIN,
        self::ROLE_QUALITY_REVIEWER,
        self::ROLE_AUDITOR,
        self::ROLE_DATA_STEWARD,
        self::ROLE_SUPPLIER_CONTACT,
        self::ROLE_PIC_SCHOOL,
        self::ROLE_SPPG,
    ];

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPERADMIN;
    }

    public function hasRole(string ...$roles): bool
    {
        if ($this->isSuperAdmin()) return true;
        return in_array($this->role, $roles);
    }

    public function isVendor(): bool
    {
        return in_array($this->role, [self::ROLE_SUPPLIER_CONTACT, self::ROLE_SPPG]);
    }

    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }
}

