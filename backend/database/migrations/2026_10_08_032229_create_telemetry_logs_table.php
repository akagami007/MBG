<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telemetry_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('distribution_id')->index();
            $table->float('temperature')->nullable();
            $table->float('humidity')->nullable();
            $table->timestampTz('recorded_at');
            $table->timestamps();

            $table->foreign('distribution_id')->references('id')->on('distributions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telemetry_logs');
    }
};
