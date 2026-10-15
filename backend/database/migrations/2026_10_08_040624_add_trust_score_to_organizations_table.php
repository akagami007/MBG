<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->integer('trust_score')->default(100)->after('is_active');
            $table->enum('trust_status', ['ACTIVE', 'PROBATION', 'SUSPENDED'])->default('ACTIVE')->after('trust_score');
        });
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn(['trust_score', 'trust_status']);
        });
    }
};
