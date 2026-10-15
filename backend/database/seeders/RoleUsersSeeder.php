<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Organization;

class RoleUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch existing organizations for FK references
        $sppgOrg = Organization::where('type', 'SPPG')->first();
        $supplierOrg = Organization::where('type', 'SUPPLIER')->first();
        $schoolOrg = Organization::where('type', 'SCHOOL')->first();

        // ── SUPERADMIN (full access to everything) ──
        User::updateOrCreate(
            ['email' => 'superadmin@mbg.id'],
            [
                'name' => 'Super Administrator',
                'password' => 'password',
                'role' => User::ROLE_SUPERADMIN,
                'organization_id' => null,
                'is_active' => true,
            ]
        );

        // ── AUDITOR ──
        User::updateOrCreate(
            ['email' => 'admin@mbg.id'],
            [
                'name' => 'Auditor MBG',
                'password' => 'password',
                'role' => User::ROLE_AUDITOR,
                'organization_id' => null,
                'is_active' => true,
            ]
        );

        // ── QUALITY REVIEWER ──
        User::updateOrCreate(
            ['email' => 'reviewer@mbg.id'],
            [
                'name' => 'Quality Reviewer',
                'password' => 'password',
                'role' => User::ROLE_QUALITY_REVIEWER,
                'organization_id' => null,
                'is_active' => true,
            ]
        );

        // ── DATA STEWARD ──
        User::updateOrCreate(
            ['email' => 'steward@mbg.id'],
            [
                'name' => 'Data Steward',
                'password' => 'password',
                'role' => User::ROLE_DATA_STEWARD,
                'organization_id' => null,
                'is_active' => true,
            ]
        );

        // ── SPPG (Dapur Umum) ──
        User::updateOrCreate(
            ['email' => 'sppg@mbg.id'],
            [
                'name' => 'Dapur SPPG Jakarta Selatan 1',
                'password' => 'password',
                'role' => User::ROLE_SPPG,
                'organization_id' => $sppgOrg?->id,
                'is_active' => true,
            ]
        );

        // ── SUPPLIER CONTACT ──
        User::updateOrCreate(
            ['email' => 'supplier@mbg.id'],
            [
                'name' => 'PT. Pangan Nusantara',
                'password' => 'password',
                'role' => User::ROLE_SUPPLIER_CONTACT,
                'organization_id' => $supplierOrg?->id,
                'is_active' => true,
            ]
        );

        // ── PIC SCHOOL ──
        User::updateOrCreate(
            ['email' => 'sekolah@mbg.id'],
            [
                'name' => 'PIC SDN 01 Pagi',
                'password' => 'password',
                'role' => User::ROLE_PIC_SCHOOL,
                'organization_id' => $schoolOrg?->id,
                'is_active' => true,
            ]
        );

        $this->command->info('✅ Role-based users seeded!');
        $this->command->table(
            ['Email', 'Role', 'Password'],
            [
                ['superadmin@mbg.id', 'SUPERADMIN', 'password'],
                ['admin@mbg.id', 'AUDITOR', 'password'],
                ['reviewer@mbg.id', 'QUALITY_REVIEWER', 'password'],
                ['steward@mbg.id', 'DATA_STEWARD', 'password'],
                ['sppg@mbg.id', 'SPPG', 'password'],
                ['supplier@mbg.id', 'SUPPLIER_CONTACT', 'password'],
                ['sekolah@mbg.id', 'PIC_SCHOOL', 'password'],
            ]
        );
    }
}
