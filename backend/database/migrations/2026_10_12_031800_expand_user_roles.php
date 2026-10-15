<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // PostgreSQL: Drop constraint on users table
        DB::statement("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");

        // Change column to varchar temporarily, then back to enum with new values
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'SUPERADMIN',
                'QUALITY_REVIEWER',
                'AUDITOR',
                'DATA_STEWARD',
                'SUPPLIER_CONTACT',
                'PIC_SCHOOL',
                'SPPG',
            ])->default('PIC_SCHOOL')->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'QUALITY_REVIEWER',
                'AUDITOR',
                'DATA_STEWARD',
                'SUPPLIER_CONTACT',
                'PIC_SCHOOL',
            ])->default('PIC_SCHOOL')->change();
        });
    }
};
